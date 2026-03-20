import Image from 'next/image'
import { BookOpenCheck, CalendarDays, MessageSquareText, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LearnerDashboardPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-6">
              <Badge variant="secondary" className="mb-3">
                Welcome back
              </Badge>
              <h1 className="text-2xl font-bold">Ready for your next session?</h1>
              <p className="text-sm text-muted-foreground mt-2">
                You have 2 upcoming sessions and 3 recommended Yazas based on your recent searches.
              </p>
            </div>
            <Image
              src="https://images.pexels.com/photos/5940837/pexels-photo-5940837.jpeg"
              alt="Student studying on laptop"
              width={700}
              height={360}
              className="h-full w-full object-cover"
            />
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: CalendarDays, title: 'Upcoming', value: '2 sessions' },
            { icon: BookOpenCheck, title: 'Completed', value: '14 sessions' },
            { icon: Sparkles, title: 'AI searches', value: '9 this week' },
            { icon: MessageSquareText, title: 'Unread chat', value: '3 messages' },
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
      </div>
    </main>
  )
}

