'use client'

import { useI18n } from './i18n'
import { Container, SectionHead } from './ui-bits'

const EQ_SHAPE = [62, 74, 58, 44, 50, 66, 80, 70, 54, 40]

export function Numbers() {
  const { t } = useI18n()
  const outs = t.numbers.outputs

  return (
    <section id="numbers" aria-labelledby="numbers-h" className="py-24 md:py-32">
      <Container>
        <SectionHead id="numbers-h" title={t.numbers.title} lead={t.numbers.lead} />

        <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-12">
          {/* the flow: two services into the player, five things out */}
          <figure
            role="img"
            aria-label={t.numbers.diagramAlt}
            className="relative overflow-hidden rounded-[24px] border border-border bg-black p-4 lg:col-span-7 lg:row-span-2"
          >
            <div aria-hidden="true" className="dot-field absolute inset-0 opacity-50 [mask-image:radial-gradient(closest-side,black,transparent)]" />
            <svg viewBox="0 0 640 440" className="relative h-auto w-full" aria-hidden="true">
              <defs>
                <linearGradient id="nb-wire" x1="0" x2="1">
                  <stop offset="0" stopColor="#ff5c6a" />
                  <stop offset="1" stopColor="#e5192e" />
                </linearGradient>
                <radialGradient id="nb-core">
                  <stop offset="0" stopColor="#e5192e" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#e5192e" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* sources */}
              <g>
                <rect x="16" y="104" width="148" height="56" rx="28" fill="#1d1311" stroke="rgb(255 225 215 / 16%)" />
                <image href="/icons/soundcloud.svg" x="32" y="120" width="40" height="24" />
                <text x="80" y="137" fill="#f6ece8" fontSize="15" fontFamily="var(--font-onest)">SoundCloud</text>
                <rect x="16" y="280" width="148" height="56" rx="28" fill="#1d1311" stroke="rgb(255 225 215 / 16%)" />
                <image href="/icons/youtubemusic.svg" x="34" y="296" width="24" height="24" />
                <text x="66" y="313" fill="#f6ece8" fontSize="14" fontFamily="var(--font-onest)">YouTube Music</text>
              </g>

              {/* wires */}
              <g fill="none" stroke="url(#nb-wire)" strokeWidth="2" strokeDasharray="4 8" className="animate-dash-run">
                <path d="M164 132 C 220 132, 220 220, 262 220" />
                <path d="M164 308 C 220 308, 220 220, 262 220" />
                {outs.map((_, i) => {
                  const y = 60 + i * 80
                  return <path key={i} d={`M378 220 C 420 220, 420 ${y}, 452 ${y}`} />
                })}
              </g>

              {/* core */}
              <circle cx="320" cy="220" r="120" fill="url(#nb-core)" />
              <g style={{ transformOrigin: '320px 220px' }} className="animate-spin-slow">
                <circle cx="320" cy="220" r="78" fill="none" stroke="#e5192e" strokeWidth="10" strokeDasharray="60 22" />
              </g>
              <circle cx="320" cy="220" r="62" fill="#0b0707" stroke="rgb(255 225 215 / 20%)" />
              <text x="320" y="225" textAnchor="middle" fill="#f6ece8" fontSize="15" fontWeight="500" fontFamily="var(--font-unbounded)">
                {t.numbers.core}
              </text>

              {/* outputs */}
              {outs.map((label, i) => {
                const y = 60 + i * 80
                return (
                  <g key={label}>
                    <rect x="452" y={y - 20} width="172" height="40" rx="20" fill="#1d1311" stroke="rgb(255 225 215 / 16%)" />
                    <circle cx="474" cy={y} r="5" fill={i % 2 ? '#ff5c6a' : '#e5192e'} />
                    <text x="488" y={y + 5} fill="#f6ece8" fontSize="14" fontFamily="var(--font-onest)">
                      {label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </figure>

          <div className="grid grid-cols-2 gap-4 lg:col-span-5 lg:row-span-2">
            <Stat value="2" label={t.numbers.services} tone="red">
              <div className="mt-auto flex gap-2" aria-hidden="true">
                <span className="size-3 rounded-full bg-[#ff5500]" />
                <span className="size-3 rounded-full bg-white" />
              </div>
            </Stat>
            <Stat value="10" label={t.numbers.bands}>
              <div className="mt-auto flex h-12 items-end gap-1" aria-hidden="true">
                {EQ_SHAPE.map((h, i) => (
                  <span key={i} className="w-full rounded-sm bg-primary/80" style={{ height: `${h}%` }} />
                ))}
              </div>
            </Stat>
            <Stat value="<20" unit="MB" label={t.numbers.installer}>
              <div className="mt-auto flex items-center gap-4" aria-hidden="true">
                <img src="/icons/windows.svg" alt="" className="size-6" />
                <img src="/icons/apple.svg" alt="" className="size-6 invert" />
                <img src="/icons/linux-tux.svg" alt="" className="size-6" />
              </div>
            </Stat>
            <Stat value="<15" unit="MB" label={t.numbers.ram}>
              <p className="mt-auto font-mono text-xs text-accent">Tauri + Rust</p>
            </Stat>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Stat({
  value,
  unit,
  label,
  tone,
  children,
}: {
  value: string
  unit?: string
  label: string
  tone?: 'red'
  children?: React.ReactNode
}) {
  return (
    <div
      className={
        tone === 'red'
          ? 'flex min-h-[200px] flex-col gap-3 rounded-[24px] bg-primary p-6 text-white'
          : 'flex min-h-[200px] flex-col gap-3 rounded-[24px] border border-border bg-card p-6'
      }
    >
      <p className="font-display text-[40px] leading-none font-medium tracking-[-0.04em] md:text-[46px]">
        {value}
        {unit ? <span className="ml-1 text-[0.45em] tracking-normal opacity-70">{unit}</span> : null}
      </p>
      <p className={tone === 'red' ? 'text-[15px] text-white' : 'text-[15px] text-muted-foreground'}>{label}</p>
      {children}
    </div>
  )
}
