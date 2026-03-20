import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

type BookSessionBody = {
  yazaId: string
  subject: string
  scheduledAt: string // ISO string from client
  durationMinutes: number
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as Partial<BookSessionBody>
    const yazaId = body.yazaId ?? ''
    const subject = (body.subject ?? '').trim()
    const scheduledAt = body.scheduledAt ?? ''
    const durationMinutes = Number(body.durationMinutes ?? 0)

    if (!yazaId || !subject || !scheduledAt || !durationMinutes) {
      return NextResponse.json({ error: 'Missing booking fields' }, { status: 400 })
    }

    const scheduledDate = new Date(scheduledAt)
    if (Number.isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: 'Invalid scheduledAt' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        learner_id: user.id,
        yaza_id: yazaId,
        subject,
        scheduled_at: scheduledDate.toISOString(),
        duration_minutes: durationMinutes,
        status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sessionId: data.id })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

