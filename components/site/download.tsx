'use client'

import { ArrowUpRight, Download as DownloadIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { DOWNLOADS, REPO_URL, type OS } from '@/lib/links'
import { useOS } from './hooks'
import { useI18n } from './i18n'
import { Rise, Tilt } from './motion'

const ORDER: OS[] = ['windows', 'macos', 'linux']

export function Download() {
  const { t } = useI18n()
  const mine = useOS()

  return (
    <section id="download" aria-labelledby="download-h" className="relative isolate overflow-hidden bg-[#121212] py-20 md:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(700px_320px_at_50%_0%,rgb(var(--accent-rgb)/0.16),transparent_70%)]"
      />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Rise className="mx-auto max-w-[44rem] text-center">
          <h2 id="download-h" className="h-section">
            {t.download.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[36rem] text-[17px] text-[#b3b3b3]">{t.download.lead}</p>
        </Rise>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {ORDER.map((id) => {
            const d = DOWNLOADS[id]
            const yours = mine === id
            return (
              <li key={id}>
                <Tilt max={9} scale={1.02} className="h-full rounded-2xl" innerClassName="h-full rounded-2xl">
                  <div
                    className={cn(
                      'relative flex h-full flex-col gap-6 rounded-2xl bg-[#1e1e1e] p-7 transition-shadow duration-300',
                      yours ? 'shadow-[0_0_0_1.5px_var(--accent),0_24px_60px_rgb(0_0_0/0.5)]' : 'shadow-[0_0_0_1px_var(--line)]',
                    )}
                  >
                    {yours && (
                      <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--on-accent)]">
                        <span className="size-1.5 rounded-full bg-[var(--on-accent)]" />
                        {t.download.yours}
                      </span>
                    )}
                    <div className="[transform:translateZ(46px)]">
                      <span className="animate-float-y grid size-[72px] place-items-center rounded-2xl bg-[#2b2b2b] shadow-[0_14px_30px_rgb(0_0_0/0.45)]" style={{ animationDelay: `${ORDER.indexOf(id) * 0.5}s` }}>
                        <Image src={d.icon} alt="" width={36} height={36} className={d.invert ? 'size-9 invert' : 'size-9'} />
                      </span>
                    </div>
                    <div className="[transform:translateZ(24px)]">
                      <h3 className="text-2xl font-extrabold tracking-tight">{d.name}</h3>
                      <p className="mt-1.5 text-[14.5px] text-[#a0a0a0]">{t.download.detail[id]}</p>
                    </div>
                    <a href={d.primary} className={cn('btn mt-auto w-full [transform:translateZ(30px)]', yours ? 'btn-primary' : 'btn-ghost')}>
                      <DownloadIcon className="size-[18px]" aria-hidden="true" />
                      {t.download.primary[id]}
                    </a>
                    <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-[#a0a0a0]">
                      <span>{t.download.also}:</span>
                      {d.also.map((a) => (
                        <a
                          key={a.href}
                          href={a.href}
                          className="font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
                        >
                          {a.label}
                        </a>
                      ))}
                    </p>
                  </div>
                </Tilt>
              </li>
            )
          })}
        </ul>

        <div className="mt-10 text-center">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[15px] font-bold text-[#b3b3b3] transition-colors hover:text-white"
          >
            {t.download.source}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
