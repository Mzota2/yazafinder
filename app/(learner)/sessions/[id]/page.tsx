import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LearnerSessionDetailsPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[300px_1fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Session info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Session ID: {params.id}</p>
            <p>Subject: Calculus</p>
            <p>Status: active</p>
            <p>Timer: 00:42:18</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-72 rounded-xl border p-3 text-sm text-muted-foreground overflow-y-auto">
              Real-time chat messages will appear here.
            </div>
            <div className="flex gap-2">
              <Input placeholder="Type a message..." />
              <Button>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

