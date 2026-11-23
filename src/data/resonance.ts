import appIcon from '@/src/assets/repo/app-icon.png';
import featureLyrics from '@/src/assets/repo/feature-lyrics.png';
import featurePlayback from '@/src/assets/repo/feature-playback.png';
import featureSources from '@/src/assets/repo/feature-sources.png';
import rsMark from '@/src/assets/repo/rs-mark.png';
import screenshotLibrary from '@/src/assets/repo/screenshot-1.png';
import screenshotLyrics from '@/src/assets/repo/screenshot-2.png';

export const REPO_URL = 'https://github.com/BohdanKrakoviatskyi/Resonance';
export const RELEASES_URL = `${REPO_URL}/releases`;
export const LATEST_RELEASE_API =
  'https://api.github.com/repos/BohdanKrakoviatskyi/Resonance/releases/latest';

export const BRAND_ASSETS = {
  appIcon,
  rsMark,
};

export type FeatureCategoryId = 'sources' | 'playback' | 'lyrics' | 'customization';

export interface FeatureGroup {
  id: FeatureCategoryId;
  icon: string;
  title: string;
  summary: string;
  screenshot: string;
  fullScreenshot: string;
  screenshotAlt: string;
  items: {
    icon: string;
    name: string;
    detail: string;
  }[];
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'sources',
    icon: 'library_music',
    title: 'Sources & Playlist Import',
    summary: 'YouTube Music, SoundCloud, and local audio folders in one sidebar.',
    screenshot: featureSources,
    fullScreenshot: screenshotLibrary,
    screenshotAlt:
      'Resonance sidebar and Liked songs playlist showing YouTube Music and SoundCloud integration',
    items: [
      {
        icon: 'music_note',
        name: 'YouTube Music & SoundCloud',
        detail: 'Sign in for your likes, playlists, and mixes. Tokens stay in the OS keychain.',
      },
      {
        icon: 'folder_open',
        name: 'Local Audio Folders',
        detail: 'MP3, FLAC, WAV, OGG/Opus, and M4A/AAC with tags and embedded covers.',
      },
      {
        icon: 'sync',
        name: 'Import & Update from Source',
        detail:
          'Import from Spotify, Apple Music, Deezer, or Yandex Music, and pull new tracks later.',
      },
    ],
  },
  {
    id: 'playback',
    icon: 'graphic_eq',
    title: 'Playback & Audio Processing',
    summary: 'Crossfades, LUFS loudness limits, parametric EQ, effects, and offline mode.',
    screenshot: featurePlayback,
    fullScreenshot: screenshotLibrary,
    screenshotAlt:
      'Resonance playback bar with expressive waveform scrubber, queue controls, and track list',
    items: [
      {
        icon: 'waves',
        name: 'Gapless-Feel Crossfade & LUFS',
        detail:
          'Linear, equal-power, and S-curve crossfades with −18/−14/−11 LUFS normalization.',
      },
      {
        icon: 'equalizer',
        name: 'Parametric EQ & Effects',
        detail:
          'Live spectrum EQ, 0.5×–1.5× speed (keep-pitch or vinyl), reverb, Slowed + reverb, and Nightcore.',
      },
      {
        icon: 'offline_pin',
        name: 'Offline Downloads & Sleep Timer',
        detail: 'Save YouTube Music tracks and playlists offline, play local mixes, or fade out.',
      },
    ],
  },
  {
    id: 'lyrics',
    icon: 'lyrics',
    title: 'Synced Lyrics & Karaoke',
    summary: 'Word-by-word highlighting, custom .lrc files, and per-track timing shift.',
    screenshot: featureLyrics,
    fullScreenshot: screenshotLyrics,
    screenshotAlt:
      'Resonance fullscreen playback showing album cover, squiggly scrubber, and synced lyrics',
    items: [
      {
        icon: 'mic',
        name: 'Word-by-Word Karaoke',
        detail: 'Synchronized word-level lyric highlighting when timing data is available.',
      },
      {
        icon: 'subtitles',
        name: 'Custom & Enhanced LRC',
        detail: 'Load your own .lrc files (Enhanced LRC word tags supported) or swap matches.',
      },
      {
        icon: 'schedule',
        name: 'Per-Track Timing Offset',
        detail: 'Shift lyric timing forward or backward for individual tracks.',
      },
    ],
  },
  {
    id: 'customization',
    icon: 'palette',
    title: 'Look, Feel & Integrations',
    summary: 'Cover-art themes, custom CSS, global shortcuts, Discord, and Last.fm.',
    screenshot: screenshotLibrary,
    fullScreenshot: screenshotLibrary,
    screenshotAlt:
      'Full Resonance desktop window showing cover-derived glass colors and lyrics panel',
    items: [
      {
        icon: 'code',
        name: 'Dynamic Themes & Custom CSS',
        detail:
          'Cover-sampled colors, glass and metallic styles, mini player, and CSS editor with snippets.',
      },
      {
        icon: 'keyboard',
        name: 'Global Shortcuts & Languages',
        detail: 'Global mute shortcut, media keys, and English or Russian UI.',
      },
      {
        icon: 'headphones',
        name: 'Discord & Last.fm',
        detail:
          'Automatic Discord Rich Presence with cover art and official Last.fm scrobbling with an offline queue.',
      },
    ],
  },
];

