import { useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from 'framer-motion';
import { Github } from 'lucide-react';
import { Button } from './ui/button';
import { APP_NAME, DOWNLOAD_HASH, GITHUB_URL, HOME_HASH } from '../lib/site';
import logo from '../assets/hero/logo.svg';

const NAV_ITEMS = [
  { label: 'Home', href: HOME_HASH },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact us', href: '#contact' },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Hysteresis: go compact past 24px, expand again only under 12px (no flicker).
const COMPACT_AT = 24;
const EXPAND_AT = 12;

// Padding/bg/border live on the inner bar; the logo/brand/links scale via
// variant propagation (all transform/padding — no width/height layout thrash).
const barVariants: Variants = {
  expanded: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderBottomColor: 'rgba(51, 51, 51, 0)',
    backdropFilter: 'blur(0px)',
  },
  compact: {
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomColor: 'rgba(51, 51, 51, 0.6)',
    backdropFilter: 'blur(12px)',
  },
};

const logoVariants: Variants = {
  expanded: { scale: 1 },
  compact: { scale: 24 / 28 },
};

const brandVariants: Variants = {
  expanded: { scale: 1 },
  compact: { scale: 0.9 },
};

const linkVariants: Variants = {
  expanded: { paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12 },
  compact: { paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10 },
};

export default function Header() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(
    () => (typeof window !== 'undefined' ? window.scrollY : 0) > COMPACT_AT,
  );

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled((prev) => {
      if (!prev && latest > COMPACT_AT) return true;
      if (prev && latest < EXPAND_AT) return false;
      return prev;
    });
  });

  const stateTransition = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 260, damping: 30 };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
    >
      <motion.div
        className="flex items-center justify-between border-b border-transparent px-8 py-4 md:px-28"
        variants={barVariants}
        animate={scrolled ? 'compact' : 'expanded'}
        transition={stateTransition}
      >
        <div className="flex items-center gap-12 md:gap-20">
          <a href={HOME_HASH} className="flex items-center gap-2">
            <motion.img
              src={logo}
              alt={`${APP_NAME} logo`}
              variants={logoVariants}
              className="h-7 w-7"
            />
            <motion.span
              variants={brandVariants}
              className="origin-left text-xl font-bold tracking-tight"
            >
              {APP_NAME}
            </motion.span>
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                variants={linkVariants}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {item.label}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </a>
          <Button
            asChild
            className="h-auto rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:bg-foreground hover:opacity-90"
          >
            <a href={DOWNLOAD_HASH}>Download</a>
          </Button>
        </div>
      </motion.div>
    </motion.header>
  );
}
