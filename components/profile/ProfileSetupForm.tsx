'use client'

import { useEffect, useMemo, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Role = 'learner' | 'yaza'

export function ProfileSetupForm() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<Role>('learner')

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [docStudentId, setDocStudentId] = useState<File | null>(null)
  const [docTranscript, setDocTranscript] = useState<File | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (cancelled) return

        const appMetaRole = user?.user_metadata?.role
        if (appMetaRole === 'yaza' || appMetaRole === 'learner') {
          setRole(appMetaRole)
          return
        }

        // Default to learner until we wire up DB-backed profile lookups.
        setRole('learner')
      } catch {
        if (cancelled) return
        setRole('learner')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadRole()
    return () => {
      cancelled = true
    }
  }, [supabase])

  async function handleAvatarUpload(userId: string) {
    if (!avatarFile) return
    // Compress aggressively for the free-tier storage budget.
    const compressed = await imageCompression(avatarFile, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 512,
      useWebWorker: true,
    })

    const file = compressed instanceof Blob ? new File([compressed], 'avatar.jpg', { type: 'image/jpeg' }) : avatarFile

    const avatarPath = `${userId}/avatar.jpg`
    const { error } = await supabase.storage
      .from('avatars')
      .upload(avatarPath, file, { upsert: true, contentType: 'image/jpeg' })

    if (error) throw new Error(error.message)

    const { data } = supabase.storage.from('avatars').getPublicUrl(avatarPath)

    // Best-effort update; if tables/RLS aren't set yet, this will error and be shown to the user.
    const { error: profileUpdateError } = await supabase
      .from('users')
      .update({ avatar_url: data.publicUrl })
      .eq('id', userId)

    if (profileUpdateError) throw new Error(profileUpdateError.message)
  }

  async function handleYazaDocumentsUpload(userId: string) {
    if (!docStudentId || !docTranscript) return

    const sizeLimitBytes = 5 * 1024 * 1024
    if (docStudentId.size > sizeLimitBytes || docTranscript.size > sizeLimitBytes) {
      throw new Error('Please keep documents under 5MB each.')
    }

    const studentIdPath = `${userId}/student-id.pdf`
    const transcriptPath = `${userId}/transcript.pdf`

    const { error: sidError } = await supabase.storage
      .from('documents')
      .upload(studentIdPath, docStudentId, { upsert: true, contentType: 'application/pdf' })
    if (sidError) throw new Error(sidError.message)

    const { error: transcriptError } = await supabase.storage
      .from('documents')
      .upload(transcriptPath, docTranscript, { upsert: true, contentType: 'application/pdf' })
    if (transcriptError) throw new Error(transcriptError.message)

    // Mark docs as needing admin re-verification.
    const { error: profileError } = await supabase
      .from('yaza_profiles')
      .update({ documents_verified: false })
      .eq('id', userId)

    if (profileError) throw new Error(profileError.message)
  }

  async function handleSubmit() {
    setError(null)
    setMessage(null)
    setSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('You must be signed in.')

      if (avatarFile) {
        await handleAvatarUpload(user.id)
      }

      if (role === 'yaza') {
        await handleYazaDocumentsUpload(user.id)
      }

      setMessage('Profile saved.')

      if (role === 'yaza') router.push('/yaza/dashboard')
      else router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-2rem)] p-4 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile setup</CardTitle>
            <CardDescription>
              {loading ? 'Loading…' : role === 'yaza' ? 'Add your documents to get verified.' : 'Add your avatar to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="avatar-upload" className="text-sm font-medium">
                Avatar (recommended)
              </label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {role === 'yaza' ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label htmlFor="student-id-upload" className="text-sm font-medium">
                    Student ID (PDF)
                  </label>
                  <Input
                    id="student-id-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setDocStudentId(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="transcript-upload" className="text-sm font-medium">
                    Transcript (PDF)
                  </label>
                  <Input
                    id="transcript-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setDocTranscript(e.target.files?.[0] ?? null)}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Uploading documents marks your profile as &quot;needs verification&quot; until admin approval.
                </p>
              </div>
            ) : null}

            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

            <Button type="button" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving…' : 'Save & continue'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

