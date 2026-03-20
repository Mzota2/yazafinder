import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminUsersPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>User management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {['Mary Zuze (learner)', 'John Moyo (yaza)', 'Admin Account (admin)'].map((u) => (
              <div key={u} className="rounded-xl border p-3 flex items-center justify-between">
                <span>{u}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Verify
                  </Button>
                  <Button variant="outline" size="sm">
                    Suspend
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

