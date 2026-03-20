'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  const [status, setStatus] = useState<'idle' | 'exchanging' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!code) {
        setStatus('error')
        setError('Missing verification code.')
        return
      }

      setStatus('exchanging')
      setError(null)

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (cancelled) return

      if (error) {
        setStatus('error')
        setError(error.message)
        return
      }

      if (!data.session) {
        setStatus('error')
        setError('Could not create a session.')
        return
      }

      setStatus('success')
      router.push('/profile/setup')
    }

    run()
    return () => {
      cancelled = true
    }
  }, [code, router, supabase])

  return (
    <main className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verifying your account</CardTitle>
          <CardDescription>Finishing sign-in securely…</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {status === 'exchanging' ? <p className="text-sm">Please wait…</p> : null}
          {status === 'success' ? (
            <p className="text-sm text-green-600 dark:text-green-400">Success. Redirecting…</p>
          ) : null}
          {status === 'error' ? (
            <>
              <p role="alert" className="text-sm text-destructive">
                {error ?? 'Verification failed.'}
              </p>
              <Button type="button" variant="outline" onClick={() => router.push('/login')}>
                Back to login
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
    </main>
  )
}

