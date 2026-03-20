'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bot, CalendarDays, CreditCard, MessagesSquare, ShieldCheck, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const studentPhotos = [
  'https://images.pexels.com/photos/6146931/pexels-photo-6146931.jpeg',
  'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg',
  'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50/60 via-background to-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold animate-pulse-soft">
              YF
            </div>
            <span className="font-semibold text-xl">YazaFinder</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className={buttonVariants({ variant: 'outline' })}>
              Login
            </Link>
            <Link href="/register" className={buttonVariants()}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-cyan-100 text-cyan-700 px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" />
              AI + peer tutoring for Malawi students
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-tight">
              Study smarter with <span className="text-primary">verified Yazas</span>.
            </h1>
            <p className="mt-4 text-muted-foreground text-base max-w-xl">
              Get instant AI support, then book top-matched peer tutors. Learn in real time, pay in MWK, and track
              your progress from your phone.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link href="/find" className={buttonVariants({ size: 'lg' })}>
                Find a Yaza
              </Link>
              <Link href="/chatbot" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                Try AI chatbot
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -right-4 size-32 bg-cyan-200/70 rounded-full blur-3xl animate-float-slow" />
            <Card className="overflow-hidden relative">
              <CardHeader>
                <CardTitle>Students using YazaFinder</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                {studentPhotos.map((src, idx) => (
                  <div key={src} className={idx === 1 ? 'translate-y-2' : ''}>
                    <Image
                      src={src}
                      alt="University student studying"
                      width={260}
                      height={320}
                      className="rounded-xl object-cover aspect-[3/4] w-full"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Bot, t: 'Instant AI tutoring', d: 'Ask academic questions anytime, before or after sessions.' },
            { icon: ShieldCheck, t: 'Verified Yazas', d: 'Document vetting ensures trusted peer tutors.' },
            { icon: CalendarDays, t: 'Live booking', d: 'Pick a slot, confirm in seconds, and get reminders.' },
            { icon: MessagesSquare, t: 'Real-time chat', d: 'Communicate live in active sessions with low latency.' },
            { icon: CreditCard, t: 'MWK payments', d: 'Airtel Money and TNM Mpamba via PayChangu.' },
            { icon: Sparkles, t: 'Smart matching', d: 'AI embeddings find tutors aligned to your learning need.' },
          ].map((f) => (
            <Card key={f.t} className="hover:-translate-y-1 transition-transform">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <f.icon className="size-4 text-primary" />
                  {f.t}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.d}</CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  )
}
