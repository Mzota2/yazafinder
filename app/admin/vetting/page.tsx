import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminVettingPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Yaza vetting queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {['Jane Chirwa', 'Peter Nkhoma'].map((name) => (
              <div key={name} className="rounded-xl border p-3 flex items-center justify-between">
                <span>{name}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View docs
                  </Button>
                  <Button size="sm">Approve</Button>
                  <Button variant="outline" size="sm">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

