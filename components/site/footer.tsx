'use client'

import { RELEASES_URL, REPO_URL } from '@/lib/links'
import { useI18n } from './i18n'
import { Wordmark } from './logo'
import { Reveal } from './motion'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-white/10 bg-[#0f0f0f] pb-14 pt-14">
      <Reveal y={20} className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-8 md:grid-cols-12">
        <div className="flex flex-col gap-4 md:col-span-6">
          <a href="#top" aria-label="Resonance">
            <Wordmark />
          </a>
          <p className="max-w-[44ch] text-[15px] leading-relaxed text-[#a0a0a0]">{t.footer.description}</p>
        </div>
        <nav aria-label={t.footer.product} className="md:col-span-3">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#7c7c7c]">{t.footer.product}</h3>
          <ul className="mt-4 flex flex-col gap-3 text-[15px] font-semibold">
            <li><a href="#tour" className="hover:text-[var(--accent)]">{t.nav.tour}</a></li>
            <li><a href="#features" className="hover:text-[var(--accent)]">{t.nav.features}</a></li>
            <li><a href="#sound" className="hover:text-[var(--accent)]">{t.nav.sound}</a></li>
            <li><a href="#download" className="hover:text-[var(--accent)]">{t.nav.download}</a></li>
          </ul>
        </nav>
        <nav aria-label={t.footer.project} className="md:col-span-3">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#7c7c7c]">{t.footer.project}</h3>
          <ul className="mt-4 flex flex-col gap-3 text-[15px] font-semibold">
            <li><a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">GitHub</a></li>
            <li><a href={RELEASES_URL} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">{t.footer.releases}</a></li>
          </ul>
        </nav>
        <p className="border-t border-white/10 pt-6 text-[13.5px] text-[#7c7c7c] md:col-span-12">
          © {new Date().getFullYear()} Resonance. {t.footer.disclaimer}
        </p>
      </Reveal>
    </footer>
  )
}
