import {motion} from 'motion/react';
import {MaterialIcon} from '@/src/components/MaterialIcon';
import {BRAND_ASSETS, REPO_URL} from '@/src/data/resonance';

const NAV_ITEMS = [
  {href: '#features', label: 'Features'},
  {href: '#architecture', label: 'Why Resonance'},
  {href: '#download', label: 'Download'},
];

const SPRING_TAP = {type: 'spring' as const, stiffness: 520, damping: 32, mass: 0.7};

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.12] bg-[#0e1216]/65 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-3.5">
        <motion.a
          href="#top"
          whileHover={{scale: 1.02}}
          whileTap={{scale: 0.97}}
          transition={SPRING_TAP}
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-2xl font-display text-lg font-bold tracking-tight text-[#F4F6F7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8CE8D6]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.16] bg-white/[0.10] p-1.5 shadow-xs">
            <img
              src={BRAND_ASSETS.rsMarkSmall}
              alt=""
              aria-hidden="true"
              width={64}
              height={45}
              className="h-full w-full object-contain"
            />
          </span>
          <span>Resonance</span>
        </motion.a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              whileHover={{y: -1}}
              whileTap={{scale: 0.96}}
              transition={SPRING_TAP}
              className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-[#C7D0D4] transition-colors duration-150 hover:bg-white/[0.10] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8CE8D6]"
            >
              {item.label}
            </motion.a>
          ))}
          <motion.a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={{y: -1}}
            whileTap={{scale: 0.96}}
            transition={SPRING_TAP}
            className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-[#C7D0D4] transition-colors duration-150 hover:bg-white/[0.10] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8CE8D6]"
          >
            GitHub
          </motion.a>
        </nav>

        <div className="flex shrink-0 items-center">
          <motion.a
            href="#download"
            whileHover={{scale: 1.025}}
            whileTap={{scale: 0.95}}
            transition={SPRING_TAP}
            className="m3-expressive-btn inline-flex min-h-[40px] shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-[#BCEBF0] px-5 py-2 text-sm font-semibold text-[#05292E] shadow-xs hover:bg-[#D5F4F7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8CE8D6]"
          >
            <MaterialIcon name="download" size={18} weight={500} />
            <span>Download App</span>
          </motion.a>
        </div>
      </div>
    </header>
  );
}
