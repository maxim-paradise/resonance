'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useI18n } from './i18n'
import { Reveal } from './motion'

/**
 * Four things Resonance does that its neighbours do not. Each is a large tile with a real
 * screenshot peeking out of it, not a grid of icons.
 */
export function Features() {
  const { t } = useI18n()
  const [library, colors, fade, lyrics] = t.why.items
  const alts = t.why.alts

  return (
    <section id="features" aria-labelledby="features-h" className="relative bg-[#121212] py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <h2 id="features-h" className="h-section max-w-[16ch]">
            {t.why.title}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          {/* 1. one library */}
          <Reveal className="min-w-0 lg:col-span-7">
            <Tile title={library.title} desc={library.desc} className="h-full">
              <div className="relative mt-8 h-[260px] overflow-hidden rounded-t-xl sm:h-[320px]">
                <Image
                  src="/shots/home.jpg"
                  alt={alts.library}
                  fill
                  sizes="(min-width: 1024px) 700px, 100vw"
                  className="object-cover object-left-top transition-transform duration-700 ease-[var(--ease)] group-hover:scale-[1.04]"
                />
              </div>
            </Tile>
          </Reveal>

          {/* 2. colors: three themes fanned out */}
          <Reveal delay={100} className="min-w-0 lg:col-span-5">
            <Tile title={colors.title} desc={colors.desc} className="h-full">
              <div role="img" aria-label={alts.colors} className="relative mt-8 h-[260px] sm:h-[320px]">
                {[
                  { src: '/shots/theme-blue.jpg', cls: 'left-0 top-8 -rotate-6 group-hover:-translate-x-3 group-hover:-rotate-[9deg]' },
                  { src: '/shots/theme-orange.jpg', cls: 'left-[15%] top-3 rotate-2 group-hover:-translate-y-2' },
                  { src: '/shots/theme-teal.jpg', cls: 'left-[30%] top-14 rotate-6 group-hover:translate-x-3 group-hover:rotate-[9deg]' },
                ].map((s) => (
                  <div
                    key={s.src}
                    className={cn(
                      'absolute aspect-[1424/821] w-[70%] overflow-hidden rounded-lg shadow-[0_16px_40px_rgb(0_0_0/0.55)] ring-1 ring-white/10 transition-transform duration-700 ease-[var(--ease)]',
                      s.cls,
                    )}
                  >
                    <Image src={s.src} alt="" fill sizes="320px" className="object-cover" />
                  </div>
                ))}
              </div>
            </Tile>
          </Reveal>

          {/* 3. crossfade */}
          <Reveal delay={100} className="min-w-0 lg:col-span-5">
            <Tile title={fade.title} desc={fade.desc} className="h-full">
              <div className="relative mt-8 h-[260px] overflow-hidden rounded-t-xl sm:h-[320px]">
                <Image
                  src="/shots/audio.jpg"
                  alt={alts.fade}
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover object-left-top transition-transform duration-700 ease-[var(--ease)] group-hover:scale-[1.04]"
                />
              </div>
            </Tile>
          </Reveal>

          {/* 4. lyrics */}
          <Reveal className="min-w-0 lg:col-span-7">
            <Tile title={lyrics.title} desc={lyrics.desc} className="h-full">
              <div className="relative mt-8 h-[260px] overflow-hidden rounded-t-xl sm:h-[320px]">
                <Image
                  src="/shots/lyrics.jpg"
                  alt={alts.lyrics}
                  fill
                  sizes="(min-width: 1024px) 700px, 100vw"
                  className="object-cover object-center transition-transform duration-700 ease-[var(--ease)] group-hover:scale-[1.04]"
                />
              </div>
            </Tile>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Tile({
  title,
  desc,
  className,
  children,
}: {
  title: string
  desc: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl bg-[#1e1e1e] px-7 pt-8 transition-[background-color,transform,box-shadow] duration-500 ease-[var(--ease)] hover:-translate-y-1 hover:bg-[#232323] hover:shadow-[0_24px_60px_rgb(0_0_0/0.45)] sm:px-9 sm:pt-10',
        className,
      )}
    >
      <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">{title}</h3>
      <p className="mt-3 max-w-[34rem] text-[16px] leading-relaxed text-[#b3b3b3]">{desc}</p>
      <div className="mt-auto">{children}</div>
    </div>
  )
}
