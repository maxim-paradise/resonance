'use client'

import { Download as DownloadIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { DOWNLOADS, type OS } from '@/lib/links'
import { useOS } from './hooks'
import { useI18n } from './i18n'
import { Reveal, Tilt } from './motion'

const ORDER: OS[] = ['windows', 'macos', 'linux']

export function Download() {
  const { t } = useI18n()
  const mine = useOS()
  const ref = useRef<HTMLElement>(null)
  // when the section fits on one screen it waits pinned to the bottom of the viewport, underneath
  // the content above, and is uncovered as that content scrolls up and away
  const [under, setUnder] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setUnder(window.matchMedia('(min-width: 768px)').matches && el.offsetHeight <= window.innerHeight - 8)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!under) {
      el.inert = false
      return
    }
    let raf = 0
    // while it is still hidden underneath, keep it out of the tab order and away from the pointer
    const update = () => {
      raf = 0
      const prev = el.previousElementSibling
      el.inert = prev ? prev.getBoundingClientRect().bottom > window.innerHeight + 40 : false
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    // anchor links would otherwise scroll to the pinned position, which is not where it is revealed
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href="#download"]')
      const prev = el.previousElementSibling
      if (!a || !prev) return
      e.preventDefault()
      const prevBottom = prev.getBoundingClientRect().bottom + window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: Math.min(max, Math.max(0, prevBottom - (window.innerHeight - el.offsetHeight))), behavior: 'smooth' })
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('click', onClick)
      if (raf) cancelAnimationFrame(raf)
      el.inert = false
    }
  }, [under])

  return (
    <section
      ref={ref}
      id="download"
      aria-labelledby="download-h"
      className={cn(
        'isolate overflow-hidden bg-[#121212] py-20 md:py-28',
        under ? 'sticky bottom-0 z-0' : 'relative',
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(760px_340px_at_50%_42%,rgb(var(--accent-rgb)/0.15),transparent_70%)]"
      />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[44rem] text-center">
          <h2 id="download-h" className="h-section">
            {t.download.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[36rem] text-[17px] text-[#b3b3b3]">{t.download.lead}</p>
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {ORDER.map((id, idx) => {
            const d = DOWNLOADS[id]
            const yours = mine === id
            return (
              <Reveal as="li" key={id} delay={idx * 130} y={44} className="min-w-0">
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
                      <span
                        className="animate-float-y grid size-[72px] place-items-center rounded-2xl bg-[#2b2b2b] shadow-[0_14px_30px_rgb(0_0_0/0.45)]"
                        style={{ animationDelay: `${idx * 0.5}s` }}
                      >
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
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
