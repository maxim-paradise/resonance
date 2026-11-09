import { Download as DownloadIcon, Laptop, Monitor, Terminal } from 'lucide-react'
import { GlassCard, RELEASES_URL, REPO_URL, SectionHeading } from './primitives'

const platforms = [
  {
    icon: Monitor,
    name: 'Windows',
    detail: 'Windows 10 / 11, 64-bit',
    format: '.zip',
  },
  {
    icon: Laptop,
    name: 'macOS',
    detail: 'macOS 13 or newer, Apple Silicon and Intel',
    format: '.dmg',
  },
  {
    icon: Terminal,
    name: 'Linux',
    detail: 'Wayland or X11, PipeWire or PulseAudio',
    format: '.AppImage',
  },
]

export function Download() {
  return (
    <section id="download" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 h-80 -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,oklch(0.5_0.08_45/30%),transparent_70%)] blur-2xl"
      />
      <SectionHeading
        badge="Download"
        title="Get Resonance"
        description="Free and open source. Pick your platform and start listening."
      />

      <ul className="mt-14 grid gap-4 md:grid-cols-3">
        {platforms.map(({ icon: Icon, name, detail, format }) => (
          <li key={name}>
            <GlassCard className="flex h-full flex-col p-6">
              <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">{name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
              <a
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
              >
                <DownloadIcon className="size-4" aria-hidden="true" />
                Download
                <span className="font-mono text-xs text-black/50">{format}</span>
              </a>
            </GlassCard>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Prefer to build it yourself?{' '}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="text-foreground underline underline-offset-4 hover:text-primary"
        >
          Browse the source on GitHub
        </a>
        .
      </p>
    </section>
  )
}
