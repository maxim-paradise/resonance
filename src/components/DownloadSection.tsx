import {AnimatePresence, motion} from 'motion/react';
import {useEffect, useState} from 'react';
import {MaterialIcon} from '@/src/components/MaterialIcon';
import {
  DEFAULT_RELEASE,
  LATEST_RELEASE_API,
  RELEASES_URL,
  REPO_URL,
  detectClientPlatform,
  type InstallerAsset,
  type PlatformKey,
  type ReleaseData,
} from '@/src/data/resonance';

interface GitHubAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubReleaseResponse {
  tag_name?: string;
  published_at?: string;
  html_url?: string;
  assets?: GitHubAsset[];
}

const PLATFORM_OPTIONS: {key: PlatformKey; label: string; icon: string}[] = [
  {key: 'macos', label: 'macOS', icon: 'laptop_mac'},
  {key: 'windows', label: 'Windows', icon: 'desktop_windows'},
  {key: 'linux', label: 'Linux', icon: 'terminal'},
];

const BUILD_COMMAND =
  'git clone https://github.com/BohdanKrakoviatskyi/Resonance.git && cd Resonance && npm install && npx tauri build';

const EXPRESSIVE_SPRING = {type: 'spring' as const, stiffness: 460, damping: 34, mass: 0.85};

function parseReleaseAssets(payload: GitHubReleaseResponse): ReleaseData | null {
  if (!payload.tag_name || !Array.isArray(payload.assets) || payload.assets.length === 0) {
    return null;
  }

  const assets = payload.assets.filter((item) => !item.name.endsWith('.sig'));
  const findAsset = (matcher: (name: string) => boolean) =>
    assets.find((item) => matcher(item.name));

  const macDmg = findAsset((n) => n.endsWith('.dmg'));
  const macTar = findAsset((n) => n.endsWith('.app.tar.gz'));
  const winExe = findAsset((n) => n.endsWith('-setup.exe') || n.endsWith('.exe'));
  const winMsi = findAsset((n) => n.endsWith('.msi'));
  const linuxAppImage = findAsset((n) => n.endsWith('.AppImage'));
  const linuxDeb = findAsset((n) => n.endsWith('.deb'));
  const linuxRpm = findAsset((n) => n.endsWith('.rpm'));

  const macos: InstallerAsset[] = [];
  if (macDmg) {
    macos.push({
      label: 'macOS (Apple Silicon)',
      format: '.dmg',
      architecture: 'aarch64',
      filename: macDmg.name,
      url: macDmg.browser_download_url,
      primary: true,
    });
  }
  if (macTar) {
    macos.push({
      label: 'macOS App Archive',
      format: '.app.tar.gz',
      architecture: 'aarch64',
      filename: macTar.name,
      url: macTar.browser_download_url,
    });
  }

  const windows: InstallerAsset[] = [];
  if (winExe) {
    windows.push({
      label: 'Windows Installer',
      format: '.exe',
      architecture: 'x64',
      filename: winExe.name,
      url: winExe.browser_download_url,
      primary: true,
    });
  }
  if (winMsi) {
    windows.push({
      label: 'Windows MSI Package',
      format: '.msi',
      architecture: 'x64',
      filename: winMsi.name,
      url: winMsi.browser_download_url,
    });
  }

  const linux: InstallerAsset[] = [];
  if (linuxAppImage) {
    linux.push({
      label: 'Universal AppImage',
      format: '.AppImage',
      architecture: 'amd64',
      filename: linuxAppImage.name,
      url: linuxAppImage.browser_download_url,
      primary: true,
    });
  }
  if (linuxDeb) {
    linux.push({
      label: 'Debian / Ubuntu',
      format: '.deb',
      architecture: 'amd64',
      filename: linuxDeb.name,
      url: linuxDeb.browser_download_url,
    });
  }
  if (linuxRpm) {
    linux.push({
      label: 'Fedora / RHEL',
      format: '.rpm',
      architecture: 'x86_64',
      filename: linuxRpm.name,
      url: linuxRpm.browser_download_url,
    });
  }

  if (macos.length === 0 && windows.length === 0 && linux.length === 0) {
    return null;
  }

  const formattedDate = payload.published_at
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(payload.published_at))
    : DEFAULT_RELEASE.publishedDate;

  return {
    version: payload.tag_name,
    publishedDate: formattedDate,
    releaseUrl: payload.html_url ?? RELEASES_URL,
    platforms: {
      macos: macos.length > 0 ? macos : DEFAULT_RELEASE.platforms.macos,
      windows: windows.length > 0 ? windows : DEFAULT_RELEASE.platforms.windows,
      linux: linux.length > 0 ? linux : DEFAULT_RELEASE.platforms.linux,
    },
  };
}

