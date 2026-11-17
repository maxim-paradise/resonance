'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Scroll parallax: the element drifts a little against the scroll while it crosses the viewport.
 * `y` is the travel in px either side of centre. Does nothing under reduced motion.
 */
export function Parallax({
  children,
  y = 40,
  className,
  style,
}: {
  children: ReactNode
  y?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
      const clamped = Math.max(-1, Math.min(1, p))
      el.style.transform = `translate3d(0, ${(-clamped * y).toFixed(1)}px, 0)`
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
  }, [y])

  return (
    <div ref={ref} className={cn('will-change-transform', className)} style={style}>
      {children}
    </div>
  )
}

/**
 * Pointer-driven 3D tilt with a soft glare. Mouse only: touch scrolls the page as usual.
 */
export function Tilt({
  children,
  max = 8,
  glare = true,
  scale = 1.015,
  className,
  innerClassName,
}: {
  children: ReactNode
  max?: number
  glare?: boolean
  scale?: number
  className?: string
  innerClassName?: string
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const shine = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrap.current
    const card = inner.current
    if (!el || !card) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let active = false

    const loop = () => {
      cx += (tx - cx) * 0.14
      cy += (ty - cy) * 0.14
      card.style.transform = `rotateX(${(-cy * max).toFixed(2)}deg) rotateY(${(cx * max).toFixed(2)}deg) scale(${active ? scale : 1})`
      if (shine.current) {
        shine.current.style.background = `radial-gradient(520px circle at ${(50 + cx * 50).toFixed(1)}% ${(50 + cy * 50).toFixed(1)}%, rgb(255 255 255 / 0.10), transparent 55%)`
        shine.current.style.opacity = active ? '1' : '0'
      }
      if (active || Math.abs(cx) > 0.002 || Math.abs(cy) > 0.002) raf = requestAnimationFrame(loop)
      else raf = 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width) * 2 - 1
      ty = ((e.clientY - r.top) / r.height) * 2 - 1
      active = true
      kick()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      active = false
      kick()
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [max, scale])

  return (
    <div ref={wrap} className={cn('[perspective:1400px]', className)}>
      <div
        ref={inner}
        className={cn('relative [transform-style:preserve-3d] will-change-transform', innerClassName)}
      >
        {children}
        {glare && (
          <div
            ref={shine}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          />
        )}
      </div>
    </div>
  )
}

/** Headline reveal: one gentle rise as a heading enters. Used on section titles only. */
export function Rise({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={cn('opacity-0 transition-[opacity,transform] duration-700 ease-[var(--ease)]', className)}
      style={{ transform: 'translateY(16px)' }}
    >
      {children}
    </div>
  )
}
