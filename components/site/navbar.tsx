'use client'

import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useOS } from './hooks'
import { useI18n, type Locale } from './i18n'
import { Wordmark } from './logo'
import { DOWNLOADS } from '@/lib/links'

const LINKS = ['tour', 'features', 'sound', 'themes', 'specs'] as const

export function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const os = useOS()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300',
        scrolled || open ? 'bg-[#151515]/85 shadow-[0_1px_0_var(--line)] backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <a
        href="#main"
        className="absolute left-4 top-3 z-10 -translate-y-20 rounded-full bg-white px-4 py-2 text-sm font-bold text-black focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-5 sm:px-8">
        <a href="#top" aria-label="Resonance" className="shrink-0">
          <Wordmark />
        </a>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          {LINKS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full px-4 py-2 text-[14px] font-bold text-[#b3b3b3] transition-colors hover:text-white"
            >
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div
            role="group"
            aria-label={t.nav.language}
            className="hidden rounded-full bg-[#2a2a2a] p-1 sm:flex"
          >
            {(['en', 'ru'] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={locale === l}
                onClick={() => setLocale(l)}
                className={cn(
                  'h-7 min-w-9 rounded-full px-2.5 text-[12px] font-extrabold uppercase tracking-wider transition-colors',
                  locale === l ? 'bg-white text-[#121212]' : 'text-[#b3b3b3] hover:text-white',
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <a href="#download" className="btn btn-primary btn-sm hidden sm:inline-flex">
            {t.nav.download}
            <span className="sr-only"> {DOWNLOADS[os].name}</span>
          </a>
          <button
            type="button"
            aria-label={t.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full bg-[#2a2a2a] lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col gap-2 bg-[#151515] px-5 pb-10 pt-6 lg:hidden">
          {LINKS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-4 text-3xl font-extrabold tracking-tight hover:bg-[#222]"
            >
              {t.nav[id]}
            </a>
          ))}
          <div className="mt-auto flex flex-col gap-4">
            <div role="group" aria-label={t.nav.language} className="flex w-max rounded-full bg-[#2a2a2a] p-1">
              {(['en', 'ru'] as Locale[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={locale === l}
                  onClick={() => setLocale(l)}
                  className={cn(
                    'h-10 min-w-14 rounded-full px-4 text-sm font-extrabold uppercase tracking-wider',
                    locale === l ? 'bg-white text-[#121212]' : 'text-[#b3b3b3]',
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <a href="#download" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              {t.nav.download}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
