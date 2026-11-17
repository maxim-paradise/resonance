'use client'

import { useLatestVersion } from './hooks'
import { useI18n } from './i18n'
import { Rise } from './motion'

export function Specs() {
  const { t, locale } = useI18n()
  const version = useLatestVersion()
  const rows: [string, string][] = [[locale === 'ru' ? 'Версия' : 'Version', version], ...(t.specs.rows as unknown as [string, string][])]

  return (
    <section id="specs" aria-labelledby="specs-h" className="relative py-20 md:py-28">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <Rise>
            <h2 id="specs-h" className="h-section">
              {t.specs.title}
            </h2>
          </Rise>
        </div>
        <dl className="lg:col-span-8">
          {rows.map(([k, v]) => (
            <div
              key={k}
              className="group grid gap-1 border-t border-white/10 px-2 py-4 transition-colors hover:bg-white/[0.03] sm:grid-cols-[220px_1fr] sm:gap-6"
            >
              <dt className="text-[14px] font-bold text-[#8a8a8a] transition-colors group-hover:text-[var(--accent)]">{k}</dt>
              <dd className="text-[16px] font-semibold">{v}</dd>
            </div>
          ))}
          <div className="border-t border-white/10" />
        </dl>
      </div>
    </section>
  )
}
