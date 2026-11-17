'use client'

import { Pause, Play, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from './i18n'
import { Parallax, Rise, Tilt } from './motion'
import { WindowFrame } from './window-frame'

const LINE_H = 64

function Demo() {
  const { t } = useI18n()
  const [set, setSet] = useState(0)
  const [line, setLine] = useState(2)
  const [playing, setPlaying] = useState(false)
  const lines = t.lyrics.set[set]
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) return
    timer.current = window.setInterval(() => setLine((l) => (l + 1) % lines.length), 2200)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [playing, lines.length])

  const progress = ((line + 1) / lines.length) * 100

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#1c1c1c] p-5 shadow-[var(--shadow-md)] sm:p-6">
      <div className="flex items-center gap-4">
        <Image
          src="/images/tracks/fortuna.png"
          alt=""
          width={56}
          height={56}
          className={cn('size-14 rounded-lg object-cover transition-transform duration-500', playing && 'scale-105')}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold">Demo</p>
          <p className="truncate text-[13px] text-[#a0a0a0]">Resonance</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSet((s) => (s + 1) % t.lyrics.set.length)
            setLine(0)
          }}
          className="chip h-9 shrink-0 text-[13px]"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          {t.lyrics.change}
        </button>
      </div>

      <div
        className="relative mt-4 overflow-hidden"
        style={{
          height: LINE_H * 5,
          maskImage: 'linear-gradient(to bottom, transparent, black 24%, black 76%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 24%, black 76%, transparent)',
        }}
      >
        <ol
          key={set}
          className="absolute inset-x-0 top-0 transition-transform duration-700 ease-[var(--ease)]"
          style={{ transform: `translateY(${LINE_H * 2 - line * LINE_H}px)` }}
        >
          {lines.map((text, i) => (
            <li key={text} style={{ height: LINE_H }} className="flex items-center">
              <button
                type="button"
                onClick={() => setLine(i)}
                aria-current={i === line ? 'true' : undefined}
                className={cn(
                  'max-w-full truncate whitespace-nowrap text-left text-[clamp(1.2rem,1.9vw,1.6rem)] font-extrabold leading-tight tracking-[-0.02em] transition-all duration-500',
                  i === line ? 'text-white' : i < line ? 'text-[#4a4a4a]' : 'text-[#6a6a6a] hover:text-[#9a9a9a]',
                )}
              >
                {text}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? t.lyrics.pause : t.lyrics.play}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 translate-x-[1px] fill-current" />}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#4d4d4d]">
          <div className="h-full rounded-full bg-white transition-[width] duration-700 ease-[var(--ease)]" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <p className="mt-3 text-[12.5px] text-[#7c7c7c]">{t.lyrics.note}</p>
    </div>
  )
}

export function Lyrics() {
  const { t } = useI18n()
  return (
    <section id="lyrics" aria-labelledby="lyrics-h" className="relative py-20 md:py-28">
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5">
          <Rise>
            <h2 id="lyrics-h" className="h-section">
              {t.lyrics.title}
            </h2>
            <p className="mt-4 max-w-[30rem] text-[17px] text-[#b3b3b3]">{t.lyrics.lead}</p>
          </Rise>
          <div className="mt-8">
            <Demo />
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <Parallax y={34}>
            <Tilt max={5} className="rounded-[14px]" innerClassName="rounded-[14px]">
              <WindowFrame shots={[{ src: '/shots/lyrics.jpg', alt: t.tour.tabs[3].alt }]} active={0} />
            </Tilt>
          </Parallax>
        </div>
      </div>
    </section>
  )
}
