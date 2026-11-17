import { Download } from '@/components/site/download'
import { Features } from '@/components/site/features'
import { Footer } from '@/components/site/footer'
import { Hero } from '@/components/site/hero'
import { LanguageProvider } from '@/components/site/i18n'
import { Lyrics } from '@/components/site/lyrics'
import { Navbar } from '@/components/site/navbar'
import { PlayerBar } from '@/components/site/player-bar'
import { PlaybackProvider } from '@/components/site/playback'
import { Setup } from '@/components/site/setup'
import { Sound } from '@/components/site/sound'
import { Specs } from '@/components/site/specs'
import { Themes } from '@/components/site/themes'
import { Tour } from '@/components/site/tour'

export default function Page() {
  return (
    <LanguageProvider>
      <PlaybackProvider>
        <Navbar />
        <main id="main">
          <Hero />
          <Tour />
          <Features />
          <Themes />
          <Sound />
          <Lyrics />
          <Setup />
          <Specs />
          <Download />
        </main>
        <Footer />
        <PlayerBar />
      </PlaybackProvider>
    </LanguageProvider>
  )
}
