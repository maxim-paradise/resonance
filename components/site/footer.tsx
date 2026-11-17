'use client'

import Image from 'next/image'
import { useI18n } from './i18n'
import { RELEASES_URL, REPO_URL } from './primitives'
import { Container } from './ui-bits'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border py-14">
      <Container className="grid gap-10 md:grid-cols-12">
        <div className="flex flex-col gap-4 md:col-span-6">
          <a href="#top" className="flex items-center gap-2.5 text-[17px] font-medium tracking-tight">
            <span className="grid size-8 place-items-center rounded-[10px] border border-[var(--line-strong)] bg-black">
              <Image src="/app-icon.png" alt="" width={64} height={64} className="size-5 object-contain" />
            </span>
            Resonance
          </a>
          <p className="max-w-[44ch] text-[15px] leading-relaxed text-muted-foreground">{t.footer.description}</p>
        </div>
        <nav aria-label={t.footer.product} className="md:col-span-3">
          <h3 className="text-sm text-muted-foreground">{t.footer.product}</h3>
          <ul className="mt-4 flex flex-col gap-3 text-[15px]">
            <li><a href="#library" className="hover:text-accent">{t.nav.library}</a></li>
            <li><a href="#sound" className="hover:text-accent">{t.nav.sound}</a></li>
            <li><a href="#lyrics" className="hover:text-accent">{t.nav.lyrics}</a></li>
            <li><a href="#download" className="hover:text-accent">{t.nav.download}</a></li>
          </ul>
        </nav>
        <nav aria-label={t.footer.project} className="md:col-span-3">
          <h3 className="text-sm text-muted-foreground">{t.footer.project}</h3>
          <ul className="mt-4 flex flex-col gap-3 text-[15px]">
            <li><a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-accent">GitHub</a></li>
            <li><a href={RELEASES_URL} target="_blank" rel="noreferrer" className="hover:text-accent">{t.footer.releases}</a></li>
          </ul>
        </nav>
        <p className="border-t border-border pt-6 text-sm text-muted-foreground md:col-span-12">
          © {new Date().getFullYear()} Resonance. {t.footer.disclaimer}
        </p>
      </Container>
    </footer>
  )
}
