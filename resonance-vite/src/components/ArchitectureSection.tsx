import {motion} from 'motion/react';
import {MaterialIcon} from '@/src/components/MaterialIcon';
import {ARCHITECTURE_PILLARS} from '@/src/data/resonance';

const EXPRESSIVE_SPRING = {type: 'spring' as const, stiffness: 460, damping: 34, mass: 0.85};

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      aria-labelledby="architecture-heading"
      className="border-t border-white/[0.08] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#8CE8D6]">Architecture</p>
          <h2
            id="architecture-heading"
            className="mt-2 text-balance text-3xl font-bold tracking-[-0.025em] text-[#F4F6F7] sm:text-4xl"
          >
            Why Resonance
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
          {ARCHITECTURE_PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.25}}
              transition={{...EXPRESSIVE_SPRING, delay: index * 0.07}}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#BCEBF0]/15 text-[#8CE8D6]">
                <MaterialIcon name={pillar.icon} filled size={22} weight={500} />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#F4F6F7]">
                {pillar.title}
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-[#C7D0D4]">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
