'use client'

import { Download, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'
import { DOWNLOADS } from '@/lib/links'
import { useOS } from './hooks'
import { useI18n } from './i18n'
import { LogoMark } from './logo'
import { usePlayback } from './playback'

const SECTIONS = ['top', 'tour', 'features', 'themes', 'sound', 'lyrics', 'setup', 'specs', 'download']

/**
 * A now-playing bar at the foot of the page, the one Spotify habit worth borrowing.
 * The seek bar is the page itself: it shows how far you have read and jumps on click.
 * Play pauses or restarts the motion in the 3D disc and the equalizer.
 */
export function PlayerBar() {
  const { t } = useI18n()
  const { playing, toggle } = usePlayback()
  const os = useOS()
  const [shown, setShown] = useState(false)
  const [progress, setProgress] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  useEffect(() => {
    const update = () => {
      raf.current = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
      setShown(window.scrollY > window.innerHeight * 0.55)
    }
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  const seekTo = useCallback((f: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: Math.max(0, Math.min(1, f)) * max, behavior: 'smooth' })
  }, [])

  const onTrackDown = (e: PointerEvent<HTMLDivElement>) => {
    const r = track.current?.getBoundingClientRect()
    if (r) seekTo((e.clientX - r.left) / r.width)
  }
  const onTrackKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') seekTo(progress + 0.05)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') seekTo(progress - 0.05)
    else return
    e.preventDefault()
  }

  const jump = (dir: 1 | -1) => {
    const y = window.scrollY + 8
    const tops = SECTIONS.map((id) => {
      const el = document.getElementById(id)
      return el ? el.getBoundingClientRect().top + window.scrollY - 64 : null
    }).filter((v): v is number => v !== null)
    const target =
      dir === 1 ? tops.find((v) => v > y + 40) ?? tops[tops.length - 1] : [...tops].reverse().find((v) => v < y - 40) ?? 0
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const dl = DOWNLOADS[os]

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 px-3 pb-3 transition-transform duration-500 ease-[var(--ease)] sm:px-4 sm:pb-4',
        shown ? 'translate-y-0' : 'translate-y-[130%]',
      )}
      aria-hidden={!shown}
    >
      <div className="mx-auto flex max-w-[1240px] items-center gap-3 rounded-2xl bg-[#1c1c1c]/92 px-3 py-2.5 shadow-[0_0_0_1px_var(--line),0_18px_50px_rgb(0_0_0/0.6)] backdrop-blur-xl sm:gap-5 sm:px-4">
        <div className="flex min-w-0 items-center gap-3 sm:w-[270px] lg:w-[300px]">
          <span
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-lg bg-[#2b2b2b]',
              playing && 'animate-[spin_8s_linear_infinite]',
            )}
          >
            <LogoMark className="size-8" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-[14px] font-bold">Resonance</span>
            <span className="block truncate text-[12.5px] text-[#a0a0a0]">{t.bar.tagline}</span>
          </span>
        </div>

        <div className="flex flex-1 items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-1 sm:flex">
            <button type="button" aria-label={t.bar.prev} onClick={() => jump(-1)} className="grid size-9 place-items-center rounded-full text-[#b3b3b3] transition hover:scale-110 hover:text-white">
              <SkipBack className="size-[18px] fill-current" />
            </button>
          </div>
          <button
            type="button"
            aria-label={playing ? t.bar.pause : t.bar.play}
            aria-pressed={playing}
            onClick={toggle}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-black transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            {playing ? <Pause className="size-[18px] fill-current" /> : <Play className="size-[18px] translate-x-px fill-current" />}
          </button>
          <div className="hidden items-center gap-1 sm:flex">
            <button type="button" aria-label={t.bar.next} onClick={() => jump(1)} className="grid size-9 place-items-center rounded-full text-[#b3b3b3] transition hover:scale-110 hover:text-white">
              <SkipForward className="size-[18px] fill-current" />
            </button>
          </div>

          <div
            ref={track}
            role="slider"
            tabIndex={0}
            aria-label={t.bar.seek}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            onPointerDown={onTrackDown}
            onKeyDown={onTrackKey}
            className="group relative flex h-8 flex-1 cursor-pointer items-center"
          >
            <div className="relative h-1 w-full rounded-full bg-[#4d4d4d]">
              <div className="h-full rounded-full bg-white transition-colors group-hover:bg-[var(--accent)]" style={{ width: `${progress * 100}%` }} />
              <span
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                style={{ left: `${progress * 100}%` }}
              />
            </div>
          </div>
          <span className="hidden w-10 text-right font-mono text-[12px] tabular-nums text-[#a0a0a0] md:block">{Math.round(progress * 100)}%</span>
        </div>

        <a href={dl.primary} className="btn btn-primary btn-sm shrink-0 !px-4 sm:!px-5">
          <Download className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t.bar.download}</span>
          <span className="sr-only sm:hidden">{t.bar.download}</span>
        </a>
      </div>
    </div>
  )
}
