import {MotionConfig, motion} from 'motion/react';
import {useEffect, useState} from 'react';
import {ArchitectureSection} from '@/src/components/ArchitectureSection';
import {DownloadSection} from '@/src/components/DownloadSection';
import {FeaturesSection} from '@/src/components/FeaturesSection';
import {MaterialIcon} from '@/src/components/MaterialIcon';
import {Navbar} from '@/src/components/Navbar';
import {SandLogoTransition} from '@/src/components/SandLogoTransition';
import {
  BRAND_ASSETS,
  RELEASES_URL,
  REPO_URL,
  detectClientPlatform,
  type PlatformKey,
} from '@/src/data/resonance';

const EXPRESSIVE_SPRING = {type: 'spring' as const, stiffness: 460, damping: 34, mass: 0.85};

const PLATFORM_NAMES = {
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
} as const;

export default function App() {
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformKey>('macos');

  useEffect(() => {
    setDetectedPlatform(detectClientPlatform());
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="relative isolate min-h-screen text-[#F4F6F7]">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0b0e11]"
        >
          <div className="ambient-gradient-base absolute inset-0" />
          <div className="ambient-gradient-cyan absolute -inset-[26%]" />
          <div className="ambient-gradient-teal absolute -inset-[26%]" />
          <div className="ambient-gradient-slate absolute -inset-[26%]" />
          <div className="ambient-gradient-trough absolute -inset-[26%]" />
        </div>

        <Navbar />

        <main className="relative z-10">
          {/* 1. Open Hero: App Name Title + Short Description */}
          <section aria-labelledby="hero-heading" className="pb-6 pt-20 sm:pb-10 sm:pt-28">
            <div className="mx-auto max-w-6xl px-6">
              <div className="max-w-3xl">
                <span className="font-mono text-sm font-medium tabular-nums text-[#8CE8D6]">
                  v0.17.1
                </span>

                <h1
                  id="hero-heading"
                  className="mt-4 text-balance text-5xl font-extrabold tracking-[-0.035em] text-[#F4F6F7] sm:text-6xl lg:text-[4.5rem] lg:leading-[1.02]"
                >
                  Resonance
                </h1>

                <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-[#C7D0D4] sm:text-xl">
                  A fast, native music player for YouTube Music, SoundCloud, and your own files.
                  Built on Tauri 2 and Rust with synced lyrics, parametric EQ, and no middleman
                  server.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <motion.a
                    href="#download"
                    whileHover={{scale: 1.025}}
                    whileTap={{scale: 0.95}}
                    transition={EXPRESSIVE_SPRING}
                    className="m3-expressive-btn inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2.5 whitespace-nowrap bg-[#BCEBF0] px-6 py-3 text-sm font-semibold text-[#05292E] shadow-sm hover:bg-[#D5F4F7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8CE8D6]"
                  >
                    <MaterialIcon name="download" size={20} weight={500} />
                    <span>Download for {PLATFORM_NAMES[detectedPlatform]}</span>
                  </motion.a>

                  <motion.a
                    href={REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.96}}
                    transition={EXPRESSIVE_SPRING}
                    className="m3-expressive-btn inline-flex min-h-[48px] shrink-0 items-center gap-2 whitespace-nowrap border border-white/[0.16] bg-white/[0.08] px-6 py-3 text-sm font-medium text-[#F4F6F7] hover:bg-white/[0.16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8CE8D6]"
                  >
                    <span>View Source on GitHub</span>
                    <MaterialIcon name="arrow_outward" size={18} weight={500} />
                  </motion.a>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Procedural Wave + Logo Zoom & Sand Decay Transition */}
          <SandLogoTransition />

          {/* 3. Open Step-by-Step Features with Screenshots */}
          <FeaturesSection />

          {/* 4. Open Architecture Summary */}
          <ArchitectureSection />

          {/* 5. Open Auto-Detected Downloads */}
          <DownloadSection />
        </main>

        <footer className="relative z-10 border-t border-white/[0.08] bg-[#0b0e11]/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img
                src={BRAND_ASSETS.appIcon}
                alt="Resonance application icon"
                width={256}
                height={256}
                loading="lazy"
                decoding="async"
                className="h-8 w-8 rounded-xl border border-white/[0.14] bg-white/[0.08] object-contain p-1"
              />
              <div className="text-sm text-[#C7D0D4]">
                <span className="font-semibold text-[#F4F6F7]">Resonance</span>
                <span className="mx-2 text-white/25" aria-hidden="true">
                  ·
                </span>
                <span>
                  by{' '}
                  <a
                    href="https://github.com/BohdanKrakoviatskyi"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#F4F6F7] underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#8CE8D6] hover:decoration-[#8CE8D6]"
                  >
                    Bohdan Krakoviatskyi
                  </a>
                  ,{' '}
                  <a
                    href="https://github.com/ifritov-dev"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#F4F6F7] underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#8CE8D6] hover:decoration-[#8CE8D6]"
                  >
                    Daniel (ifritov-dev)
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://github.com/maxim-paradise"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#F4F6F7] underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#8CE8D6] hover:decoration-[#8CE8D6]"
                  >
                    Maxim Paradise
                  </a>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-[#C7D0D4]">
              <motion.a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                whileHover={{y: -1}}
                whileTap={{scale: 0.96}}
                transition={EXPRESSIVE_SPRING}
                className="rounded-full px-3.5 py-1.5 transition-colors hover:bg-white/[0.10] hover:text-white"
              >
                GitHub
              </motion.a>
              <motion.a
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                whileHover={{y: -1}}
                whileTap={{scale: 0.96}}
                transition={EXPRESSIVE_SPRING}
                className="rounded-full px-3.5 py-1.5 transition-colors hover:bg-white/[0.10] hover:text-white"
              >
                Releases
              </motion.a>
              <motion.a
                href={`${REPO_URL}/issues`}
                target="_blank"
                rel="noreferrer"
                whileHover={{y: -1}}
                whileTap={{scale: 0.96}}
                transition={EXPRESSIVE_SPRING}
                className="rounded-full px-3.5 py-1.5 transition-colors hover:bg-white/[0.10] hover:text-white"
              >
                Issues
              </motion.a>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
