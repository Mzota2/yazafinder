import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminDisputesPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Disputes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border p-3">
              <p className="font-medium">Session #S-283: Learner requested refund</p>
              <p className="text-sm text-muted-foreground mt-1">
                Reason: Yaza did not join on time. Evidence from chat and session logs available.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm">Approve refund</Button>
                <Button variant="outline" size="sm">
                  Release payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

