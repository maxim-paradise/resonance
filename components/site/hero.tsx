'use client'

import { ArrowRight, Download } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'
import { DOWNLOADS } from '@/lib/links'
import { useLatestVersion, useOS } from './hooks'
import { useI18n } from './i18n'

const HeroScene = dynamic(() => import('./hero-scene'), { ssr: false })

/** shown only when WebGL is unavailable */
function StaticCovers() {
  const covers = ['/images/ooes-cover.png', '/images/playlists/stalker.png', '/images/playlists/vajbik.png']
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-[260px] w-[340px]">
        {covers.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={200}
            height={200}
            className="absolute size-[190px] rounded-2xl object-cover shadow-2xl"
            style={{ left: i * 70, top: i % 2 ? 56 : 0, transform: `rotate(${(i - 1) * 6}deg)` }}
          />
        ))}
      </div>
    </div>
  )
}

export function Hero() {
  const { t } = useI18n()
  const os = useOS()
  const version = useLatestVersion()
  const [failed, setFailed] = useState(false)
  const dl = DOWNLOADS[os]

  return (
    <section id="top" className="relative isolate overflow-hidden pt-16">
      {/* a lifted gray at the top fading into the page ground, like a Spotify header */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(900px_520px_at_78%_8%,#3a3a3a_0%,transparent_70%),linear-gradient(to_bottom,#2a2a2a_0%,#151515_88%)]"
      />
      <div
        aria-hidden="true"
        className="dot-field absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(70%_60%_at_70%_30%,black,transparent)]"
      />

      <div className="mx-auto grid max-w-[1240px] items-center gap-6 px-5 pb-12 pt-10 sm:px-8 lg:min-h-[min(820px,100svh)] lg:grid-cols-12 lg:pb-16 lg:pt-6">
        <div className="min-w-0 lg:col-span-6">
          <h1
            className="h-display animate-rise-in text-[clamp(2.5rem,5vw,4.5rem)]"
            style={{ animationDelay: '60ms' }}
          >
            {t.hero.title}
          </h1>

          <p
            className="animate-rise-in mt-6 max-w-[32rem] text-[17px] leading-relaxed text-[#c4c4c4] sm:text-lg"
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

        <div
          className="relative -mx-4 h-[380px] min-w-0 sm:h-[480px] lg:-mx-8 lg:col-span-6 lg:h-[660px]"
          role="img"
          aria-label={t.hero.sceneAlt}
        >
          {failed ? <StaticCovers /> : <HeroScene onFail={() => setFailed(true)} />}
        </div>
      </div>
    </section>
  )
}
