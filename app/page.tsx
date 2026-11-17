import { AppWindow } from '@/components/site/app-window'
import { Download } from '@/components/site/download'
import { Footer } from '@/components/site/footer'
import { Hero } from '@/components/site/hero'
import { LanguageProvider } from '@/components/site/i18n'
import { Lyrics } from '@/components/site/lyrics'
import { Navbar } from '@/components/site/navbar'
import { Numbers } from '@/components/site/numbers'
import { Setup } from '@/components/site/setup'
import { Sound } from '@/components/site/sound'

export default function Page() {
  return (
    <LanguageProvider>
      <Navbar />
      <main id="main">
        <Hero />
        <Numbers />
        <AppWindow />
        <Sound />
        <Lyrics />
        <Setup />
        <Download />
      </main>
      <Footer />
    </LanguageProvider>
  )
}
