import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const learnerPathPrefixes = ['/dashboard', '/find', '/book', '/sessions', '/chatbot']
const yazaPathPrefixes = ['/yaza']
const adminPathPrefixes = ['/admin']

function isLearnerRoute(pathname: string) {
  return learnerPathPrefixes.some((prefix) => pathname.startsWith(prefix))
}

function isYazaRoute(pathname: string) {
  return yazaPathPrefixes.some((prefix) => pathname.startsWith(prefix))
}

function isAdminRoute(pathname: string) {
  return adminPathPrefixes.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  // This response object is where Supabase session cookie refreshes are written to.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  // Refresh session cookies on every request that hits the middleware.
  await supabase.auth.getSession()

  const { data } = await supabase.auth.getUser()
  const user = data.user

  const pathname = request.nextUrl.pathname

  const isProtectedRoute = isLearnerRoute(pathname) || isYazaRoute(pathname) || isAdminRoute(pathname)

  // Redirect unauthenticated users on protected routes to login.
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based routing (admin / yaza).
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('auth_user_id', user.id)
      .single()

    const role = profile?.role

    // User exists in auth but has no public.users row yet:
    // let them pass to profile setup so sync flow can complete.
    if (!role && isProtectedRoute && pathname !== '/profile/setup') {
      return NextResponse.redirect(new URL('/profile/setup', request.url))
    }

    if (isAdminRoute(pathname) && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isYazaRoute(pathname) && role !== 'yaza' && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isLearnerRoute(pathname) && role !== 'learner' && role !== 'admin') {
      return NextResponse.redirect(new URL('/yaza/dashboard', request.url))
    }

    // If an admin lands outside /admin, guide them to the admin dashboard.
    if (role === 'admin' && !isAdminRoute(pathname)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

