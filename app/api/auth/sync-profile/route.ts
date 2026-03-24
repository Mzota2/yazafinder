import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import { createSupabaseServerClient } from '@/lib/supabase/server'

type SyncProfileBody = {
  role?: 'learner' | 'yaza' | 'admin'
  fullName?: string
  phone?: string
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await req.json().catch(() => ({}))) as SyncProfileBody
    const role = body.role ?? (user.user_metadata?.role as SyncProfileBody['role']) ?? 'learner'
    const fullName = body.fullName ?? (user.user_metadata?.full_name as string | undefined) ?? null
    const phone = body.phone ?? (user.user_metadata?.phone as string | undefined) ?? null

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: profile, error: profileError } = await admin
      .from('users')
      .upsert(
        {
          auth_user_id: user.id,
          email: user.email ?? null,
          full_name: fullName,
          phone,
          role,
        },
        { onConflict: 'auth_user_id' }
      )
      .select('id, role')
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    if (profile?.role === 'yaza') {
      const { error: yazaError } = await admin
        .from('yaza_profiles')
        .upsert(
          {
            id: profile.id,
            documents_verified: false,
          },
          { onConflict: 'id' }
        )
      if (yazaError) return NextResponse.json({ error: yazaError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

