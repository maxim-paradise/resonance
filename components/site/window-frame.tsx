'use client'

import { Minus, Square, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { LogoMark } from './logo'

export interface Shot {
  src: string
  alt: string
}

/** A Windows-style frame around real screenshots. The shots stack and cross-fade. */
export function WindowFrame({
  shots,
  active,
  priority = false,
  className,
}: {
  shots: Shot[]
  active: number
  priority?: boolean
  className?: string
}) {
  return (
    <div className={cn('window-frame', className)}>
      <div className="flex h-9 items-center gap-2 bg-[#0d0d0d] pl-3 pr-1" aria-hidden="true">
        <LogoMark className="size-4" />
        <span className="text-[12px] font-semibold text-[#cfcfcf]">Resonance</span>
        <span className="ml-auto flex">
          {[Minus, Square, X].map((Icon, i) => (
            <span key={i} className="grid h-9 w-11 place-items-center text-[#9a9a9a]">
              <Icon className="size-3" strokeWidth={2.2} />
            </span>
          ))}
        </span>
      </div>
      <div className="relative aspect-[1424/821] bg-[#101010]">
        {shots.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt={i === active ? s.alt : ''}
            aria-hidden={i === active ? undefined : true}
            fill
            sizes="(min-width: 1280px) 820px, (min-width: 1024px) 66vw, 100vw"
            priority={priority && i === 0}
            className={cn(
              'object-cover transition-opacity duration-500 ease-[var(--ease)]',
              i === active ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
      </div>
    </div>
  )
}
