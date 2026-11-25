import {AnimatePresence, motion} from 'motion/react';
import {useEffect, useState} from 'react';
import {MaterialIcon} from '@/src/components/MaterialIcon';
import {FEATURE_GROUPS, type FeatureGroup} from '@/src/data/resonance';

const EXPRESSIVE_SPRING = {type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.85};

export function FeaturesSection() {
  const [lightboxGroup, setLightboxGroup] = useState<FeatureGroup | null>(null);

  useEffect(() => {
    if (!lightboxGroup) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxGroup(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxGroup]);

  return (
    <section id="features" aria-labelledby="features-heading" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{opacity: 0, y: 18}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.3}}
          transition={EXPRESSIVE_SPRING}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold text-[#8CE8D6]">Features</p>
          <h2
            id="features-heading"
            className="mt-2 text-balance text-3xl font-bold tracking-[-0.025em] text-[#F4F6F7] sm:text-4xl"
          >
            Streaming, local files, audio effects, and lyrics in one app.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#C7D0D4] sm:text-lg">
            No bundled yt-dlp or ffmpeg. Audio, lyrics, and caching run locally on your machine.
          </p>
        </motion.div>

        <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-32">
          {FEATURE_GROUPS.map((group, index) => {
            const isReversed = index % 2 === 1;
            return (
              <motion.article
                key={group.id}
                initial={{opacity: 0, y: 28}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.2}}
                transition={{...EXPRESSIVE_SPRING, delay: 0.05}}
                className="grid grid-cols-1 items-center gap-10 border-t border-white/[0.08] pt-14 lg:grid-cols-12 lg:gap-14"
              >
                {/* Screenshot side */}
                <div
                  className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <motion.div
                    whileHover={{scale: 1.012}}
                    transition={EXPRESSIVE_SPRING}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.14] bg-[#0e1114] shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85)]"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={group.screenshot}
                        srcSet={`${group.screenshotSmall} 800w, ${group.screenshot} 1440w`}
                        sizes="(min-width: 1024px) 620px, (min-width: 640px) 88vw, 92vw"
                        alt={group.screenshotAlt}
                        width={1440}
                        height={900}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setLightboxGroup(group)}
                      whileHover={{scale: 1.06}}
                      whileTap={{scale: 0.92}}
                      transition={EXPRESSIVE_SPRING}
                      aria-label={`Inspect ${group.title} screenshot at full size`}
                      className="m3-expressive-btn absolute right-4 bottom-4 inline-flex min-h-[40px] items-center justify-center gap-1.5 border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md hover:bg-[#BCEBF0] hover:text-[#05292E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8CE8D6]"
                    >
                      <MaterialIcon name="open_in_full" size={16} weight={500} />
                      <span>Full view</span>
                    </motion.button>
                  </motion.div>
                </div>

                {/* Open feature text side (no card container) */}
                <div
                  className={`lg:col-span-5 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#BCEBF0]/15 text-[#8CE8D6]">
                      <MaterialIcon name={group.icon} filled size={22} weight={500} />
                    </span>
                    <h3 className="text-2xl font-semibold tracking-tight text-[#F4F6F7]">
                      {group.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-base leading-relaxed text-[#C7D0D4]">{group.summary}</p>

                  <dl className="mt-7 space-y-5">
                    {group.items.map((item) => (
                      <motion.div
                        key={item.name}
                        whileHover={{x: 4}}
                        transition={{duration: 0.16, ease: [0.2, 0, 0, 1]}}
                        className="rounded-xl py-1 transition-colors"
                      >
                        <dt className="flex items-center gap-2.5 text-sm font-semibold text-[#F4F6F7]">
                          <MaterialIcon
                            name={item.icon}
                            size={18}
                            weight={450}
                            className="shrink-0 text-[#8CE8D6]"
                          />
                          <span>{item.name}</span>
                        </dt>
                        <dd className="mt-1 pl-7 text-sm leading-relaxed text-[#C7D0D4]">
                          {item.detail}
                        </dd>
                      </motion.div>
                    ))}
                  </dl>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {lightboxGroup && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={lightboxGroup.title}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.18}}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl sm:p-8"
            onClick={() => setLightboxGroup(null)}
          >
            <motion.div
              initial={{opacity: 0, scale: 0.94, y: 8}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.95, y: 6}}
              transition={EXPRESSIVE_SPRING}
              className="relative w-full max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-4 text-stone-200">
                <span className="font-display text-sm font-medium">{lightboxGroup.title}</span>
                <motion.button
                  type="button"
                  onClick={() => setLightboxGroup(null)}
                  whileHover={{scale: 1.06}}
                  whileTap={{scale: 0.92}}
                  transition={EXPRESSIVE_SPRING}
                  aria-label="Close full-size screenshot"
                  className="m3-expressive-btn inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/[0.16] bg-white/[0.12] text-white hover:bg-white/[0.22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8CE8D6]"
                >
                  <MaterialIcon name="close" size={22} />
                </motion.button>
              </div>
              <img
                src={lightboxGroup.fullScreenshot}
                alt={lightboxGroup.screenshotAlt}
                width={1600}
                height={1000}
                decoding="async"
                className="max-h-[82vh] w-full rounded-2xl border border-white/[0.16] bg-stone-950 object-contain shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
