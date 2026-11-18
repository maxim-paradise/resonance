'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const LINE = 112 // px per line, matches the line-height below
const SPEED = 26 // px per second

/**
 * Huge lyric lines rolling slowly upward behind the hero, the way the app's lyrics view scrolls.
 * The line crossing the reading height lights up for a moment. Demo lines, not real lyrics.
 */
export function LyricsBackdrop({ lines }: { lines: string[] }) {
  const col = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(-1)
  const loop = [...lines, ...lines, ...lines]

  useEffect(() => {
    let raf = 0
    let last = -1
    const start = performance.now()
    const total = lines.length * LINE
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const el = col.current
      const b = box.current
      if (!el || !b) return
      const off = (((now - start) / 1000) * SPEED) % total
      el.style.transform = `translate3d(0, ${-off}px, 0)`
      // the line whose middle is nearest 38% down the hero is the sung one
      const read = b.clientHeight * 0.38 + off
      const idx = Math.floor(read / LINE)
      if (idx !== last) {
        last = idx
        setActive(idx)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [lines.length])

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_70%,transparent),linear-gradient(to_right,rgb(0_0_0/0.25),black_55%)] [mask-composite:intersect]"
    >
      <div ref={col} className="will-change-transform">
        {loop.map((text, i) => (
          <p
            key={i}
            style={{ height: LINE, lineHeight: `${LINE}px` }}
            className={cn(
              'whitespace-nowrap px-[4vw] text-[clamp(3.5rem,8.5vw,7.5rem)] font-extrabold tracking-[-0.045em] transition-[color,opacity] duration-[1200ms] ease-[var(--ease)]',
              i === active ? 'text-white/[0.09]' : 'text-white/[0.022]',
            )}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}
