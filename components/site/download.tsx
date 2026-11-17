'use client'

import Image from 'next/image'
import { useI18n } from './i18n'
import { REPO_URL } from './primitives'
import { Arrow, ButtonLink, Container } from './ui-bits'

export function Download() {
  const { t } = useI18n()

  const platforms = [
    {
      name: 'Windows',
      icon: '/icons/windows.svg',
      invert: false,
      detail: t.download.windowsDetail,
      primary: { label: t.download.windowsPrimary, href: '/api/download?platform=windows-exe' },
      also: [{ label: '.msi', href: '/api/download?platform=windows-msi' }],
    },
    {
      name: 'macOS',
      icon: '/icons/apple.svg',
      invert: true,
      detail: t.download.macosDetail,
      primary: { label: t.download.macosPrimary, href: '/api/download?platform=macos-arm64' },
      also: [{ label: t.download.macIntel, href: '/api/download?platform=macos-x64' }],
    },
    {
      name: 'Linux',
      icon: '/icons/linux-tux.svg',
      invert: false,
      detail: t.download.linuxDetail,
      primary: { label: t.download.linuxPrimary, href: '/api/download?platform=linux-appimage' },
      also: [
        { label: '.deb', href: '/api/download?platform=linux-deb' },
        { label: '.rpm', href: '/api/download?platform=linux-rpm' },
      ],
    },
  ]

  return (
    <section id="download" aria-labelledby="download-h" className="relative overflow-clip py-24 md:py-32">
      {/* the site's own artwork: dunes under a column of light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Image src="/images/hero-dunes.png" alt="" fill className="object-cover object-[50%_60%] opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </div>

      <Container>
        <div className="max-w-[640px]">
          <h2 id="download-h" className="font-display text-[32px] leading-[1.05] font-medium tracking-[-0.04em] md:text-[48px]">
            {t.download.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t.download.lead}</p>
        </div>

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {platforms.map((p) => (
            <li key={p.name} className="flex flex-col gap-6 rounded-[24px] border border-[var(--line-strong)] bg-[#140c0b]/90 p-6 backdrop-blur md:p-8">
              <div className="flex items-center gap-4">
                <Image src={p.icon} alt="" width={36} height={36} className={p.invert ? 'size-9 invert' : 'size-9'} />
                <div>
                  <h3 className="text-xl font-medium tracking-tight">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.detail}</p>
                </div>
              </div>
              <ButtonLink href={p.primary.href} className="mt-auto w-full justify-between">
                {p.primary.label}
                <Arrow />
              </ButtonLink>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span>{t.download.also}:</span>
                {p.also.map((a) => (
                  <a key={a.href} href={a.href} className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-accent">
                    {a.label}
                  </a>
                ))}
              </p>
            </li>
          ))}
        </ul>

        <a href={REPO_URL} target="_blank" rel="noreferrer" className="group mt-8 inline-flex items-center gap-2 text-[15px] text-muted-foreground hover:text-foreground">
          {t.download.source}
          <Arrow />
        </a>
      </Container>
    </section>
  )
}
