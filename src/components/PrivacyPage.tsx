import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { APP_NAME, GITHUB_ISSUES_URL, GITHUB_RELEASES_URL } from '../lib/site';
import SiteFooter from './SiteFooter';

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'Overview',
    body: [
      `${APP_NAME} is a desktop music player for Windows, macOS and Linux that plays content from YouTube Music and SoundCloud in one native app. This policy explains what data is involved when you use the app and this website.`,
    ],
  },
  {
    heading: 'The app',
    body: [
      `${APP_NAME} does not create user accounts and does not run its own servers for your listening. Music streams go directly between your device and YouTube Music or SoundCloud, so their own privacy policies apply to that playback.`,
      'Settings and preferences (such as the services you connect) are stored locally on your device and are not sent to us.',
    ],
  },
  {
    heading: 'This website',
    body: [
      'This landing site does not ask for personal details and has no accounts, forms, or newsletters. To serve pages fast it loads fonts and media from third-party CDNs (Google Fonts, CloudFront), which may receive standard technical data such as your IP address and browser type.',
      'App downloads and version checks are served from GitHub Releases, so downloading a build is subject to GitHub\u2019s privacy statement.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'Questions about this policy can be raised through the project issue tracker on GitHub.',
    ],
  },
  {
    heading: 'Changes',
    body: [
      'This policy may be updated as the app evolves. The latest version is always published on this page.',
    ],
  },
];

export default function PrivacyPage({ root = '' }: { root?: string }) {
  const homeHref = root ? './' : '#/';
  useEffect(() => {
    document.title = `Privacy Policy — ${APP_NAME}`;
    return () => {
      document.title = `Stop Switching Between Music Tabs — ${APP_NAME}`;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-manrope">
      <header className="flex items-center px-5 md:px-[35px] py-5 md:py-[27px]">
        <a
          href={homeHref}
          className="font-graphik text-white text-[18px] md:text-[21px] leading-[21px] whitespace-nowrap"
        >
          RESONANCE // PLAYER
        </a>
      </header>

      <main className="w-full max-w-[760px] mx-auto px-5 pb-24 pt-10 md:pt-14">
        <a
          href={homeHref}
          className="inline-flex items-center gap-[8px] font-manrope text-white/60 text-[13px] leading-[15.6px] hover:text-[#AFDDFF] transition-colors mb-8"
        >
          <ArrowLeft className="w-[14px] h-[14px]" strokeWidth={1.5} />
          Back to home
        </a>

        <p className="text-[#AFDDFF] text-[13px] leading-[15.6px] mb-4">[ LEGAL ]</p>
        <h1 className="font-graphik font-normal text-white leading-[1em] text-[38px] md:text-[64px] mb-4">
          Privacy Policy
        </h1>
        <p className="text-white/50 text-[13px] leading-[20px] mb-12">Last updated: October 2026</p>

        <div className="flex flex-col gap-10">
          {SECTIONS.map((s) => (
            <section key={s.heading} aria-label={s.heading}>
              <h2 className="font-graphik font-normal text-white text-[24px] md:text-[28px] leading-[1.15] mb-3">
                {s.heading}
              </h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-white/60 text-[14px] md:text-[15px] leading-[23px] mb-3">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-12 pt-8 border-t border-white/10">
          <a
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[#AFDDFF] text-[13px] leading-[15.6px] uppercase tracking-wide hover:underline"
          >
            Ask a question
          </a>
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noreferrer"
            className="text-white/60 text-[13px] leading-[15.6px] uppercase tracking-wide hover:text-[#AFDDFF] transition-colors"
          >
            GitHub releases
          </a>
        </div>
      </main>

      <SiteFooter root={root} />
    </div>
  );
}
