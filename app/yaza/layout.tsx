import Link from 'next/link'

const nav = [
  { href: '/yaza/dashboard', label: 'Dashboard' },
  { href: '/yaza/profile', label: 'Profile' },
  { href: '/yaza/availability', label: 'Availability' },
  { href: '/yaza/sessions', label: 'Sessions' },
  { href: '/yaza/earnings', label: 'Earnings' },
]

export default function YazaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link href="/yaza/dashboard" className="font-semibold text-primary">
            YazaFinder
          </Link>
          <nav className="flex flex-wrap gap-1 sm:gap-2" aria-label="Yaza navigation">
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
