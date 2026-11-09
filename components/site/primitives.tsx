import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const REPO_URL = 'https://github.com/BohdanKrakoviatskyi/Resonance'
export const RELEASES_URL = `${REPO_URL}/releases/latest`

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={cn('size-5', className)}
    >
      <rect x="3" y="9" width="2.4" height="6" rx="1.2" fill="currentColor" />
      <rect x="7.2" y="5.5" width="2.4" height="13" rx="1.2" fill="currentColor" />
      <rect x="11.4" y="2.5" width="2.4" height="19" rx="1.2" fill="currentColor" />
      <rect x="15.6" y="6.5" width="2.4" height="11" rx="1.2" fill="currentColor" />
      <rect x="19.8" y="10" width="2.4" height="4" rx="1.2" fill="currentColor" />
    </svg>
  )
}

export function GlassCard({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.012] shadow-[inset_0_1px_0_0_oklch(1_0_0/8%)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
      <LogoMark className="size-3 text-primary" />
      {children}
    </span>
  )
}

export function SectionHeading({
  badge,
  title,
  description,
}: {
  badge: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <Badge>{badge}</Badge>
      <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h2>
      <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
        {description}
      </p>
    </div>
  )
}
