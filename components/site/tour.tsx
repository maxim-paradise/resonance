'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from './i18n'
import { Parallax, Rise, Tilt } from './motion'
import { WindowFrame } from './window-frame'

const SRC: Record<string, string> = {
  home: '/shots/home.jpg',
  favorites: '/shots/favorites.jpg',
  playlist: '/shots/playlist.jpg',
  lyrics: '/shots/lyrics.jpg',
  eq: '/shots/eq-bass.jpg',
  queue: '/shots/upnext.jpg',
}

export function Tour() {
  const { t } = useI18n()
  const [active, setActive] = useState(0)
  const tabs = t.tour.tabs
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: KeyboardEvent, i: number) => {
    let next = i
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return
    e.preventDefault()
    setActive(next)
    refs.current[next]?.focus()
  }

  const shots = tabs.map((tab) => ({ src: SRC[tab.id], alt: tab.alt }))
  const current = tabs[active]

  return (
    <section id="tour" aria-labelledby="tour-h" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Rise>
          <h2 id="tour-h" className="h-section max-w-[18ch]">
            {t.tour.title}
          </h2>
          <p className="mt-4 max-w-[40rem] text-[17px] text-[#b3b3b3]">{t.tour.lead}</p>
        </Rise>

        <div
          role="tablist"
          aria-label={t.tour.title}
          className="scroll-hide -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              role="tab"
              id={`tour-tab-${tab.id}`}
              aria-selected={active === i}
              aria-controls="tour-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className="chip shrink-0"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id="tour-panel"
          role="tabpanel"
          aria-labelledby={`tour-tab-${current.id}`}
          className="mt-8 grid items-start gap-8 lg:grid-cols-12 lg:gap-10"
        >
          <div className="order-2 lg:order-1 lg:col-span-4 lg:pt-8">
            <h3 key={current.id} className="animate-rise-in text-[clamp(1.6rem,2.6vw,2.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
              {current.title}
            </h3>
            <p key={current.id + 'p'} className="animate-rise-in mt-4 text-[17px] leading-relaxed text-[#b3b3b3]" style={{ animationDelay: '60ms' }}>
              {current.desc}
            </p>
            <div className="mt-8 flex items-center gap-2" aria-hidden="true">
              {tabs.map((tab, i) => (
                <span
                  key={tab.id}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i === active ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-[#444]',
                  )}
                />
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-8">
            <Parallax y={26}>
              <Tilt max={5} className="rounded-[14px]" innerClassName="rounded-[14px]">
                <WindowFrame shots={shots} active={active} priority />
              </Tilt>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  )
}
