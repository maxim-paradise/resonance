'use client'

import { ArrowRight, Download } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { DOWNLOADS } from '@/lib/links'
import { useLatestVersion, useOS } from './hooks'
import { useI18n } from './i18n'
import { LyricsBackdrop } from './lyrics-backdrop'

const HeroScene = dynamic(() => import('./hero-scene'), { ssr: false })

export function Hero() {
  const { t } = useI18n()
  const os = useOS()
  const version = useLatestVersion()
  const [failed, setFailed] = useState(false)
  const [selected, setSelected] = useState(-1)
  const control = useRef<{ select: (i: number) => void; pick: (x: number, y: number) => void } | null>(null)
  const dl = DOWNLOADS[os]
  const layer = selected >= 0 ? t.hero.layers[selected] : null

  return (
    <section id="top" className="relative isolate overflow-hidden pt-16">
      {/* a lifted gray at the top fading into the page ground, like a Spotify header */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(900px_520px_at_78%_8%,#353535_0%,transparent_70%),linear-gradient(to_bottom,#262626_0%,#151515_88%)]"
      />
      <div className="absolute inset-0 -z-10">
        <LyricsBackdrop lines={t.hero.bgLines} />
      </div>
      {!failed && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5]">
          <HeroScene onFail={() => setFailed(true)} onSelect={setSelected} control={control} />
        </div>
      )}

      <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-6 px-5 pb-12 pt-10 sm:px-8 lg:min-h-[min(860px,100svh)] lg:grid-cols-12 lg:pb-16 lg:pt-6">
        <div className="min-w-0 lg:col-span-5">
          <h1
            className="h-display animate-rise-in text-[clamp(2.5rem,4.6vw,4.25rem)]"
            style={{ animationDelay: '60ms' }}
          >
            {t.hero.title}
          </h1>

          <p
            className="animate-rise-in mt-6 max-w-[30rem] text-[17px] leading-relaxed text-[#c4c4c4] sm:text-lg"
            style={{ animationDelay: '180ms' }}
          >
            {t.hero.lead}
          </p>

          <div
            className="animate-rise-in mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '300ms' }}
          >
            <a href={dl.primary} className="btn btn-primary">
              <Download className="size-[18px]" aria-hidden="true" />
              {t.hero.download} {dl.name}
            </a>
            <a href="#tour" className="btn btn-ghost">
              {t.hero.tour}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </a>
          </div>

          <div
            className="animate-rise-in mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[14px] text-[#a0a0a0]"
            style={{ animationDelay: '420ms' }}
          >
            <span>{t.hero.meta}</span>
            <span className="hidden h-1 w-1 rounded-full bg-[#555] sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-2">
              <span className="rounded-full bg-[#2e2e2e] px-2.5 py-0.5 font-mono text-[12px] font-semibold text-white">
                {version}
              </span>
              {t.hero.version}
            </span>
          </div>

          <div
            className="animate-rise-in mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '540ms' }}
          >
            <span className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-black/35 py-2 pl-3.5 pr-4 text-[14px] font-bold ring-1 ring-white/10">
              <Image src="/icons/soundcloud.svg" alt="" width={30} height={17} style={{ width: 30, height: 'auto' }} />
              SoundCloud
            </span>
            <span aria-hidden="true" className="text-[#666]">+</span>
            <span className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-black/35 py-2 pl-3 pr-4 text-[14px] font-bold ring-1 ring-white/10">
              <Image src="/icons/youtubemusic.svg" alt="" width={20} height={20} style={{ width: 20, height: 'auto' }} />
              YouTube Music
            </span>
          </div>
        </div>

        {/* the exploded window is drawn by the canvas behind; it is laid out on this box */}
        <div className="relative min-w-0 lg:col-span-7">
          <div
            id="hero-anchor"
            onClick={(e) => control.current?.pick(e.clientX, e.clientY)}
            className={cn('relative h-[300px] sm:h-[420px] lg:h-[520px]', !failed && 'cursor-pointer')}
          >
            {failed && (
              <div className="window-frame absolute inset-x-0 top-1/2 -translate-y-1/2">
                <Image src="/shots/home.jpg" alt={t.hero.sceneAlt} width={1424} height={821} className="block h-auto w-full" priority />
              </div>
            )}
          </div>

          {!failed && (
            <div className="mt-4 flex flex-col items-center gap-3">
              <div role="group" aria-label={t.hero.layersLabel} className="flex flex-wrap justify-center gap-2">
                {t.hero.layers.map((l, i) => (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={selected === i}
                    onClick={() => control.current?.select(i)}
                    className="chip h-9 px-3.5 text-[12.5px]"
                  >
                    {l.name}
                  </button>
                ))}
              </div>
              <p className="min-h-[1.25rem] font-mono text-[12px] uppercase tracking-[0.14em] text-[#8a8a8a]" aria-live="polite">
                {layer ? layer.desc : t.hero.layersLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