export function DownloadSection() {
  const [platform, setPlatform] = useState<PlatformKey>(() => detectClientPlatform());
  const [release, setRelease] = useState<ReleaseData>(DEFAULT_RELEASE);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(LATEST_RELEASE_API, {
      signal: controller.signal,
      headers: {Accept: 'application/vnd.github+json'},
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: GitHubReleaseResponse | null) => {
        if (!data) return;
        const parsed = parseReleaseAssets(data);
        if (parsed) {
          setRelease(parsed);
        }
      })
      .catch(() => {
        // Keep verified default release links if network or rate-limit blocks the live fetch.
      });

    return () => controller.abort();
  }, []);

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(BUILD_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const activeAssets = release.platforms[platform];
  const detectedPlatformLabel =
    PLATFORM_OPTIONS.find((item) => item.key === detectClientPlatform())?.label ?? 'macOS';

  return (
    <section
      id="download"
      aria-labelledby="download-heading"
      className="border-t border-white/[0.08] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-[#8CE8D6]">Download</p>
            <h2
              id="download-heading"
              className="mt-2 text-balance text-3xl font-bold tracking-[-0.025em] text-[#F4F6F7] sm:text-4xl"
            >
              Download for {PLATFORM_OPTIONS.find((item) => item.key === platform)?.label}.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#C7D0D4]">
              GitHub Actions builds installers from the public repository. Your system was detected
              as <span className="font-medium text-[#F4F6F7]">{detectedPlatformLabel}</span>, or you
              can switch platforms on the right.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#C7D0D4]">
              <span className="font-mono font-medium tabular-nums text-[#F4F6F7]">
                {release.version}
              </span>
              <span aria-hidden="true">·</span>
              <span>{release.publishedDate}</span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.10] pb-5">
              <div
                role="tablist"
                aria-label="Select operating system"
                className="inline-flex items-center gap-1 rounded-full border border-white/[0.14] bg-white/[0.04] p-1"
              >
                {PLATFORM_OPTIONS.map((item) => {
                  const isSelected = platform === item.key;
                  return (
                    <motion.button
                      key={item.key}
                      role="tab"
                      type="button"
                      aria-selected={isSelected}
                      onClick={() => setPlatform(item.key)}
                      whileTap={{scale: 0.96}}
                      transition={EXPRESSIVE_SPRING}
                      className={`relative inline-flex min-h-[40px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8CE8D6] ${
                        isSelected ? 'text-[#05292E]' : 'text-[#C7D0D4] hover:text-white'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="download-platform-pill"
                          transition={EXPRESSIVE_SPRING}
                          className="absolute inset-0 rounded-full bg-[#BCEBF0] shadow-xs"
                        />
                      )}
                      <span className="relative z-10 inline-flex items-center gap-2">
                        <MaterialIcon
                          name={item.icon}
                          filled={isSelected}
                          size={18}
                          weight={500}
                        />
                        <span>{item.label}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.a
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                whileHover={{x: 2}}
                whileTap={{scale: 0.97}}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-[#C7D0D4] transition-colors hover:text-white"
              >
                <span>All releases</span>
                <MaterialIcon name="arrow_outward" size={16} weight={500} />
              </motion.a>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={platform}
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -6}}
                transition={{duration: 0.18, ease: [0.2, 0, 0, 1]}}
                className="divide-y divide-white/[0.10]"
              >
                {activeAssets.map((asset) => (
                  <li
                    key={asset.filename}
                    className="flex flex-col gap-3 py-4 first:pt-5 last:pb-1 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                        <span className="text-base font-semibold text-[#F4F6F7]">
                          {asset.label}
                        </span>
                        <span className="font-mono text-xs text-[#AEB8BD]">
                          {asset.architecture}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate font-mono text-xs text-[#AEB8BD]">
                        {asset.filename}
                      </p>
                    </div>

                    <motion.a
                      href={asset.url}
                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.95}}
                      transition={EXPRESSIVE_SPRING}
                      className={`m3-expressive-btn inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 whitespace-nowrap px-5 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8CE8D6] ${
                        asset.primary
                          ? 'bg-[#BCEBF0] text-[#05292E] shadow-xs hover:bg-[#D5F4F7]'
                          : 'border border-white/[0.16] bg-white/[0.08] text-[#F4F6F7] hover:bg-white/[0.16]'
                      }`}
                    >
                      <MaterialIcon name="download" size={18} weight={500} />
                      <span>Download {asset.format}</span>
                    </motion.a>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>

            <div className="mt-6 border-t border-white/[0.10] pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#C7D0D4]">
                  Or build from source (requires Rust &amp; Node.js)
                </span>
                <motion.button
                  type="button"
                  onClick={handleCopyCommand}
                  whileHover={{scale: 1.03}}
                  whileTap={{scale: 0.94}}
                  transition={EXPRESSIVE_SPRING}
                  className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-[#F4F6F7] transition-colors hover:bg-white/[0.10] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8CE8D6]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{opacity: 0, scale: 0.88}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.88}}
                        transition={{duration: 0.14}}
                        className="inline-flex items-center gap-1.5 text-[#8CE8D6]"
                      >
                        <MaterialIcon name="check" size={16} weight={600} />
                        <span>Copied</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{opacity: 0, scale: 0.88}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.88}}
                        transition={{duration: 0.14}}
                        className="inline-flex items-center gap-1.5"
                      >
                        <MaterialIcon name="content_copy" size={15} weight={500} />
                        <span>Copy command</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              <pre className="mt-2 overflow-x-auto rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3 font-mono text-xs leading-relaxed text-[#E9EFF1]">
                <code>{BUILD_COMMAND}</code>
              </pre>
              <p className="mt-3 text-xs text-[#C7D0D4]">
                Source code available on{' '}
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#F4F6F7] underline decoration-white/30 underline-offset-2 hover:text-[#8CE8D6]"
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
