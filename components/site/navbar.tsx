'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useI18n, type Locale } from './i18n'
import { REPO_URL } from './primitives'
import { Container } from './ui-bits'

export function Navbar() {
  const { locale, setLocale, t } = useI18n()

  const links = [
    { href: '#library', label: t.nav.library },
    { href: '#sound', label: t.nav.sound },
    { href: '#lyrics', label: t.nav.lyrics },
    { href: '#setup', label: t.nav.setup },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background">
      <Container className="flex h-16 items-center gap-6">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <a href="#top" className="flex items-center gap-2.5 text-[17px] font-medium tracking-tight">
          <span className="grid size-8 place-items-center rounded-[10px] border border-[var(--line-strong)] bg-black">
            <Image src="/app-icon.png" alt="" width={64} height={64} className="size-5 object-contain" />
          </span>
          Resonance
        </a>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-3.5 py-2 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden px-3 py-2 text-[15px] text-muted-foreground transition-colors hover:text-foreground lg:block"
          >
            {t.nav.github}
          </a>
          <div
            role="group"
            aria-label={t.nav.language}
            className="flex items-center rounded-full border border-border p-1"
          >
            {(['en', 'ru'] as Locale[]).map((lang) => {
              const active = locale === lang
              return (
                <button
                  key={lang}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setLocale(lang)}
                  className={cn(
                    'h-8 min-w-9 rounded-full px-2.5 font-mono text-xs uppercase transition-colors focus-visible:outline-2 focus-visible:outline-accent',
                    active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {lang}
                </button>
              )
            })}
          </div>
          <a
            href="#download"
            className="hidden h-10 items-center rounded-full bg-primary px-5 text-[15px] font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:bg-[#f0283c] sm:inline-flex"
          >
            {t.hero.download}
          </a>
        </div>
      </Container>
    </header>
  )
}
