'use client'

import { useI18n } from './i18n'
import { Container } from './ui-bits'

/* The right-hand panel of the real app (teal theme): cover, track, lyrics tab and the synced lines.
   Cropped from the screenshot by position: x 1034, y 240, 226 x 424 px of the 1280 x 673 source. */
const CROP = { x: 1034, y: 240, w: 226, h: 424, srcW: 1280, srcH: 673 }

export function Lyrics() {
  const { t } = useI18n()

  return (
    <section id="lyrics" aria-labelledby="lyrics-h" className="relative overflow-clip bg-card py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 right-[8%] h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(229_25_46/30%),transparent)] blur-2xl" />
      <Container className="relative grid items-center gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <h2 id="lyrics-h" className="font-display text-[32px] leading-[1.05] font-medium tracking-[-0.03em] text-balance md:text-[48px]">
            {t.lyrics.title}
          </h2>
          <p className="max-w-[46ch] text-lg leading-relaxed text-muted-foreground">{t.lyrics.lead}</p>
        </div>

        <div className="flex justify-center lg:col-span-6 lg:justify-end">
          <div
            className="relative w-full max-w-[300px] overflow-hidden rounded-[24px] border border-[var(--line-strong)] shadow-[0_40px_100px_-40px_rgb(0_0_0/90%)]"
            style={{ aspectRatio: `${CROP.w} / ${CROP.h}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/resonance-teal.jpg"
              alt={t.lyrics.alt}
              className="absolute max-w-none"
              style={{
                width: `${(CROP.srcW / CROP.w) * 100}%`,
                left: `${(-CROP.x / CROP.w) * 100}%`,
                top: `${(-CROP.y / CROP.h) * 100}%`,
              }}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