export interface ArchitecturePillar {
  icon: string;
  title: string;
  description: string;
}

export const ARCHITECTURE_PILLARS: ArchitecturePillar[] = [
  {
    icon: 'memory',
    title: 'Native, not Electron',
    description:
      'Built on Tauri 2 with a Rust core, so the installer stays small and memory use stays low. Streaming, caching, and stream resolution run in Rust without bundled yt-dlp or ffmpeg.',
  },
  {
    icon: 'devices',
    title: 'No middleman server',
    description:
      'Everything runs on your machine. There is no Resonance account, no telemetry, and no paid tier.',
  },
  {
    icon: 'key',
    title: 'Your real libraries',
    description:
      'Sign in to YouTube Music and SoundCloud for your own likes, playlists, and mixes. Tokens stay in your OS keychain.',
  },
];

export type PlatformKey = 'macos' | 'windows' | 'linux';

export interface InstallerAsset {
  label: string;
  format: string;
  architecture: string;
  filename: string;
  url: string;
  primary?: boolean;
}

export interface ReleaseData {
  version: string;
  publishedDate: string;
  releaseUrl: string;
  platforms: Record<PlatformKey, InstallerAsset[]>;
}

export const DEFAULT_RELEASE: ReleaseData = {
  version: 'v0.17.1',
  publishedDate: 'Nov 21, 2026',
  releaseUrl: `${RELEASES_URL}/tag/v0.17.1`,
  platforms: {
    macos: [
      {
        label: 'macOS (Apple Silicon)',
        format: '.dmg',
        architecture: 'aarch64',
        filename: 'Resonance_0.17.1_aarch64.dmg',
        url: `${RELEASES_URL}/download/v0.17.1/Resonance_0.17.1_aarch64.dmg`,
        primary: true,
      },
      {
        label: 'macOS App Archive',
        format: '.app.tar.gz',
        architecture: 'aarch64',
        filename: 'Resonance_aarch64.app.tar.gz',
        url: `${RELEASES_URL}/download/v0.17.1/Resonance_aarch64.app.tar.gz`,
      },
    ],
    windows: [
      {
        label: 'Windows Installer',
        format: '.exe',
        architecture: 'x64',
        filename: 'Resonance_0.17.1_x64-setup.exe',
        url: `${RELEASES_URL}/download/v0.17.1/Resonance_0.17.1_x64-setup.exe`,
        primary: true,
      },
      {
        label: 'Windows MSI Package',
        format: '.msi',
        architecture: 'x64',
        filename: 'Resonance_0.17.1_x64_en-US.msi',
        url: `${RELEASES_URL}/download/v0.17.1/Resonance_0.17.1_x64_en-US.msi`,
      },
    ],
    linux: [
      {
        label: 'Universal AppImage',
        format: '.AppImage',
        architecture: 'amd64',
        filename: 'Resonance_0.17.1_amd64.AppImage',
        url: `${RELEASES_URL}/download/v0.17.1/Resonance_0.17.1_amd64.AppImage`,
        primary: true,
      },
      {
        label: 'Debian / Ubuntu',
        format: '.deb',
        architecture: 'amd64',
        filename: 'Resonance_0.17.1_amd64.deb',
        url: `${RELEASES_URL}/download/v0.17.1/Resonance_0.17.1_amd64.deb`,
      },
      {
        label: 'Fedora / RHEL',
        format: '.rpm',
        architecture: 'x86_64',
        filename: 'Resonance-0.17.1-1.x86_64.rpm',
        url: `${RELEASES_URL}/download/v0.17.1/Resonance-0.17.1-1.x86_64.rpm`,
      },
    ],
  },
};

export function detectClientPlatform(): PlatformKey {
  if (typeof navigator === 'undefined') return 'macos';
  const nav = navigator as Navigator & {userAgentData?: {platform?: string}};
  const hint = `${nav.userAgentData?.platform ?? ''} ${navigator.platform ?? ''} ${navigator.userAgent}`.toLowerCase();
  if (hint.includes('win')) return 'windows';
  if (hint.includes('linux') && !hint.includes('android')) return 'linux';
  return 'macos';
}
