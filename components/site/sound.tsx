'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from './i18n'
import { Reveal } from './motion'

/* ------------------------------------------------------------------ equalizer */

const HZ = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz']
const PRESETS = {
  flat: [0, 0, 0, 0, 0],
  bass: [6.5, 4, 0, -1, 1.5],
  vocal: [-2, -1, 4.5, 3.5, 1],
  rock: [4.5, 2, -1.5, 3, 4.5],
  electronic: [5.5, 2.5, -1, 2.5, 5],
} as const
type PresetId = keyof typeof PRESETS

const W = 640
const H = 300
const PAD = 22
const XS = [0.1, 0.3, 0.5, 0.7, 0.9].map((f) => f * W)
const yOf = (v: number) => H / 2 - (v / 12) * (H / 2 - PAD)
const fmt = (v: number) => (v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1))

/** Catmull-Rom through the points, written as cubic Beziers */
function smoothPath(pts: [number, number][]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

function Equalizer() {
  const { t } = useI18n()
  const [preset, setPreset] = useState<PresetId | 'custom'>('bass')
  const [target, setTarget] = useState<number[]>([...PRESETS.bass])
  const [vals, setVals] = useState<number[]>([...PRESETS.bass])
  const [drag, setDrag] = useState<number | null>(null)
  const svg = useRef<SVGSVGElement>(null)
  const raf = useRef(0)
  const live = useRef<number[]>([...PRESETS.bass])

  // glide to the target values after a preset tap
  useEffect(() => {
    if (drag !== null) return
    const step = () => {
      let moving = false
      const next = live.current.map((v, i) => {
        const diff = target[i] - v
        if (Math.abs(diff) < 0.02) return target[i]
        moving = true
        return v + diff * 0.2
      })
      live.current = next
      setVals(next)
      if (moving) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, drag])

  const choose = (id: PresetId) => {
    setPreset(id)
    setTarget([...PRESETS[id]])
  }

  const setBand = useCallback((i: number, v: number) => {
    const clamped = Math.max(-12, Math.min(12, Math.round(v * 2) / 2))
    setTarget((cur) => cur.map((x, k) => (k === i ? clamped : x)))
    live.current = live.current.map((x, k) => (k === i ? clamped : x))
    setVals(live.current)
    setPreset('custom')
  }, [])

  const onDown = (e: PointerEvent<SVGGElement>, i: number) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag(i)
  }
  const onMove = (e: PointerEvent<SVGGElement>, i: number) => {
    if (drag !== i || !svg.current) return
    const r = svg.current.getBoundingClientRect()
    const y = ((e.clientY - r.top) / r.height) * H
    setBand(i, ((H / 2 - y) / (H / 2 - PAD)) * 12)
  }
  const onKey = (e: KeyboardEvent<SVGGElement>, i: number) => {
    const step = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 0.5 : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -0.5 : 0
    if (!step) return
    e.preventDefault()
    setBand(i, target[i] + step)
  }

  const curve = useMemo(() => {
    const pts: [number, number][] = [[0, yOf(vals[0])], ...vals.map((v, i) => [XS[i], yOf(v)] as [number, number]), [W, yOf(vals[4])]]
    const line = smoothPath(pts)
    return { line, area: `${line} L${W} ${H / 2} L0 ${H / 2} Z` }
  }, [vals])

  const ids: (PresetId | 'custom')[] = ['flat', 'bass', 'vocal', 'rock', 'electronic', 'custom']

  return (
    <div className="w-full min-w-0 rounded-2xl bg-[#1e1e1e] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight">{t.sound.eq.title}</h3>
          <p className="mt-1 text-[14px] text-[#a0a0a0]">{t.sound.eq.sub}</p>
        </div>
        <button
          type="button"
          onClick={() => choose('flat')}
          className="chip h-9 text-[13px]"
          disabled={preset === 'flat'}
          style={{ opacity: preset === 'flat' ? 0.4 : 1 }}
        >
          {t.sound.eq.reset}
        </button>
      </div>

      <div role="group" aria-label={t.sound.eq.title} className="scroll-hide -mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
        {ids.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={preset === id}
            disabled={id === 'custom' && preset !== 'custom'}
            onClick={() => id !== 'custom' && choose(id)}
            className="chip shrink-0 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-[var(--card-2)]"
          >
            {t.sound.eq.presets[id]}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-[#141414]">
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="block w-full select-none touch-none" role="group" aria-label={t.sound.eq.title}>
          <defs>
            <linearGradient id="eq-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--accent)" stopOpacity="0.4" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[-12, -6, 0, 6, 12].map((db) => (
            <g key={db}>
              <line x1="0" x2={W} y1={yOf(db)} y2={yOf(db)} stroke={db === 0 ? '#5a5a5a' : '#2c2c2c'} strokeDasharray={db === 0 ? undefined : '3 5'} />
              <text x={W - 6} y={yOf(db) - 5} textAnchor="end" fontSize="11" fill="#777" fontFamily="var(--font-geist-mono)">
                {db > 0 ? `+${db}` : db}
              </text>
            </g>
          ))}
          <path d={curve.area} fill="url(#eq-fill)" />
          <path d={curve.line} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
          {vals.map((v, i) => (
            <g
              key={i}
              role="slider"
              tabIndex={0}
              aria-label={`${HZ[i]}`}
              aria-valuemin={-12}
              aria-valuemax={12}
              aria-valuenow={Number(target[i].toFixed(1))}
              aria-valuetext={`${fmt(target[i])} dB`}
              onPointerDown={(e) => onDown(e, i)}
              onPointerMove={(e) => onMove(e, i)}
              onPointerUp={() => setDrag(null)}
              onPointerCancel={() => setDrag(null)}
              onKeyDown={(e) => onKey(e, i)}
              className="cursor-grab outline-none active:cursor-grabbing [&:focus-visible>circle:nth-child(2)]:stroke-white"
              style={{ touchAction: 'none' }}
            >
              <circle cx={XS[i]} cy={yOf(v)} r="26" fill="transparent" />
              <circle cx={XS[i]} cy={yOf(v)} r={drag === i ? 14 : 11} fill="#151515" stroke="var(--accent)" strokeWidth="2.5" style={{ transition: 'r 0.15s' }} />
              <circle cx={XS[i]} cy={yOf(v)} r="4.5" fill="var(--accent)" />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {vals.map((v, i) => (
          <div key={i} className="rounded-xl bg-[#262626] px-1 py-3 text-center">
            <div className="font-mono text-[15px] font-bold tabular-nums sm:text-[17px]">{fmt(Math.round(v * 10) / 10)}</div>
            <div className="mt-0.5 text-[11px] font-semibold text-[#8a8a8a] sm:text-[12px]">{HZ[i]}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[13.5px] text-[#8a8a8a]">{t.sound.eq.hint}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ crossfade */

type CurveId = 'linear' | 'smooth' | 'ultra'
const XW = 640
const XH = 300
const XP = 22
const SPAN = 16 // seconds shown on the axis
const MID = 8

function curveFns(id: CurveId) {
  if (id === 'linear') return { inn: (t: number) => t, out: (t: number) => 1 - t }
  if (id === 'smooth') return { inn: (t: number) => Math.sin((t * Math.PI) / 2), out: (t: number) => Math.cos((t * Math.PI) / 2) }
  return { inn: (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t), out: (t: number) => 0.5 + 0.5 * Math.cos(Math.PI * t) }
}

const gx = (sec: number) => (sec / SPAN) * XW
const gy = (g: number) => XH - XP - g * (XH - XP * 2)

/**
 * The picture is the real timeline of a transition. Track B starts while Track A is still playing and
 * the two overlap for exactly the chosen number of seconds, so the slider widens the overlap and the
 * curve selector reshapes the two volume lines inside it.
 */
function Crossfade() {
  const { t } = useI18n()
  const [dur, setDur] = useState(5.5)
  const [curve, setCurve] = useState<CurveId>('ultra')

  const g = useMemo(() => {
    const s = MID - dur / 2
    const e = MID + dur / 2
    const f = curveFns(curve)
    let a: string
    let b: string
    if (dur === 0) {
      a = `M0 ${gy(1)} L${gx(MID)} ${gy(1)} L${gx(MID)} ${gy(0)} L${XW} ${gy(0)}`
      b = `M0 ${gy(0)} L${gx(MID)} ${gy(0)} L${gx(MID)} ${gy(1)} L${XW} ${gy(1)}`
    } else {
      const n = 48
      const pa: string[] = []
      const pb: string[] = []
      for (let i = 0; i <= n; i++) {
        const k = i / n
        pa.push(`L${gx(s + k * dur).toFixed(1)} ${gy(f.out(k)).toFixed(1)}`)
        pb.push(`L${gx(s + k * dur).toFixed(1)} ${gy(f.inn(k)).toFixed(1)}`)
      }
      a = `M0 ${gy(1)} L${gx(s)} ${gy(1)} ${pa.join(' ')} L${XW} ${gy(0)}`
      b = `M0 ${gy(0)} L${gx(s)} ${gy(0)} ${pb.join(' ')} L${XW} ${gy(1)}`
    }
    return { a, b, x0: gx(s), x1: gx(e), s, e }
  }, [dur, curve])

  return (
    <div className="flex w-full min-w-0 flex-col rounded-2xl bg-[#1e1e1e] p-6 md:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-extrabold tracking-tight">{t.sound.xfade.title}</h3>
        <span className="font-mono text-[15px] font-bold tabular-nums text-[var(--accent)]">
          {dur === 0 ? '0 s' : `${dur.toFixed(1)} s`}
        </span>
      </div>

      <div className="relative mt-4 min-h-[220px] flex-1 overflow-hidden rounded-xl bg-[#141414]">
        <svg
          viewBox={`0 0 ${XW} ${XH}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`${t.sound.xfade.title}: ${dur} s, ${t.sound.xfade.curves[curve]}`}
        >
          {[0, 0.5, 1].map((v) => (
            <line key={v} x1="0" x2={XW} y1={gy(v)} y2={gy(v)} stroke="#2c2c2c" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
          ))}
          {[4, 8, 12].map((sec) => (
            <line key={sec} x1={gx(sec)} x2={gx(sec)} y1="0" y2={XH} stroke="#242424" vectorEffect="non-scaling-stroke" />
          ))}
          {dur > 0 && (
            <>
              <rect x={g.x0} y="0" width={Math.max(0, g.x1 - g.x0)} height={XH} fill="var(--accent)" opacity="0.1" />
              <line x1={g.x0} x2={g.x0} y1="0" y2={XH} stroke="var(--accent)" strokeOpacity="0.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
              <line x1={g.x1} x2={g.x1} y1="0" y2={XH} stroke="var(--accent)" strokeOpacity="0.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            </>
          )}
          <path d={g.a} fill="none" stroke="#9a9a9a" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d={g.b} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="pointer-events-none absolute top-2 text-[11.5px] font-bold text-[var(--accent)]" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          {dur === 0 ? t.sound.xfade.cut : `${dur.toFixed(1)} s ${t.sound.xfade.zone}`}
        </span>
        <span className="pointer-events-none absolute bottom-1.5 left-2 font-mono text-[10.5px] text-[#666]">0 s</span>
        <span className="pointer-events-none absolute bottom-1.5 right-2 font-mono text-[10.5px] text-[#666]">{SPAN} s</span>
      </div>

      <div className="mt-3 flex items-center gap-5 text-[12.5px] font-bold">
        <span className="inline-flex items-center gap-2 text-[#b3b3b3]">
          <span className="h-0.5 w-5 rounded-full bg-[#9a9a9a]" aria-hidden="true" />
          {t.sound.xfade.out}
        </span>
        <span className="inline-flex items-center gap-2 text-[var(--accent)]">
          <span className="h-0.5 w-5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          {t.sound.xfade.in}
        </span>
      </div>

      <label className="mt-5 block text-[13px] font-bold text-[#b3b3b3]" htmlFor="xfade-len">
        {t.sound.xfade.length}
      </label>
      <input
        id="xfade-len"
        type="range"
        min={0}
        max={12}
        step={0.5}
        value={dur}
        onChange={(e) => setDur(Number(e.target.value))}
        className="rng mt-3 w-full"
        style={{ ['--fill' as string]: `${(dur / 12) * 100}%` }}
      />
      <div className="mt-1.5 flex justify-between font-mono text-[11px] text-[#777]">
        <span>0 s</span>
        <span>6 s</span>
        <span>12 s</span>
      </div>

      <p className="mt-5 text-[13px] font-bold text-[#b3b3b3]" id="xfade-curve">
        {t.sound.xfade.curve}
      </p>
      <div role="radiogroup" aria-labelledby="xfade-curve" className="mt-2.5 flex flex-wrap gap-2">
        {(['linear', 'smooth', 'ultra'] as CurveId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={curve === id}
            aria-selected={curve === id}
            onClick={() => setCurve(id)}
            className="chip h-9 text-[13px]"
          >
            {t.sound.xfade.curves[id]}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ normalization */

const LUFS = { quiet: -18, standard: -14, loud: -11 } as const
type LufsId = keyof typeof LUFS
const pct = (v: number) => ((v + 30) / 24) * 100

function Normalization() {
  const { t } = useI18n()
  const [on, setOn] = useState(true)
  const [tgt, setTgt] = useState<LufsId>('standard')
  const level = LUFS[tgt]
  const rows = [
    { label: t.sound.norm.a, raw: -24 },
    { label: t.sound.norm.b, raw: -9 },
  ]

  return (
    <div className="grid w-full min-w-0 gap-8 rounded-2xl bg-[#1e1e1e] p-6 md:grid-cols-2 md:gap-12 md:p-8">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">{t.sound.norm.title}</h3>
            <p className="mt-1 text-[14px] text-[#a0a0a0]">{t.sound.norm.sub}</p>
          </div>
          <div role="group" aria-label={t.sound.norm.title} className="flex shrink-0 rounded-full bg-[#2b2b2b] p-1">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={on === v}
                onClick={() => setOn(v)}
                className={cn(
                  'h-8 rounded-full px-3.5 text-[12px] font-extrabold transition-colors',
                  on === v ? 'bg-white text-[#121212]' : 'text-[#b3b3b3] hover:text-white',
                )}
              >
                {v ? t.sound.norm.on : t.sound.norm.off}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[13px] font-bold text-[#b3b3b3]" id="norm-target">
          {t.sound.norm.target}
        </p>
        <div role="radiogroup" aria-labelledby="norm-target" className="mt-2.5 flex flex-wrap gap-2">
          {(Object.keys(LUFS) as LufsId[]).map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={tgt === id}
              aria-selected={tgt === id}
              disabled={!on}
              onClick={() => setTgt(id)}
              className="chip h-9 text-[13px] disabled:opacity-40"
            >
              {t.sound.norm.targets[id]} ({LUFS[id]})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5 self-center">
        {rows.map((r) => {
          const v = on ? level : r.raw
          return (
            <div key={r.label}>
              <div className="mb-2 flex justify-between text-[13px] font-semibold text-[#b3b3b3]">
                <span>{r.label}</span>
                <span className="font-mono tabular-nums text-white">{v} LUFS</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-[#2b2b2b]">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-700 ease-[var(--ease)]"
                  style={{ width: `${pct(v)}%`, opacity: on ? 1 : 0.55 }}
                />
                <span
                  className="absolute inset-y-0 w-0.5 bg-white transition-opacity duration-300"
                  style={{ left: `${pct(level)}%`, opacity: on ? 0.9 : 0 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Sound() {
  const { t } = useI18n()
  return (
    <section id="sound" aria-labelledby="sound-h" className="relative bg-[#121212] py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <h2 id="sound-h" className="h-section max-w-[16ch]">
            {t.sound.title}
          </h2>
          <p className="mt-4 max-w-[40rem] text-[17px] text-[#b3b3b3]">{t.sound.lead}</p>
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <Reveal className="flex min-w-0 lg:col-span-7">
            <Equalizer />
          </Reveal>
          <Reveal delay={120} className="flex min-w-0 lg:col-span-5">
            <Crossfade />
          </Reveal>
          <Reveal delay={60} className="flex min-w-0 lg:col-span-12">
            <Normalization />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
