import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function YazaAvailabilityPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Availability schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {days.map((day) => (
              <div key={day} className="rounded-xl border p-3 flex items-center justify-between">
                <span className="font-medium">{day}</span>
                <span className="text-sm text-muted-foreground">08:00 - 18:00</span>
              </div>
            ))}
            <Button className="mt-2">Save schedule</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

