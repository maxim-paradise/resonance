import {useScroll, useSpring} from 'motion/react';
import {useEffect, useRef} from 'react';
import {BRAND_ASSETS} from '@/src/data/resonance';

interface SandParticle {
  ox: number;
  oy: number;
  brightness: number;
  size: number;
  threshold: number;
  windX: number;
  windY: number;
  curlPhase: number;
  curlAmp: number;
}

function pseudoHash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

export function SandLogoTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.4,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      progressRef.current = latest;
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let particles: SandParticle[] = [];
    let logoImg: HTMLImageElement | null = null;
    let logoAspect = 256 / 178;
    let width = 0;
    let height = 0;
    let rafId = 0;
    let isDisposed = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const sampleLogoParticles = (img: HTMLImageElement) => {
      const sampleW = 140;
      const sampleH = Math.round((img.height / img.width) * sampleW) || 97;
      logoAspect = img.width / Math.max(1, img.height);

      const off = document.createElement('canvas');
      off.width = sampleW;
      off.height = sampleH;
      const octx = off.getContext('2d');
      if (!octx) return;

      octx.clearRect(0, 0, sampleW, sampleH);
      octx.drawImage(img, 0, 0, sampleW, sampleH);
      const {data} = octx.getImageData(0, 0, sampleW, sampleH);

      const next: SandParticle[] = [];
      for (let y = 0; y < sampleH; y += 2) {
        for (let x = 0; x < sampleW; x += 2) {
          const idx = (y * sampleW + x) * 4;
          const alpha = data[idx + 3];
          if (alpha < 40) continue;

          const n1 = pseudoHash(x * 19 + y * 57);
          const n2 = pseudoHash(x * 41 + y * 13);
          const n3 = pseudoHash(x * 7 + y * 89);

          // Add subtle organic sub-cell jitter so grains never form a rigid grid
          const jitterX = (n2 - 0.5) * (1.8 / sampleW);
          const jitterY = (n3 - 0.5) * (1.8 / sampleH);
          const nx = x / sampleW - 0.5 + jitterX;
          const ny = y / sampleH - 0.5 + jitterY;

          // Erode smoothly from right & bottom edges inward
          const edgeBias = (ny + 0.5) * 0.44 + (nx + 0.5) * 0.28;
          const threshold = Math.min(0.84, Math.max(0.02, edgeBias * 0.68 + n1 * 0.34));

          const lum = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;

          next.push({
            ox: nx,
            oy: ny,
            brightness: Math.max(0.6, lum),
            size: 1.5 + n2 * 1.4,
            threshold,
            windX: 0.28 + n2 * 1.15,
            windY: 0.42 + n3 * 0.95,
            curlPhase: n1 * Math.PI * 2,
            curlAmp: 14 + n3 * 36,
          });
        }
      }
      particles = next;
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!isDisposed) {
        logoImg = img;
        sampleLogoParticles(img);
      }
    };
    img.src = BRAND_ASSETS.rsMark;

    resize();
    window.addEventListener('resize', resize);

    const drawFrame = (now: number) => {
      if (isDisposed) return;
      const t = prefersReducedMotion ? 0 : now * 0.001;
      const p = prefersReducedMotion ? 0.28 : Math.min(1, Math.max(0, progressRef.current));

      ctx.clearRect(0, 0, width, height);

      // Phase timings:
      // 0.00 -> 0.42: camera zooms smoothly toward crisp RS logo
      // 0.34 -> 0.88: logo crossfades into fine sand grains and blows across the dunes
      const zoomNorm = Math.min(1, p / 0.45);
      const easeZoom = 1 - Math.pow(1 - zoomNorm, 3);
      const decayPhase = Math.max(0, Math.min(1, (p - 0.34) / 0.52));

      const cx = width * 0.5;
      const cy = height * (0.45 - easeZoom * 0.03 + decayPhase * 0.05);

      // 1. Soft atmospheric radial glow behind the logo & dune crest (no hard lines)
      const glowAlpha = Math.max(0.08, (0.34 + easeZoom * 0.42) * (1 - decayPhase * 0.78));
      const haloRadius = Math.min(width, height) * (0.32 + easeZoom * 0.16);
      const haloGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, haloRadius);
      haloGrad.addColorStop(0, `rgba(226, 206, 188, ${glowAlpha * 0.32})`);
      haloGrad.addColorStop(0.4, `rgba(22, 186, 152, ${glowAlpha * 0.18})`);
      haloGrad.addColorStop(1, 'rgba(11, 14, 17, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Sculpted ribbed sand-dune waves flowing across the lower half
      const ridgeCount = 26;
      const baseHorizon = height * (0.56 - easeZoom * 0.05 + decayPhase * 0.08);
      for (let r = 0; r < ridgeCount; r++) {
        const depth = r / (ridgeCount - 1);
        const ridgeY = baseHorizon + Math.pow(depth, 1.35) * (height - baseHorizon + 30);
        const ridgeAmp = (10 + depth * 28) * (1 + easeZoom * 0.25);
        const waveSpeed = t * (0.55 + depth * 0.45);
        const phaseOffset = r * 0.42 + p * 4.2;

        const alpha = (0.08 + depth * 0.34) * (1 - decayPhase * 0.25);
        const isTealAccent = r % 5 === 2;
        ctx.strokeStyle = isTealAccent
          ? `rgba(140, 232, 214, ${alpha * 0.62})`
          : `rgba(226, 206, 188, ${alpha})`;
        ctx.lineWidth = 0.75 + depth * 0.85;

        ctx.beginPath();
        const step = Math.max(18, width / 48);
        for (let x = -step; x <= width + step; x += step) {
          const nx = x / width;
          const primaryWave = Math.sin(nx * 5.2 + waveSpeed * 0.6 + phaseOffset) * ridgeAmp;
          const secondaryWave =
            Math.cos(nx * 11.4 - waveSpeed * 0.45 + r * 0.28) * (ridgeAmp * 0.34);
          const crestLift = Math.exp(-Math.pow((nx - 0.5) * 3.1, 2)) * (-18 * (1 - depth * 0.4));
          const y = ridgeY + primaryWave + secondaryWave + crestLift;
          if (x <= 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      const baseLogoW = Math.min(width * 0.26, 210);
      const zoomedW = baseLogoW * (0.85 + easeZoom * 0.85);
      const zoomedH = zoomedW / logoAspect;

      // 3a. Crisp solid RS emblem during zoom, fading cleanly as sand erosion begins
      const solidAlpha = Math.max(0, 1 - Math.pow(decayPhase / 0.34, 1.4));
      if (logoImg && solidAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = solidAlpha;
        ctx.drawImage(logoImg, cx - zoomedW * 0.5, cy - zoomedH * 0.5, zoomedW, zoomedH);
        ctx.restore();
      }

      // 3b. Fine sand grains emerging as the solid logo decays and blowing across the waves
      if (particles.length > 0 && decayPhase > 0.02) {
        const grainPresence = Math.min(1, decayPhase / 0.24);
        const spreadX = width * 0.52;
        const spreadY = height * 0.46;

        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          const localDecay = Math.max(0, Math.min(1, (decayPhase - pt.threshold * 0.68) / 0.46));
          const easeDecay = localDecay * localDecay * (3 - 2 * localDecay);

          let px = cx + pt.ox * zoomedW;
          let py = cy + pt.oy * zoomedH;

          if (easeDecay > 0) {
            const curl =
              Math.sin(easeDecay * Math.PI * 2.4 + pt.curlPhase + t * 0.7) * pt.curlAmp * easeDecay;
            px += pt.windX * spreadX * Math.pow(easeDecay, 1.15) + curl;
            py +=
              pt.windY * spreadY * Math.pow(easeDecay, 1.35) -
              Math.sin(easeDecay * Math.PI) * 26 * pt.brightness;
          }

          const particleAlpha =
            Math.max(0, (1 - Math.pow(easeDecay, 1.65)) * pt.brightness) * grainPresence;
          if (particleAlpha <= 0.02) continue;

          // Transition from cool silver-cyan (#E8F5F6) to warm sand gold (#DEC3AD)
          const rCol = Math.round(232 + (222 - 232) * easeDecay);
          const gCol = Math.round(244 + (195 - 244) * easeDecay);
          const bCol = Math.round(246 + (173 - 246) * easeDecay);

          const radius = pt.size * (0.55 + easeZoom * 0.18 - easeDecay * 0.22);
          ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${particleAlpha})`;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.6, radius), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    rafId = window.requestAnimationFrame(drawFrame);

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', resize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="relative h-[160vh] w-full select-none"
    >
      <div className="sticky top-12 flex h-[78vh] w-full items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </section>
  );
}
