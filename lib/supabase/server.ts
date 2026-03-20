import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Supabase client for Server Components / Route Handlers.
 * Handles session cookies via Next.js `cookies()`.
 * In Next.js 15+, `cookies()` is async.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions)
            })
          } catch {
            // In some server component contexts Next.js may throw on cookie writes.
            // Supabase Proxy/middleware will handle refresh cookies when needed.
          }
        },
      },
    }
  )
}

