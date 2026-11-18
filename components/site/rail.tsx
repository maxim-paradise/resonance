'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from './i18n'
import { ScrollWave } from './scroll-wave'

const IDS = ['top', 'tour', 'features', 'themes', 'sound', 'lyrics', 'setup', 'download'] as const

/**
 * Page position: a column of dots on the right edge marks the sections (click one to jump), and
 * the wave in the corner moves with the scroll. The Download section is revealed from underneath
 * the one above it, so it is "reached" when that one has risen away, not by its own top edge.
 */
export function Rail() {
  const { t } = useI18n()
  const [current, setCurrent] = useState<string>('top')

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const mid = vh * 0.45
      let found: string = IDS[0]
      for (const id of IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const edge = id === 'download' ? el.previousElementSibling?.getBoundingClientRect().bottom ?? Infinity : el.getBoundingClientRect().top
        if (edge <= (id === 'download' ? vh * 0.6 : mid)) found = id
      }
      setCurrent(found)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <ScrollWave />
      <nav
        aria-label={t.rail.label}
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 xl:flex"
      >
        {IDS.map((id) => {
          const active = current === id
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-label={t.rail[id]}
              aria-current={active ? 'true' : undefined}
              className="group flex items-center gap-3 py-1.5 pl-6"
            >
              <span className="translate-x-2 rounded-full bg-[#2a2a2a] px-3 py-1 text-[12px] font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                {t.rail[id]}
              </span>
              <span
                className={cn(
                  'block rounded-full transition-all duration-300 ease-[var(--ease)]',
                  active ? 'h-7 w-1.5 bg-[var(--accent)]' : 'size-1.5 bg-[#555] group-hover:bg-white',
                )}
              />
            </a>
          )
        })}
      </nav>
    </>
  )
}
