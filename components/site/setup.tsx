'use client'

import Image from 'next/image'
import { useI18n } from './i18n'
import { Container, SectionHead } from './ui-bits'

const COVERS = ['vajbik', 'stalker', 'dm', 'p1448', 'hardstyle', 'johan']

export function Setup() {
  const { t } = useI18n()
  const visuals = [
    <div key="os" className="flex items-center justify-center gap-7">
      <Image src="/icons/windows.svg" alt="Windows" width={44} height={44} />
      <Image src="/icons/apple.svg" alt="macOS" width={40} height={48} className="invert" />
      <Image src="/icons/linux-tux.svg" alt="Linux" width={40} height={48} />
    </div>,
    <div key="accounts" className="flex items-center justify-center gap-5">
      <span className="grid size-16 place-items-center rounded-2xl bg-[#1d1311]">
        <Image src="/icons/soundcloud.svg" alt="SoundCloud" width={44} height={26} />
      </span>
      <svg aria-hidden="true" width="56" height="8" viewBox="0 0 56 8" className="text-primary">
        <path d="M0 4h56" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" className="animate-dash-run" />
      </svg>
      <span className="grid size-16 place-items-center rounded-2xl bg-[#1d1311]">
        <Image src="/icons/youtubemusic.svg" alt="YouTube Music" width={34} height={34} />
      </span>
    </div>,
    <div key="covers" className="grid w-full max-w-[260px] grid-cols-3 gap-2">
      {COVERS.map((name) => (
        <Image key={name} src={`/images/playlists/${name}.png`} alt="" width={120} height={120} className="aspect-square w-full rounded-lg object-cover" />
      ))}
    </div>,
  ]

  return (
    <section id="setup" aria-labelledby="setup-h" className="py-24 md:py-32">
      <Container>
        <SectionHead id="setup-h" title={t.setup.title} />
        <ol className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {t.setup.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-5 rounded-[24px] border border-border bg-card p-6 md:p-8">
              <span className="font-display text-sm font-medium text-accent">0{i + 1}</span>
              <div>
                <h3 className="text-xl font-medium tracking-tight">{step.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
              <div className="mt-auto grid h-44 place-items-center rounded-2xl bg-black/60">{visuals[i]}</div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
