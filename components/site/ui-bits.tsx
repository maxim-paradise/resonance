import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-[1280px] px-5 md:px-10', className)} {...props} />
}

export function SectionHead({
  id,
  title,
  lead,
  className,
  children,
}: {
  id: string
  title: ReactNode
  lead?: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-12 md:items-end', className)}>
      <h2
        id={id}
        className="font-display text-[32px] leading-[1.05] font-medium tracking-[-0.03em] text-balance text-foreground md:col-span-7 md:text-[48px]"
      >
        {title}
      </h2>
      {lead ? (
        <p className="max-w-[52ch] text-[17px] leading-relaxed text-muted-foreground md:col-span-5 md:text-lg">
          {lead}
        </p>
      ) : null}
      {children}
    </div>
  )
}

const buttonBase =
  'group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent active:translate-y-px'

export function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...props
}: ComponentProps<'a'> & { variant?: 'primary' | 'secondary' }) {
  return (
    <a
      className={cn(
        buttonBase,
        variant === 'primary'
          ? 'bg-primary text-primary-foreground shadow-[0_10px_40px_-12px_rgb(229_25_46/80%)] hover:-translate-y-0.5 hover:bg-[#f0283c]'
          : 'border border-[var(--line-strong)] text-foreground hover:-translate-y-0.5 hover:bg-white/[0.06]',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={cn('size-3 transition-transform duration-200 group-hover:translate-x-0.5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 6h9M6.5 2.5 10 6l-3.5 3.5" />
    </svg>
  )
}
