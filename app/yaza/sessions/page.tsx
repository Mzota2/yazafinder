import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function YazaSessionsPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>My tutoring sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { learner: 'Ruth Banda', subject: 'Economics', time: 'Today 15:30', status: 'confirmed' },
              { learner: 'Mike Phiri', subject: 'Statistics', time: 'Tomorrow 09:00', status: 'pending' },
            ].map((s) => (
              <div key={`${s.learner}-${s.subject}`} className="rounded-xl border p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {s.subject} - {s.learner}
                  </p>
                  <p className="text-sm text-muted-foreground">{s.time}</p>
                </div>
                <Badge variant="outline">{s.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

