'use client'

import {
  AudioLines,
  Blend,
  Cpu,
  Droplets,
  FolderLock,
  Gauge,
  Heart,
  Keyboard,
  Languages,
  Layers,
  Library,
  ListMusic,
  Maximize2,
  MicVocal,
  Moon,
  Music,
  Palette,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useI18n } from './i18n'
import { Rise } from './motion'

const ICONS: Record<string, LucideIcon> = {
  two: Library,
  fav: Heart,
  search: Search,
  playlists: ListMusic,
  bar: Music,
  queue: ListMusic,
  lyrics: MicVocal,
  fullscreen: Maximize2,
  change: RefreshCw,
  eq: SlidersHorizontal,
  xfade: Blend,
  norm: Gauge,
  glass: Droplets,
  bg: Layers,
  accent: Palette,
  metal: Sparkles,
  theme: Moon,
  keys: Keyboard,
  lang: Languages,
  update: Zap,
  local: FolderLock,
  os: Cpu,
}

type Cat = 'all' | 'library' | 'playback' | 'sound' | 'look' | 'app'
const CATS: Cat[] = ['all', 'library', 'playback', 'sound', 'look', 'app']

export function Features() {
  const { t } = useI18n()
  const [cat, setCat] = useState<Cat>('all')
  const items = t.features.items.filter((i) => cat === 'all' || i.cat === cat)

  return (
    <section id="features" aria-labelledby="features-h" className="relative bg-[#121212] py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Rise>
          <h2 id="features-h" className="h-section max-w-[16ch]">
            {t.features.title}
          </h2>
          <p className="mt-4 max-w-[40rem] text-[17px] text-[#b3b3b3]">{t.features.lead}</p>
        </Rise>

        <div
          role="group"
          aria-label={t.features.title}
          className="scroll-hide -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className="chip shrink-0"
            >
              {t.features.filters[c]}
            </button>
          ))}
        </div>

        <ul key={cat} className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[item.id] ?? AudioLines
            return (
              <li
                key={item.id}
                className="tile animate-rise-in group flex flex-col gap-4 p-5"
                style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
              >
                <span className="grid size-12 place-items-center rounded-lg bg-[#2b2b2b] text-[var(--accent)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]">
                  <Icon className="size-[22px]" strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold leading-snug tracking-tight">{item.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#b3b3b3]">{item.desc}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
