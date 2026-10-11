import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { APP_NAME } from '../lib/site';
import SiteFooter from './SiteFooter';
import {
  DOWNLOAD_HASH,
  GITHUB_RELEASES_URL,
  HOME_HASH,
  detectOS,
  fetchLatestRelease,
  formatDate,
  formatSize,
  pickAssets,
  readCachedRelease,
  type DesktopOS,
  type ReleaseAsset,
  type ReleaseInfo,
} from '../lib/site';

const OS_META: Record<DesktopOS, { title: string; hint: string; requirement: string }> = {
  windows: {
    title: 'Windows',
    hint: 'Windows 10 64-bit and later',
    requirement: 'Windows 10 64-bit or later — installs with the x64 setup (.exe) or MSI package.',
  },
  macos: {
    title: 'macOS',
    hint: 'macOS 12 and later · Apple Silicon',
    requirement: 'macOS 12 or later on Apple Silicon — ships as a .dmg disk image.',
  },
  linux: {
    title: 'Linux',
    hint: 'x86_64 · no install needed',
    requirement: 'Any modern x86_64 distro — runs as a single-file .AppImage, no install.',
  },
};

const OS_ORDER: DesktopOS[] = ['windows', 'macos', 'linux'];

function AssetButton({
  asset,
  label,
  primary,
}: {
  asset: ReleaseAsset;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={asset.url}
      download={asset.name}
      className={
        primary
          ? 'bg-[#AFDDFF] px-[20px] py-[12px] flex items-center gap-[10px] hover:bg-[#c8e8ff] transition-colors'
          : 'border border-white/20 px-[16px] py-[10px] flex items-center gap-[10px] hover:border-[#AFDDFF] transition-colors'
      }
    >
      <Download className={`w-[16px] h-[16px] ${primary ? 'text-black' : 'text-[#AFDDFF]'}`} strokeWidth={1.5} />
      <span
        className={`font-manrope text-[13px] leading-[15.6px] uppercase tracking-wide ${
          primary ? 'text-black' : 'text-white'
        }`}
      >
        {label}
      </span>
      {asset.size > 0 && (
        <span className={`font-manrope text-[12px] leading-[15.6px] ${primary ? 'text-black/70' : 'text-white/50'}`}>
          {formatSize(asset.size)}
        </span>
      )}
    </a>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="h-[22px] w-[220px] bg-white/10 mb-6" />
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border border-white/10 p-6">
            <div className="h-[16px] w-[120px] bg-white/10 mb-4" />
            <div className="h-[12px] w-full bg-white/10 mb-2" />
            <div className="h-[40px] w-full bg-white/10 mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'fade-up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'fade-up' | 'fade-in' | 'left' | 'right' | 'scale';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const anim =
    variant === 'scale'
      ? 'anim-scale-in'
      : variant === 'left'
        ? 'anim-slide-left'
        : variant === 'right'
          ? 'anim-slide-right'
          : variant === 'fade-in'
            ? 'anim-fade-in'
            : 'anim-fade-up';

  return (
    <div
      ref={ref}
      className={`${visible ? anim : 'opacity-0'} ${className}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export default function DownloadPage() {
  const [release, setRelease] = useState<ReleaseInfo | null>(() => readCachedRelease());
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    document.title = `Download — ${APP_NAME}`;
    return () => {
      document.title = `Stop Switching Between Music Tabs — ${APP_NAME}`;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetchLatestRelease(controller.signal)
      .then((info) => {
        setRelease(info);
        setFailed(false);
      })
      .catch(() => {
        setFailed((prev) => prev || readCachedRelease() === null);
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [retry]);

  const picks = release ? pickAssets(release) : null;
  const os = detectOS();
  const recommended = os && picks ? picks[os].primary : undefined;

  return (
    <div className="min-h-screen bg-black text-white font-manrope">
      <header className="flex items-center px-5 md:px-[35px] py-5 md:py-[27px] anim-fade-in">
        <a
          href={HOME_HASH}
          className="font-graphik text-white text-[18px] md:text-[21px] leading-[21px] whitespace-nowrap"
        >
          RESONANCE PLAYER
        </a>
        <a
          href={GITHUB_RELEASES_URL}
          target="_blank"
          rel="noreferrer"
          className="ml-auto font-manrope text-white/60 text-[13px] leading-[15.6px] hover:text-[#AFDDFF] transition-colors flex items-center gap-[6px]"
        >
          All releases
          <ExternalLink className="w-[13px] h-[13px]" strokeWidth={1.5} />
        </a>
      </header>

      <main className="w-full max-w-[920px] mx-auto px-5 pb-24 pt-10 md:pt-14">
        <a
          href={HOME_HASH}
          className="inline-flex items-center gap-[8px] font-manrope text-white/60 text-[13px] leading-[15.6px] hover:text-[#AFDDFF] transition-colors mb-8 anim-fade-up"
          style={{ animationDelay: '100ms' }}
        >
          <ArrowLeft className="w-[14px] h-[14px]" strokeWidth={1.5} />
          Back to home
        </a>

        <h1 className="font-graphik font-normal text-white leading-[1em] text-[38px] md:text-[64px] mb-4 anim-fade-up" style={{ animationDelay: '150ms' }}>
          Download for Desktop
        </h1>
        <p className="font-manrope text-white/60 text-[14px] md:text-[15px] leading-[22px] max-w-[560px] mb-3 anim-fade-up" style={{ animationDelay: '250ms' }}>
          {APP_NAME} brings YouTube Music and SoundCloud into one native app for Windows, macOS and Linux.
          Builds below always come from the latest GitHub release.
        </p>
        {release && (
          <p className="font-manrope text-[#AFDDFF] text-[13px] leading-[15.6px] mb-10 anim-fade-in" style={{ animationDelay: '350ms' }}>
            {release.tag}
            {release.date ? ` · published ${formatDate(release.date)}` : ''}
          </p>
        )}

        {!release && !failed && <Skeleton />}

        {failed && !release && (
          <div className="border border-white/15 p-6 md:p-8 mb-10 anim-scale-in">
            <p className="font-manrope text-white text-[15px] leading-[22px] mb-2">
              Couldn&apos;t reach the GitHub release feed.
            </p>
            <p className="font-manrope text-white/50 text-[13px] leading-[20px] mb-6">
              Check your connection, or grab the build straight from the releases page.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setRetry((n) => n + 1)}
                className="bg-[#AFDDFF] px-[20px] py-[12px] flex items-center gap-[10px] hover:bg-[#c8e8ff] transition-colors"
              >
                <RefreshCw className="w-[15px] h-[15px] text-black" strokeWidth={1.5} />
                <span className="font-manrope text-black text-[13px] leading-[15.6px] uppercase tracking-wide">
                  Try again
                </span>
              </button>
              <a
                href={GITHUB_RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                className="border border-white/20 px-[16px] py-[10px] flex items-center gap-[10px] hover:border-[#AFDDFF] transition-colors"
              >
                <span className="font-manrope text-white text-[13px] leading-[15.6px] uppercase tracking-wide">
                  Open releases
                </span>
              </a>
            </div>
          </div>
        )}

        {picks && (
          <>
            {recommended && os && (
              <Reveal variant="scale">
              <section aria-label="Recommended download" className="border border-[#AFDDFF] p-6 md:p-8 mb-6">
                <p className="font-manrope text-black text-[12px] leading-[15.6px] bg-[#AFDDFF] px-[6px] py-[2px] inline-block mb-4">
                  RECOMMENDED FOR YOUR {OS_META[os].title.toUpperCase()}
                </p>
                <h2 className="font-graphik font-normal text-white text-[24px] md:text-[30px] leading-[1.1] mb-2">
                  {APP_NAME} for {OS_META[os].title}
                </h2>
                <p className="font-manrope text-white/50 text-[13px] leading-[20px] mb-6">
                  {recommended.name}
                  {recommended.size > 0 ? ` · ${formatSize(recommended.size)}` : ''}
                </p>
                <AssetButton asset={recommended} label={`Download ${release?.tag ?? ''}`} primary />
              </section>
              </Reveal>
            )}

            <div className="grid gap-4 md:grid-cols-3 mb-12">
              {OS_ORDER.map((key, i) => {
                const pick = picks[key];
                if (!pick.primary) return null;
                return (
                  <Reveal key={key} delay={i * 100} className="h-full">
                  <section aria-label={`${OS_META[key].title} download`} className="border border-white/15 p-6 flex flex-col h-full">
                    <h2 className="font-graphik font-normal text-white text-[22px] leading-[1.1] mb-1">
                      {OS_META[key].title}
                    </h2>
                    <p className="font-manrope text-white/50 text-[12px] leading-[18px] mb-6">{OS_META[key].hint}</p>
                    <div className="mt-auto flex flex-col gap-3">
                      <AssetButton asset={pick.primary} label="Download" primary={os === key} />
                      {pick.alt && (
                        <a
                          href={pick.alt.url}
                          download={pick.alt.name}
                          className="font-manrope text-[#AFDDFF] text-[12px] leading-[16px] hover:underline break-all"
                        >
                          Alternative: {pick.alt.name}
                          {pick.alt.size > 0 ? ` (${formatSize(pick.alt.size)})` : ''}
                        </a>
                      )}
                    </div>
                  </section>
                  </Reveal>
                );
              })}
            </div>

            <Reveal>
            <section id="requirements" className="border-t border-white/10 pt-10 mb-12 scroll-mt-6">
              <h2 className="font-graphik font-normal text-white text-[26px] md:text-[32px] leading-[1.1] mb-6">
                System requirements
              </h2>
              <div className="flex flex-col gap-4">
                {OS_ORDER.map((key) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <span className="font-manrope text-[#AFDDFF] text-[13px] leading-[15.6px] sm:w-[120px] shrink-0">
                      [ {OS_META[key].title.toUpperCase()} ]
                    </span>
                    <p className="font-manrope text-white/60 text-[13px] leading-[20px]">{OS_META[key].requirement}</p>
                  </div>
                ))}
              </div>
            </section>
            </Reveal>

            <Reveal delay={100}>
            <section aria-label="More builds" className="mb-4">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="font-manrope text-white/80 text-[13px] leading-[15.6px] uppercase tracking-wide">
                  Other files in {release?.tag}
                </h2>
                <a
                  href={release?.url ?? GITHUB_RELEASES_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-manrope text-[#AFDDFF] text-[13px] leading-[15.6px] hover:underline flex items-center gap-[6px]"
                >
                  Release notes
                  <ExternalLink className="w-[13px] h-[13px]" strokeWidth={1.5} />
                </a>
              </div>
              {picks.others.length > 0 ? (
                <ul className="flex flex-col">
                  {picks.others.map((a) => (
                    <li key={a.name} className="border-t border-white/10 last:border-b">
                      <a
                        href={a.url}
                        download={a.name}
                        className="flex items-center justify-between gap-4 py-3 font-manrope text-white/70 text-[13px] leading-[18px] hover:text-[#AFDDFF] transition-colors"
                      >
                        <span className="break-all">{a.name}</span>
                        {a.size > 0 && <span className="shrink-0 text-white/40">{formatSize(a.size)}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-manrope text-white/40 text-[13px] leading-[20px]">
                  No extra files in this release.
                </p>
              )}
            </section>
            </Reveal>
          </>
        )}
      </main>

      <div className="hidden">{DOWNLOAD_HASH}</div>
      <SiteFooter />
    </div>
  );
}
