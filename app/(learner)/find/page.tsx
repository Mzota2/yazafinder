'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Match = {
  id: string
  full_name: string
  subjects: string[]
  hourly_rate: string
  rating: number
  bio: string
  similarity: number
}

export default function FindPage() {
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const json = (await res.json()) as { matches?: Match[]; error?: string }

      if (!res.ok) throw new Error(json.error ?? 'Failed to fetch matches')
      setMatches(json.matches ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not match Yazas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-2rem)] p-4 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Find a Yaza</CardTitle>
            <CardDescription>Describe what you need help with. We will match you to the best available tutors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Calculus integration basics"
                aria-label="Search query"
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Matching…' : 'Search'}
              </Button>
            </form>

            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {matches.length > 0 ? (
              <div className="grid gap-3">
                {matches.map((m) => (
                  <Card key={m.id} className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{m.full_name}</p>
                        <p className="text-sm text-muted-foreground">{m.bio}</p>
                      </div>

                      <div className="text-right">
                        <Badge variant="secondary">{Math.round(m.similarity * 100)}% match</Badge>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Rating: {m.rating.toFixed(1)}
                        </p>
                        <p className="mt-1 font-medium">{`MK ${m.hourly_rate}`}/hr</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.subjects?.map((s) => (
                        <Badge key={s} variant="outline">
                          {s}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-3">
                      <Link href={`/book/${m.id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                        View & book
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


