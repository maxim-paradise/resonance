'use client'

import { useEffect, useRef } from 'react'

const BARS = 28

/**
 * A little sound wave in the corner that follows how you scroll. Still page: a faint breathing
 * line. Scroll and it swells, in proportion to the speed, with a ripple that runs in the direction
 * you are going; stop and it settles back by itself. Everything is eased, nothing jumps.
 */
export function ScrollWave() {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = wrap.current
    if (!root) return
    const bars = Array.from(root.children) as HTMLElement[]

    let raf = 0
    let last = window.scrollY
    let lastT = performance.now()
    let vel = 0
    let energy = 0
    let phase = 0
    let dir = 1

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - lastT) / 1000)
      lastT = now
      if (dt <= 0) return
      const y = window.scrollY
      const raw = (y - last) / dt
      last = y

      vel += (raw - vel) * Math.min(1, dt * 6) // smoothed px/s
      const target = Math.min(1, Math.abs(vel) / 1600)
      energy += (target - energy) * Math.min(1, dt * (target > energy ? 9 : 2.2))
      if (Math.abs(vel) > 30) dir = Math.sign(vel)
      phase += dir * dt * (1.6 + energy * 11)

      for (let i = 0; i < bars.length; i++) {
        const x = i / (bars.length - 1)
        const env = Math.sin(Math.PI * x) // tallest in the middle
        const w = 0.5 + 0.5 * Math.sin(phase + i * 0.55) + 0.35 * Math.sin(phase * 1.7 + i * 1.1)
        const swell = Math.max(0, w / 1.35) * env * energy
        const breathe = 0.05 + 0.05 * env * (0.5 + 0.5 * Math.sin(now / 800 + i * 0.6))
        bars[i].style.transform = `scaleY(${(breathe + 0.12 * env * energy + 0.83 * swell).toFixed(3)})`
        bars[i].style.opacity = String((0.3 + 0.7 * energy).toFixed(3))
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-5 left-5 z-[60] flex h-11 items-end gap-[3px] sm:bottom-6 sm:left-6 sm:h-14"
    >
      {Array.from({ length: BARS }, (_, i) => (
        <span
          key={i}
          className="h-full w-[2px] origin-bottom rounded-full bg-[var(--accent)] sm:w-[3px]"
          style={{ transform: 'scaleY(0.06)', opacity: 0.3 }}
        />
      ))}
    </div>
  )
}
