import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminAnalyticsPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          ['Chatbot messages (7d)', '2,418'],
          ['Flagged message rate', '1.7%'],
          ['Average Yaza rating', '4.6'],
          ['Session completion', '91%'],
          ['Match success', '87%'],
          ['Dispute resolution avg', '1.4 days'],
        ].map(([title, value]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{value}</CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}

