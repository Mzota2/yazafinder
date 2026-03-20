'use client'

import { useState } from 'react'
import { Bot } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ChatbotPage() {
  const [message, setMessage] = useState('')
  const [items, setItems] = useState<string[]>(['Hi! I am YazaBot. Ask me an academic question.'])

  function send() {
    if (!message.trim()) return
    setItems((prev) => [...prev, `You: ${message.trim()}`, 'YazaBot: Streaming response placeholder...'])
    setMessage('')
  }

  return (
    <main className="min-h-[calc(100vh-2rem)] p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-5 text-primary" />
              YazaBot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-80 rounded-xl border p-3 overflow-y-auto space-y-2 text-sm">
              {items.map((text, idx) => (
                <p key={`${text}-${idx}`} className="text-muted-foreground">
                  {text}
                </p>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask YazaBot..." />
              <Button onClick={send}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

