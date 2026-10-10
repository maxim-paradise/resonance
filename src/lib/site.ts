export const GITHUB_OWNER = 'BohdanKrakoviatskyi';
export const GITHUB_REPO = 'BSC---BetterSoundCloud';
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
export const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
export const GITHUB_LATEST_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

export const DOWNLOAD_HASH = '#/download';
export const HOME_HASH = '#/';

export interface ReleaseAsset {
  name: string;
  size: number;
  url: string;
}

export interface ReleaseInfo {
  tag: string;
  name: string;
  date: string;
  url: string;
  assets: ReleaseAsset[];
}

const CACHE_KEY = 'resonance-latest-release-v1';

export function readCachedRelease(): ReleaseInfo | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReleaseInfo;
  } catch {
    return null;
  }
}

function writeCachedRelease(info: ReleaseInfo) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(info));
  } catch {
    /* storage unavailable — ignore */
  }
}

export async function fetchLatestRelease(signal?: AbortSignal): Promise<ReleaseInfo> {
  const res = await fetch(GITHUB_LATEST_API, {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
  const data = await res.json();
  const assets: ReleaseAsset[] = Array.isArray(data.assets)
    ? data.assets
        .filter((a: { name?: string; browser_download_url?: string }) => a?.name && a?.browser_download_url)
        .map((a: { name: string; size?: number; browser_download_url: string }) => ({
          name: a.name,
          size: typeof a.size === 'number' ? a.size : 0,
          url: a.browser_download_url,
        }))
    : [];
  const info: ReleaseInfo = {
    tag: String(data.tag_name ?? ''),
    name: String(data.name ?? data.tag_name ?? ''),
    date: String(data.published_at ?? data.created_at ?? ''),
    url: String(data.html_url ?? GITHUB_RELEASES_URL),
    assets,
  };
  writeCachedRelease(info);
  return info;
}

export type DesktopOS = 'windows' | 'macos' | 'linux';

export function detectOS(): DesktopOS | null {
  try {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const platform = (nav.userAgentData?.platform ?? navigator.platform ?? '').toLowerCase();
    const ua = navigator.userAgent.toLowerCase();
    if (platform.includes('win') || ua.includes('windows')) return 'windows';
    if (platform.includes('mac') || ua.includes('macintosh') || ua.includes('mac os')) return 'macos';
    if (platform.includes('linux') || ua.includes('linux') || ua.includes('x11')) return 'linux';
  } catch {
    /* ignore */
  }
  return null;
}

export interface OSPick {
  primary?: ReleaseAsset;
  alt?: ReleaseAsset;
}

export function pickAssets(info: ReleaseInfo): Record<DesktopOS, OSPick> & { others: ReleaseAsset[] } {
  const downloadable = info.assets.filter((a) => !a.name.endsWith('.sig') && a.name !== 'latest.json');
  const used = new Set<string>();
  const find = (...suffixes: string[]): ReleaseAsset | undefined => {
    const hit = downloadable.find((a) => !used.has(a.name) && suffixes.some((s) => a.name.endsWith(s)));
    if (hit) used.add(hit.name);
    return hit;
  };
  const windows: OSPick = { primary: find('-setup.exe', '-setup-x64.exe'), alt: find('.msi') };
  if (!windows.primary) windows.primary = find('.exe');
  const macos: OSPick = { primary: find('.dmg'), alt: find('.app.tar.gz') };
  const linux: OSPick = { primary: find('.AppImage'), alt: find('.deb', '.rpm', '.tar.gz') };
  const others = downloadable.filter((a) => !used.has(a.name));
  return { windows, macos, linux, others };
}

export function formatSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}

export const APP_NAME = 'Resonance';

export const FALLBACK_VERSION = 'v2.4.1';

import { useEffect, useState } from 'react';

/** Live release tag: cached value instantly, GitHub refresh in background. */
export function useLatestTag(fallback: string = FALLBACK_VERSION): string {
  const [tag, setTag] = useState<string>(() => readCachedRelease()?.tag || fallback);
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetchLatestRelease(controller.signal)
      .then((info) => {
        if (alive && info.tag) setTag(info.tag);
      })
      .catch(() => {
        /* keep cached/fallback value */
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      alive = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);
  return tag;
}

