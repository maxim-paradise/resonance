import {
  ArrowUpRight,
  AudioLines,
  Captions,
  Check,
  Clock,
  CloudDownload,
  Code,
  Copy,
  Cpu,
  Download,
  FolderOpen,
  Headphones,
  KeyRound,
  Keyboard,
  Laptop,
  LibraryBig,
  Maximize2,
  Mic,
  MicVocal,
  Monitor,
  MonitorSmartphone,
  Music,
  Palette,
  RefreshCw,
  SlidersHorizontal,
  Terminal,
  Waves,
  X,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  arrow_outward: ArrowUpRight,
  check: Check,
  close: X,
  code: Code,
  content_copy: Copy,
  desktop_windows: Monitor,
  devices: MonitorSmartphone,
  download: Download,
  equalizer: SlidersHorizontal,
  folder_open: FolderOpen,
  graphic_eq: AudioLines,
  headphones: Headphones,
  key: KeyRound,
  keyboard: Keyboard,
  laptop_mac: Laptop,
  library_music: LibraryBig,
  lyrics: MicVocal,
  memory: Cpu,
  mic: Mic,
  music_note: Music,
  offline_pin: CloudDownload,
  open_in_full: Maximize2,
  palette: Palette,
  schedule: Clock,
  subtitles: Captions,
  sync: RefreshCw,
  terminal: Terminal,
  waves: Waves,
};

interface MaterialIconProps {
  name: string;
  filled?: boolean;
  size?: number;
  weight?: number;
  className?: string;
}

export function MaterialIcon({name, size = 20, className = ''}: MaterialIconProps) {
  const Icon = ICONS[name] ?? Waves;
  return (
    <Icon
      aria-hidden="true"
      focusable="false"
      size={size}
      strokeWidth={1.85}
      className={`shrink-0 ${className}`}
    />
  );
}
