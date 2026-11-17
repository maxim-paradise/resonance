'use client'

import Image from 'next/image'
import { useI18n } from './i18n'
import { REPO_URL, SoundCloudBadge, WavySeekbar, YouTubeMusicBadge } from './primitives'
import { Arrow, ButtonLink, Container } from './ui-bits'

export function Hero() {
  const { t } = useI18n()

  return (
    <section id="top" aria-labelledby="hero-h" className="relative overflow-clip pt-28 pb-20 md:pt-36 md:pb-28">
      {/* ground: a red glow behind the window and a dot field fading in from the right */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[38%] left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(229_25_46/38%),transparent)] blur-2xl" />
        <div className="dot-field absolute inset-0 [mask-image:linear-gradient(110deg,transparent_35%,black_80%)]" />
      </div>

      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <p className="animate-rise-in flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <SoundCloudBadge />
              <span aria-hidden="true" className="text-white/30">+</span>
              <YouTubeMusicBadge />
            </p>
            <h1
              id="hero-h"
              className="animate-rise-in font-display text-[38px] leading-[1.02] font-medium tracking-[-0.045em] text-balance sm:text-[56px] lg:text-[54px] xl:text-[60px]"
              style={{ animationDelay: '60ms' }}
            >
              {t.hero.title}
            </h1>
          </div>
          <div className="animate-rise-in flex flex-col gap-6 lg:col-span-5 lg:pb-2" style={{ animationDelay: '140ms' }}>
            <p className="text-[17px] leading-relaxed text-muted-foreground">{t.hero.lead}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="#download">
                {t.hero.download}
                <Arrow />
              </ButtonLink>
              <ButtonLink href={REPO_URL} target="_blank" rel="noreferrer" variant="secondary">
                {t.hero.source}
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="relative mt-12 md:mt-16">
          <div
            className="animate-rise-in relative overflow-hidden rounded-[24px] border border-[var(--line-strong)] bg-card shadow-[0_60px_160px_-50px_rgb(229_25_46/60%)]"
            style={{ animationDelay: '200ms' }}
          >
            <Image
              src="/images/resonance-crimson.jpg"
              alt={t.hero.shotAlt}
              width={1280}
              height={673}
              priority
              className="block h-auto w-full"
            />
          </div>

          {/* now playing: the track that plays in the screenshot */}
          <div className="absolute -bottom-10 left-6 hidden w-[320px] rounded-2xl border border-[var(--line-strong)] bg-[#140c0b]/95 p-5 shadow-[0_24px_60px_-20px_rgb(0_0_0/80%)] backdrop-blur md:block lg:left-10">
            <p className="font-mono text-[11px] tracking-[0.08em] text-accent uppercase">{t.hero.nowPlaying}</p>
            <div className="mt-3 flex items-center gap-3">
              <Image src="/images/tracks/prava.png" alt="" width={56} height={56} className="size-14 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate font-medium">права</p>
                <p className="text-sm text-muted-foreground">ooes · SoundCloud</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
              <span>0:57</span>
              <WavySeekbar progress={39} accentColor="#ff5c6a" />
              <span>2:26</span>
            </div>
          </div>
        </div>

        <p className="mt-16 text-sm text-muted-foreground md:text-right">{t.hero.meta}</p>
      </Container>
    </section>
  )
}
