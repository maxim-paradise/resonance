export const REPO_URL = 'https://github.com/BohdanKrakoviatskyi/Resonance'
export const RELEASES_URL = `${REPO_URL}/releases/latest`

/** the version of the app these screenshots were taken from */
export const APP_VERSION = 'v0.14.35'

export type OS = 'windows' | 'macos' | 'linux'

export const DOWNLOADS: Record<
  OS,
  { name: string; icon: string; invert: boolean; primary: string; also: { label: string; href: string }[] }
> = {
  windows: {
    name: 'Windows',
    icon: '/icons/windows.svg',
    invert: false,
    primary: '/api/download?platform=windows-exe',
    also: [{ label: '.msi', href: '/api/download?platform=windows-msi' }],
  },
  macos: {
    name: 'macOS',
    icon: '/icons/apple.svg',
    invert: true,
    primary: '/api/download?platform=macos-arm64',
    also: [{ label: 'Intel .dmg', href: '/api/download?platform=macos-x64' }],
  },
  linux: {
    name: 'Linux',
    icon: '/icons/linux-tux.svg',
    invert: false,
    primary: '/api/download?platform=linux-appimage',
    also: [
      { label: '.deb', href: '/api/download?platform=linux-deb' },
      { label: '.rpm', href: '/api/download?platform=linux-rpm' },
    ],
  },
}
