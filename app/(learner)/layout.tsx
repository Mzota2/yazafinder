import Link from 'next/link'

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/find', label: 'Find Yazas' },
  { href: '/sessions', label: 'Sessions' },
  { href: '/chatbot', label: 'AI chat' },
]

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard" className="font-semibold text-primary">
            YazaFinder
          </Link>
          <nav className="flex flex-wrap gap-1 sm:gap-2" aria-label="Learner navigation">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  )
}
