import { useEffect, useState, type ReactNode } from 'react';
import youtubeMusicLogo from '../assets/logos/youtube-music-white.svg';
import soundcloudLogo from '../assets/logos/soundcloud-white.svg';
import windowsLogo from '../assets/logos/windows-white.svg';
import appleLogo from '../assets/logos/apple-white.svg';
import linuxLogo from '../assets/logos/linux-white.svg';

/**
 * Logo files (white monochrome, official brand assets).
 * Drop the real files here — same names — to replace the neutral placeholders:
 *   src/assets/logos/youtube-music-white.svg
 *   src/assets/logos/soundcloud-white.svg
 *   src/assets/logos/windows-white.svg
 *   src/assets/logos/apple-white.svg
 *   src/assets/logos/linux-white.svg
 */

function Corners() {
  return (
    <>
      <span aria-hidden="true" className="node-corner node-corner--tl" />
      <span aria-hidden="true" className="node-corner node-corner--tr" />
      <span aria-hidden="true" className="node-corner node-corner--bl" />
      <span aria-hidden="true" className="node-corner node-corner--br" />
    </>
  );
}

function NodeFrame({
  top,
  left,
  delay,
  children,
}: {
  top: string;
  left: string;
  delay: string;
  children: ReactNode;
}) {
  return (
    <div
      className="node-frame absolute w-[120px] h-[120px] lg:w-[140px] lg:h-[140px] anim-scale-in"
      style={{ top, left, animationDelay: delay }}
    >
      <Corners />
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-[6px] px-[10px] py-[8px]">
        {children}
      </div>
    </div>
  );
}

export function YouTubeMusicNode() {
  return (
    <NodeFrame top="27%" left="60%" delay="1500ms">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgb(255 255 255 / 0.07), transparent 70%)' }}
      />
      <img
        src={youtubeMusicLogo}
        alt="YouTube Music logo"
        className="relative h-[28px] lg:h-[34px] w-auto max-w-[84%] object-contain"
      />
      <div aria-hidden="true" className="relative w-[72%] h-px bg-white/25">
        <span
          className="absolute top-1/2 -translate-y-1/2 w-[5px] h-[3px] rounded-full"
          style={{ left: '62%', background: 'var(--accent)' }}
        />
      </div>
      <span className="node-caption">02:14 / 03:45</span>
      <span className="node-caption">QUEUE · 12</span>
    </NodeFrame>
  );
}

const WAVE_BARS = [10, 16, 22, 14, 26, 18, 24, 12, 28, 20, 15, 25, 17, 23, 13, 19, 11, 21];
const WAVE_PEAK = 8;

export function SoundCloudNode() {
  return (
    <NodeFrame top="58%" left="32%" delay="1800ms">
      <img
        src={soundcloudLogo}
        alt="SoundCloud logo"
        className="relative h-[20px] lg:h-[24px] w-auto max-w-[80%] object-contain"
      />
      <div aria-hidden="true" className="relative flex items-end gap-[2px] h-[30px]">
        {WAVE_BARS.map((h, i) => (
          <span
            key={i}
            className="node-wave-bar w-[2px] shrink-0"
            style={{
              height: `${h}px`,
              background: i === WAVE_PEAK ? 'var(--accent)' : 'rgb(255 255 255 / 0.7)',
              animationDelay: `${i * 180}ms`,
              animationDuration: `${2.6 + (i % 5) * 0.3}s`,
            }}
          />
        ))}
      </div>
    </NodeFrame>
  );
}

const OS_ICONS = [
  { src: windowsLogo, alt: 'Windows logo' },
  { src: appleLogo, alt: 'macOS (Apple) logo' },
  { src: linuxLogo, alt: 'Linux (Tux) logo' },
];

export function CrossPlatformNode() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % OS_ICONS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <NodeFrame top="63%" left="50%" delay="2100ms">
      <div className="relative flex items-center gap-[10px]" role="list" aria-label="Supported operating systems: Windows, macOS, Linux">
        {OS_ICONS.map((os, i) => (
          <span key={os.alt} role="listitem" className="flex flex-col items-center gap-[4px]">
            <img
              src={os.src}
              alt={os.alt}
              className="node-os-icon h-[18px] lg:h-[22px] w-auto object-contain"
              style={
                i === active
                  ? { opacity: 1, filter: 'drop-shadow(0 0 6px var(--accent))' }
                  : { opacity: 0.4 }
              }
            />
            <span
              aria-hidden="true"
              className="w-[4px] h-[4px] rounded-full"
              style={{ background: i === active ? 'var(--accent)' : 'rgb(255 255 255 / 0.2)' }}
            />
          </span>
        ))}
      </div>
      <span className="node-caption">ONE_APP · 3 OS</span>
    </NodeFrame>
  );
}
