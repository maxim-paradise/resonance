'use client'

import { Maximize2, MicVocal, RefreshCw } from 'lucide-react'
import { useI18n } from './i18n'
import { Parallax, Reveal, Tilt } from './motion'
import { WindowFrame } from './window-frame'

const ICONS = [MicVocal, Maximize2, RefreshCw]

export function Lyrics() {
  const { t } = useI18n()
  return (
    <section id="lyrics" aria-labelledby="lyrics-h" className="relative py-20 md:py-28">
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-4">
          <Reveal>
            <h2 id="lyrics-h" className="h-section">
              {t.lyrics.title}
            </h2>
            <p className="mt-4 max-w-[30rem] text-[17px] text-[#b3b3b3]">{t.lyrics.lead}</p>
          </Reveal>
          <ul className="mt-9 grid gap-5">
            {t.lyrics.points.map((p, i) => {
              const Icon = ICONS[i]
              return (
                <Reveal as="li" key={p.title} delay={140 + i * 110} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#2b2b2b] text-[var(--accent)]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-0.5 text-[15px] leading-relaxed text-[#b3b3b3]">{p.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>
        <Reveal delay={200} y={48} className="min-w-0 lg:col-span-8">
          <Parallax y={34}>
            <Tilt max={5} className="rounded-[14px]" innerClassName="rounded-[14px]">
              <WindowFrame shots={[{ src: '/shots/lyrics.jpg', alt: t.lyrics.alt }]} active={0} />
            </Tilt>
          </Parallax>
        </Reveal>
      </div>
    </section>
  )
}
