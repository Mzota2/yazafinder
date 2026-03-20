import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function YazaEarningsPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total earned</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">MK 1,240,000</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Commission paid</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">MK 86,800</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending payout</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">MK 102,000</CardContent>
        </Card>
      </div>
    </main>
  )
}

