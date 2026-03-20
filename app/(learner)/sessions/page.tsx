import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function LearnerSessionsPage() {
  const sessions = [
    { id: 's1', subject: 'Calculus', when: 'Today 14:00', status: 'confirmed' },
    { id: 's2', subject: 'Physics', when: 'Tomorrow 10:30', status: 'pending' },
    { id: 's3', subject: 'Accounting', when: 'Mon 16:00', status: 'completed' },
  ]

  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>My sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="rounded-xl border p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{s.subject}</p>
                  <p className="text-sm text-muted-foreground">{s.when}</p>
                </div>
                <Badge variant={s.status === 'completed' ? 'secondary' : 'outline'}>{s.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

