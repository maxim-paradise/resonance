'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/*
 * Motion here deliberately does not read prefers-reduced-motion: the owner runs Windows with
 * animation effects switched off, which browsers report as "reduce", and wanted to see the motion.
 */

/** Appear-on-scroll for any block: fades up out of a soft blur once it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'section' | 'span'
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
    transform: shown ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
  }
  return (
    <Tag
      ref={ref as never}
      className={cn(
        'transition-[opacity,transform,filter] duration-[900ms] ease-[var(--ease)] will-change-[opacity,transform]',
        shown ? 'opacity-100 blur-0' : 'opacity-0 blur-[6px]',
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  )
}

/** Scroll parallax: the element drifts a little against the scroll while it crosses the viewport. */
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

/** Pointer-driven 3D tilt with a soft glare. Mouse only: touch scrolls the page as usual. */
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
