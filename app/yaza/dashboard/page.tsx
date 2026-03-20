import { CalendarClock, CircleDollarSign, Star, ToggleRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function YazaDashboardPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Yaza dashboard</span>
              <Badge>Available now</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: CalendarClock, title: "Today's sessions", value: '4' },
              { icon: CircleDollarSign, title: 'This week earnings', value: 'MK 62,000' },
              { icon: Star, title: 'Current rating', value: '4.8 / 5' },
              { icon: ToggleRight, title: 'Availability', value: 'ON' },
            ].map((m) => (
              <Card key={m.title}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <m.icon className="size-4 text-primary" />
                    {m.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xl font-semibold">{m.value}</CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

