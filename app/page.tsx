import { Download } from '@/components/site/download'
import { Features } from '@/components/site/features'
import { Footer } from '@/components/site/footer'
import { Hero } from '@/components/site/hero'
import { LanguageProvider } from '@/components/site/i18n'
import { Lyrics } from '@/components/site/lyrics'
import { Navbar } from '@/components/site/navbar'
import { Rail } from '@/components/site/rail'
import { Setup } from '@/components/site/setup'
import { Sound } from '@/components/site/sound'
import { Themes } from '@/components/site/themes'
import { Tour } from '@/components/site/tour'

export default function Page() {
  return (
    <LanguageProvider>
      <Navbar />
      <main id="main">
        <Hero />
        <Tour />
        <Features />
        <Themes />
        <Sound />
        <Lyrics />
        <Setup />
        <Download />
      </main>
      <Footer />
      <Rail />
    </LanguageProvider>
  )
}
