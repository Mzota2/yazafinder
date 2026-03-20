import { Suspense } from 'react'
import { VerifyPageContent } from './verify-content'

function VerifyFallback() {
  return (
    <main className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-4">
      <p className="text-sm text-muted-foreground">Loading verification…</p>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyPageContent />
    </Suspense>
  )
}
