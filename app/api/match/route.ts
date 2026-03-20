import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

import { createSupabaseServerClient } from '@/lib/supabase/server'

type MatchYazasResponse = {
  id: string
  full_name: string
  subjects: string[]
  hourly_rate: string
  rating: number
  bio: string
  similarity: number
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { query?: string }
    const query = (body.query ?? '').trim()

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    })

    const embedding = embeddingRes.data[0]?.embedding
    if (!embedding) {
      return NextResponse.json({ error: 'Could not generate embedding' }, { status: 500 })
    }

    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase.rpc('match_yazas', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 5,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ matches: data as MatchYazasResponse[] })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

