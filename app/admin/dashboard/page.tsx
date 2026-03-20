import { AlertTriangle, BarChart3, Users, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboardPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="w-full max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, title: 'Active users', value: '1,236' },
          { icon: Wallet, title: 'Revenue (30d)', value: 'MK 8,450,000' },
          { icon: AlertTriangle, title: 'Open disputes', value: '6' },
          { icon: BarChart3, title: 'Completion rate', value: '91%' },
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
      </div>
    </main>
  )
}

