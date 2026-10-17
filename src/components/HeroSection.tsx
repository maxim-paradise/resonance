import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Button } from './ui/button';
import { APP_NAME, DOWNLOAD_HASH } from '../lib/site';
import dashboard from '../assets/hero/dashboard.svg';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function fadeUp(y: number, duration: number, delay: number): Variants {
  return {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration, delay, ease: EASE } },
  };
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const dashboardY = useTransform(scrollYProgress, [0, 1], [0, -250]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative h-screen min-h-[680px] w-full overflow-hidden bg-background font-sans text-foreground"
    >
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto mt-16 flex flex-col items-center px-4 pt-16 text-center md:mt-20"
      >
        <motion.div
          variants={fadeUp(10, 0.5, 0)}
          className="liquid-glass mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2"
        >
          <span className="rounded-md bg-foreground px-2 py-0.5 text-sm font-medium text-background">
            New
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            Say hello to {APP_NAME} v2.4
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp(20, 0.6, 0.1)}
          className="mb-3 text-5xl font-medium leading-tight tracking-[-2px] md:text-7xl md:leading-[1.15]"
        >
          All Your Music.
          <br />
          One Native <span className="font-serif font-normal italic">Player</span>.
        </motion.h1>

        <motion.p
          variants={fadeUp(20, 0.6, 0.2)}
          className="hero-subtitle-color mb-8 text-lg font-normal leading-6 opacity-90"
        >
          {APP_NAME} streams SoundCloud and YouTube Music in one native app,
          <br />
          with no browser tabs and no switching — just your library.
        </motion.p>

        <Button
          asChild
          className="h-auto rounded-full bg-foreground px-8 py-3.5 text-base font-medium text-background hover:bg-foreground"
        >
          <motion.a
            href={DOWNLOAD_HASH}
            variants={fadeUp(20, 0.6, 0.3)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started for Free
          </motion.a>
        </Button>
      </motion.div>

      <motion.div
        variants={fadeUp(40, 0.8, 0.4)}
        className="relative mt-16 w-screen"
        style={{ marginLeft: 'calc(-50vw + 50%)', aspectRatio: '16 / 9' }}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
        />
        <motion.img
          src={dashboard}
          alt={`${APP_NAME} dashboard`}
          style={{ y: dashboardY, x: '-50%', mixBlendMode: 'luminosity' }}
          className="absolute left-1/2 top-0 w-[90%] max-w-5xl rounded-2xl"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-40 bg-gradient-to-t from-background to-transparent" />
      </motion.div>
    </section>
  );
}
