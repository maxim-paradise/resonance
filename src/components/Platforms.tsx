import { ArrowUpRight } from 'lucide-react';
import { APP_NAME, DOWNLOAD_HASH, GITHUB_RELEASES_URL } from '../lib/site';

const BUILDS = [
  { tag: '[ WINDOWS ]', title: 'Windows', detail: 'Setup .exe · MSI package' },
  { tag: '[ MACOS ]', title: 'macOS', detail: 'Apple Silicon .dmg' },
  { tag: '[ LINUX ]', title: 'Linux', detail: 'x86_64 .AppImage' },
];

export default function Platforms() {
  return (
    <section id="platforms" className="relative w-full bg-black font-manrope">
      <div className="px-5 md:px-[35px] py-20 md:py-[120px] max-w-[1200px] mx-auto text-center">
        <p className="text-[#AFDDFF] text-[13px] leading-[15.6px] mb-4">PLATFORMS</p>
        <h2 className="font-graphik font-normal text-white leading-[1em] text-[34px] md:text-[56px] max-w-[640px] mx-auto mb-4">
          One App. Three Desktops.
        </h2>
        <p className="text-white/60 text-[14px] md:text-[15px] leading-[22px] max-w-[560px] mx-auto mb-10">
          {APP_NAME} ships native builds for Windows, macOS and Linux. Every file comes straight from the
          latest GitHub release.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10 text-left">
          {BUILDS.map((b) => (
            <a
              key={b.tag}
              href={DOWNLOAD_HASH}
              className="group border border-white/15 p-6 hover:border-[#AFDDFF] transition-colors text-left"
            >
              <p className="text-[#AFDDFF] text-[13px] leading-[15.6px] mb-3">{b.tag}</p>
              <h3 className="font-graphik font-normal text-white text-[24px] leading-[1.1] mb-1">{b.title}</h3>
              <p className="text-white/50 text-[12px] leading-[18px] mb-6">{b.detail}</p>
              <span className="inline-flex items-center gap-[6px] text-white text-[13px] leading-[15.6px] uppercase tracking-wide group-hover:text-[#AFDDFF] transition-colors">
                Get build
                <ArrowUpRight className="w-[14px] h-[14px]" strokeWidth={1.5} />
              </span>
            </a>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          <a
            href={DOWNLOAD_HASH}
            className="text-[#AFDDFF] text-[13px] leading-[15.6px] uppercase tracking-wide hover:underline"
          >
            System requirements
          </a>
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noreferrer"
            className="text-white/60 text-[13px] leading-[15.6px] uppercase tracking-wide hover:text-[#AFDDFF] transition-colors"
          >
            All releases on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
