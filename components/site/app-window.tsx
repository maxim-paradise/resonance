'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from './i18n'
import { Container, SectionHead } from './ui-bits'

const THEMES = [
  { id: 'crimson', src: '/images/resonance-crimson.jpg', dot: '#ff6b78' },
  { id: 'warm', src: '/images/resonance-app.jpg', dot: '#f2b9a2' },
  { id: 'teal', src: '/images/resonance-teal.jpg', dot: '#5fd6e6' },
] as const

type ThemeId = (typeof THEMES)[number]['id']

export function AppWindow() {
  const { t } = useI18n()
  const [theme, setTheme] = useState<ThemeId>('warm')

  return (
    <section id="library" aria-labelledby="library-h" className="bg-card py-24 md:py-32">
      <Container>
        <SectionHead id="library-h" title={t.window.title} lead={t.window.lead} />

        <div className="mt-10 flex flex-wrap items-center gap-3 md:mt-14">
          <span className="text-sm text-muted-foreground">{t.window.themesLabel}</span>
          <div role="tablist" aria-label={t.window.themesLabel} className="flex gap-1 rounded-full border border-border bg-background p-1">
            {THEMES.map((item) => {
              const active = theme === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="library-shot"
                  onClick={() => setTheme(item.id)}
                  className={cn(
                    'flex h-10 items-center gap-2 rounded-full px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent',
                    active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: item.dot }} />
                  {t.window.themes[item.id]}
                </button>
              )
            })}
          </div>
          <p className="basis-full text-sm text-muted-foreground md:ml-auto md:basis-auto md:text-right">{t.window.themeNote}</p>
        </div>

        <div
          id="library-shot"
          role="tabpanel"
          className="relative mt-6 overflow-hidden rounded-[24px] border border-[var(--line-strong)] bg-black shadow-[0_50px_120px_-50px_rgb(229_25_46/50%)]"
        >
          {/* all three are real screenshots of the app; the inactive two stay in place, hidden, so switching is instant */}
          {THEMES.map((item) => (
            <Image
              key={item.id}
              src={item.src}
              alt={t.window.alt[item.id]}
              width={1280}
              height={673}
              className={cn(
                'h-auto w-full transition-opacity duration-500',
                item.id === theme ? 'relative opacity-100' : 'absolute inset-0 opacity-0',
              )}
              aria-hidden={item.id !== theme}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
