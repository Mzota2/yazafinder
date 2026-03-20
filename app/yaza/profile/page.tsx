import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function YazaProfilePage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Yaza profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Bio, subjects, hourly rate, and verification status controls will live here.</p>
            <p>This page is prepared for form wiring to `users` and `yaza_profiles` tables.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

