'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from './i18n'
import { Container, SectionHead } from './ui-bits'

const BANDS = ['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k']

const PRESETS = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  bass: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
  vocal: [-2, -1, 0, 2, 4, 4, 3, 1, 0, -1],
  bright: [0, 0, 0, 0, 0, 1, 2, 4, 5, 6],
} as const

type PresetId = keyof typeof PRESETS

export function Sound() {
  const { t } = useI18n()

  return (
    <section id="sound" aria-labelledby="sound-h" className="py-24 md:py-32">
      <Container>
        <SectionHead id="sound-h" title={t.sound.title} lead={t.sound.lead} />
        <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-12">
          <Equalizer />
          <div className="grid gap-4 lg:col-span-5">
            <Crossfade />
            <Normalization />
          </div>
        </div>
      </Container>
    </section>
  )
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-5 rounded-[24px] border border-border bg-card p-6 md:p-8', className)}>{children}</div>
  )
}

function CardHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h3 className="text-xl font-medium tracking-tight">{title}</h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  )
}

function Equalizer() {
  const { t } = useI18n()
  const [preset, setPreset] = useState<PresetId | 'custom'>('bass')
  const [gains, setGains] = useState<number[]>([...PRESETS.bass])

  const choose = (id: PresetId) => {
    setPreset(id)
    setGains([...PRESETS[id]])
  }

  return (
    <Card className="lg:col-span-7">
      <CardHead title={t.sound.eq.title} desc={t.sound.eq.desc} />
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PRESETS) as PresetId[]).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={preset === id}
            onClick={() => choose(id)}
            className={cn(
              'h-10 rounded-full px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent',
              preset === id ? 'bg-primary text-white' : 'border border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {t.sound.eq.presets[id]}
          </button>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-10 gap-1.5 sm:gap-3">
        {BANDS.map((band, i) => {
          const gain = gains[i]
          const pct = ((gain + 12) / 24) * 100
          return (
            <label key={band} className="flex flex-col items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {gain > 0 ? `+${gain}` : gain}
              </span>
              <span className="relative h-44 w-full max-w-9 overflow-hidden rounded-lg bg-[#1d1311] md:h-52">
                <span className="absolute inset-x-0 top-1/2 h-px bg-white/10" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 rounded-lg bg-gradient-to-t from-primary to-[#ff5c6a] transition-[height] duration-300"
                  style={{ height: `${pct}%` }}
                />
                <input
                  type="range"
                  min={-12}
                  max={12}
                  step={1}
                  value={gain}
                  aria-label={`${band} Hz`}
                  onChange={(e) => {
                    const next = [...gains]
                    next[i] = Number(e.target.value)
                    setGains(next)
                    setPreset('custom')
                  }}
                  className="absolute inset-0 h-full w-full cursor-ns-resize opacity-0 [writing-mode:vertical-lr] [direction:rtl]"
                />
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">{band}</span>
            </label>
          )
        })}
      </div>
    </Card>
  )
}

function Crossfade() {
  const { t } = useI18n()
  const [seconds, setSeconds] = useState(6)
  const overlap = (seconds / 12) * 40

  return (
    <Card>
      <CardHead title={t.sound.crossfade.title} desc={t.sound.crossfade.desc} />
      <div aria-hidden="true" className="relative h-14">
        <div className="absolute inset-y-2 left-0 rounded-lg bg-gradient-to-r from-[#ff5c6a]/70 to-transparent" style={{ right: `${50 - overlap / 2}%` }} />
        <div className="absolute inset-y-2 right-0 rounded-lg bg-gradient-to-l from-primary/80 to-transparent" style={{ left: `${50 - overlap / 2}%` }} />
      </div>
      <label className="flex items-center gap-4">
        <span className="shrink-0 text-sm text-muted-foreground">{t.sound.crossfade.length}</span>
        <input
          type="range"
          min={0}
          max={12}
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          className="h-1 w-full cursor-pointer accent-[#e5192e]"
        />
        <output className="w-12 shrink-0 text-right font-mono text-sm tabular-nums">
          {seconds === 0 ? t.sound.crossfade.off : `${seconds} ${t.sound.crossfade.unit}`}
        </output>
      </label>
    </Card>
  )
}

function Normalization() {
  const { t } = useI18n()
  const [on, setOn] = useState(true)
  const [target, setTarget] = useState<'quiet' | 'standard' | 'loud'>('standard')
  const lufs = { quiet: -18, standard: -14, loud: -11 }[target]
  const tracks = [38, 92, 55, 78, 30, 86]
  const level = ((lufs + 24) / 16) * 100

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <CardHead title={t.sound.norm.title} desc={t.sound.norm.desc} />
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={t.sound.norm.title}
          onClick={() => setOn(!on)}
          className={cn(
            'relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-accent',
            on ? 'bg-primary' : 'bg-[#2a1c1a]',
          )}
        >
          <span className={cn('absolute top-1 size-5 rounded-full bg-white transition-all', on ? 'left-6' : 'left-1')} />
        </button>
      </div>
      <div aria-hidden="true" className="flex h-16 items-end gap-2">
        {tracks.map((h, i) => (
          <span
            key={i}
            className="w-full rounded-md bg-[#ff5c6a]/80 transition-[height] duration-500"
            style={{ height: `${on ? level : h}%` }}
          />
        ))}
      </div>
      <div className="flex gap-1 rounded-full border border-border p-1">
        {(['quiet', 'standard', 'loud'] as const).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={target === id}
            disabled={!on}
            onClick={() => setTarget(id)}
            className={cn(
              'h-9 flex-1 rounded-full text-sm transition-colors disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent',
              target === id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.sound.norm.targets[id]}
          </button>
        ))}
      </div>
    </Card>
  )
}
