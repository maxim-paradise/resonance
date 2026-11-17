'use client'

import { useI18n } from './i18n'
import { Reveal } from './motion'

export function Setup() {
  const { t } = useI18n()
  return (
    <section id="setup" aria-labelledby="setup-h" className="relative bg-[#121212] py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <h2 id="setup-h" className="h-section max-w-[20ch]">
            {t.setup.title}
          </h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {t.setup.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 120} className="min-w-0">
              <div className="tile group relative h-full overflow-hidden p-7">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-6 select-none text-[148px] font-extrabold leading-none tracking-tighter text-white/[0.04] transition-all duration-500 group-hover:-translate-y-1 group-hover:text-[var(--accent)]/15"
                >
                  {i + 1}
                </span>
                <span className="grid size-10 place-items-center rounded-full bg-[var(--accent)] text-[15px] font-extrabold text-[var(--on-accent)]">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-xl font-extrabold tracking-tight">{s.title}</h3>
                <p className="mt-2 max-w-[30ch] text-[15px] leading-relaxed text-[#b3b3b3]">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
