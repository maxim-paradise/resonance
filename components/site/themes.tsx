'use client'

import { Check } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from './i18n'
import { Parallax, Reveal, Tilt } from './motion'
import { WindowFrame } from './window-frame'

/* each screenshot is the real app with BOTH the background color and the accent switched */
const THEMES = [
  { id: 'crimson', src: '/shots/home.jpg', color: '#ff9b8a', hi: '#ffb4a7', rgb: '255 155 138' },
  { id: 'blue', src: '/shots/theme-blue.jpg', color: '#8fb8ff', hi: '#b0cdff', rgb: '143 184 255' },
  { id: 'green', src: '/shots/theme-green.jpg', color: '#7fe3a3', hi: '#a2edbd', rgb: '127 227 163' },
  { id: 'teal', src: '/shots/theme-teal.jpg', color: '#5fd3d1', hi: '#86e3e1', rgb: '95 211 209' },
  { id: 'orange', src: '/shots/theme-orange.jpg', color: '#ffb067', hi: '#ffc58d', rgb: '255 176 103' },
  { id: 'pink', src: '/shots/theme-pink.jpg', color: '#ff8fb4', hi: '#ffabc7', rgb: '255 143 180' },
] as const

export function Themes() {
  const { t } = useI18n()
  const [active, setActive] = useState(0)
  const theme = THEMES[active]

  // the accent of this whole section follows the pick
  const scope = {
    '--accent': theme.color,
    '--accent-hi': theme.hi,
    '--accent-rgb': theme.rgb,
  } as CSSProperties

  return (
    <section id="themes" aria-labelledby="themes-h" className="relative overflow-hidden py-20 md:py-28" style={scope}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 -z-10 h-[520px] w-[520px] rounded-full opacity-25 blur-[120px] transition-colors duration-700"
        style={{ background: theme.color }}
      />
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5">
          <Reveal>
            <h2 id="themes-h" className="h-section">
              {t.themes.title}
            </h2>
            <p className="mt-4 max-w-[30rem] text-[17px] text-[#b3b3b3]">{t.themes.lead}</p>
          </Reveal>

          <Reveal delay={120} className="mt-8">
            <p id="theme-pick" className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#8a8a8a]">
              {t.themes.pick}
            </p>
            <div role="radiogroup" aria-labelledby="theme-pick" className="mt-3 flex flex-wrap items-center gap-3">
              {THEMES.map((th, i) => (
                <button
                  key={th.id}
                  type="button"
                  role="radio"
                  aria-checked={active === i}
                  aria-label={t.themes.names[th.id]}
                  onClick={() => setActive(i)}
                  className={cn(
                    'relative grid size-11 place-items-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95',
                    active === i && 'scale-110',
                  )}
                  style={{
                    background: th.color,
                    boxShadow: active === i ? `0 0 0 3px #151515, 0 0 0 5px ${th.color}` : 'none',
                  }}
                >
                  {active === i && <Check className="size-5 text-[#2a0f0b]" strokeWidth={3} aria-hidden="true" />}
                </button>
              ))}
              <span className="ml-2 text-[15px] font-bold" aria-live="polite">
                {t.themes.names[theme.id]}
              </span>
            </div>
          </Reveal>

          <ul className="mt-10 grid gap-5">
            {t.themes.points.map((p, i) => (
              <Reveal as="li" key={p.title} delay={200 + i * 100} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-2 size-2 shrink-0 rounded-full bg-[var(--accent)] transition-colors duration-500"
                />
                <div>
                  <h3 className="text-[17px] font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#b3b3b3]">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={200} y={48} className="min-w-0 lg:col-span-7">
          <Parallax y={22}>
            <Tilt max={5} className="rounded-[14px]" innerClassName="rounded-[14px]">
              <WindowFrame shots={THEMES.map((th) => ({ src: th.src, alt: t.themes.alt }))} active={active} />
            </Tilt>
          </Parallax>
        </Reveal>
      </div>
    </section>
  )
}
