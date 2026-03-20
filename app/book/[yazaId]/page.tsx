'use client'

import { useState, type FormEvent } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function BookPage() {
  const params = useParams<{ yazaId: string }>()
  const yazaId = params.yazaId

  const [subject, setSubject] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(60)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  async function handleBook(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSessionId(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/sessions/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yazaId,
          subject,
          scheduledAt,
          durationMinutes,
        }),
      })

      const json = (await res.json()) as { sessionId?: string; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Booking failed')
      if (!json.sessionId) throw new Error('No sessionId returned')
      setSessionId(json.sessionId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not book session')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-2rem)] p-4 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Book a session</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <form onSubmit={handleBook} className="flex flex-col gap-3">
              <p>
                Selected Yaza ID: <span className="font-medium">{yazaId}</span>
              </p>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="booking-subject" className="text-sm font-medium text-foreground">
                  Subject / topic
                </label>
                <Input
                  id="booking-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Algebra: solving quadratic equations"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="booking-time" className="text-sm font-medium text-foreground">
                  Scheduled time
                </label>
                <Input
                  id="booking-time"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">This is a minimal placeholder form (no calendar yet).</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="booking-duration" className="text-sm font-medium text-foreground">
                  Duration (minutes)
                </label>
                <Input
                  id="booking-duration"
                  type="number"
                  min={15}
                  step={15}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  required
                />
              </div>

              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              {sessionId ? (
                <p className="text-sm text-foreground">
                  Session created. Session ID: <span className="font-medium">{sessionId}</span>
                </p>
              ) : null}

              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating…' : 'Confirm booking'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


