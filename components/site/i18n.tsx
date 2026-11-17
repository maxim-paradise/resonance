'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Locale = 'en' | 'ru'

const STORAGE_KEY = 'resonance-locale'

const en = {
  nav: {
    library: 'Library',
    sound: 'Sound',
    lyrics: 'Lyrics',
    setup: 'Setup',
    download: 'Download',
    github: 'GitHub',
    language: 'Language',
  },
  hero: {
    title: 'Desktop player for SoundCloud and YouTube Music',
    lead: 'Resonance puts your SoundCloud likes and YouTube Music playlists in one native window, with synced lyrics, a 10-band equalizer and crossfade.',
    download: 'Download Resonance',
    source: 'Source on GitHub',
    meta: 'Free and open source for Windows, macOS and Linux',
    nowPlaying: 'Now playing',
    shotAlt:
      'Resonance in the crimson theme: SoundCloud and YouTube Music playlists, synced lyrics and the player bar',
  },
  numbers: {
    title: 'Resonance in numbers',
    lead: 'Two services go in. The player works on both libraries the same way.',
    services: 'services in one library',
    bands: 'equalizer bands',
    installer: 'installer for every system',
    ram: 'of RAM on Windows',
    diagramAlt:
      'SoundCloud and YouTube Music feed into Resonance, which adds lyrics, the equalizer, crossfade, normalization and themes',
    core: 'Resonance',
    outputs: ['Synced lyrics', 'Equalizer', 'Crossfade', 'Normalization', 'Themes'],
  },
  window: {
    title: 'Both libraries in one window',
    lead: 'SoundCloud playlists sit above your YouTube Music library. Lyrics follow the track on the right, and the player bar stays at the foot.',
    themesLabel: 'Theme',
    themes: { crimson: 'Crimson', warm: 'Warm', teal: 'Teal' },
    themeNote: 'The window takes its colours from the cover that is playing, or keeps a palette you pick.',
    alt: {
      crimson: 'Resonance home screen in the crimson theme',
      warm: 'Resonance home screen in the warm theme',
      teal: 'Resonance home screen in the teal theme',
    },
  },
  sound: {
    title: 'Sound you set yourself',
    lead: 'The equalizer, crossfade and loudness work on tracks from both services.',
    eq: {
      title: 'Equalizer',
      desc: 'Ten bands. Start from a preset or drag each band.',
      presets: { flat: 'Flat', bass: 'Bass boost', vocal: 'Vocal', bright: 'Bright' },
    },
    crossfade: {
      title: 'Crossfade',
      desc: 'Blend one track into the next.',
      length: 'Fade length',
      off: 'Off',
      unit: 's',
    },
    norm: {
      title: 'Normalization',
      desc: 'Quiet and loud tracks play at one level. A limiter stops clipping.',
      enabled: 'On',
      disabled: 'Off',
      targets: { quiet: 'Quiet', standard: 'Standard', loud: 'Loud' },
    },
  },
  lyrics: {
    title: 'Lyrics that keep time',
    lead: 'Lines scroll with the track. If the match is wrong, swap the lyrics source in one click.',
    change: 'Change lyrics',
    tabLyrics: 'Lyrics',
    tabNext: 'Up next',
    alt: 'Resonance lyrics panel: the playing track and its synced lines, the current one highlighted',
  },
  setup: {
    title: 'From install to the first track in under a minute',
    steps: [
      { title: 'Install Resonance', desc: 'Installers are under 20 MB for Windows, macOS and Linux.' },
      { title: 'Sign in to both services', desc: 'Connect SoundCloud and YouTube Music inside the app.' },
      { title: 'Press play', desc: 'Playlists and likes from both sit in one sidebar.' },
    ],
  },
  download: {
    title: 'Download Resonance',
    lead: 'Free and open source. Each button fetches the installer from the latest signed GitHub release.',
    windowsDetail: 'Windows 10 and 11, 64-bit',
    macosDetail: 'macOS 13 and later',
    linuxDetail: 'Wayland or X11, PipeWire or PulseAudio',
    windowsPrimary: 'Download .exe',
    macosPrimary: 'Apple Silicon',
    linuxPrimary: 'Download .AppImage',
    also: 'Also',
    macIntel: 'Intel .dmg',
    source: 'Build from source on GitHub',
  },
  footer: {
    description: 'Desktop player for SoundCloud and YouTube Music, built with Tauri and Rust.',
    disclaimer: 'Independent open-source project, not affiliated with SoundCloud or Google.',
    releases: 'Releases',
    product: 'Product',
    project: 'Project',
  },
}

const ru: typeof en = {
  nav: {
    library: 'Медиатека',
    sound: 'Звук',
    lyrics: 'Тексты',
    setup: 'Установка',
    download: 'Скачать',
    github: 'GitHub',
    language: 'Язык',
  },
  hero: {
    title: 'Десктоп-плеер для SoundCloud и YouTube Music',
    lead: 'Resonance собирает лайки SoundCloud и плейлисты YouTube Music в одном нативном окне. Внутри синхронный текст песен, 10-полосный эквалайзер и кроссфейд.',
    download: 'Скачать Resonance',
    source: 'Код на GitHub',
    meta: 'Бесплатно и с открытым кодом для Windows, macOS и Linux',
    nowPlaying: 'Сейчас играет',
    shotAlt:
      'Resonance в красной теме: плейлисты SoundCloud и YouTube Music, текст песни и панель плеера',
  },
  numbers: {
    title: 'Resonance в цифрах',
    lead: 'На входе два сервиса. Плеер одинаково работает с обеими медиатеками.',
    services: 'сервиса в одной медиатеке',
    bands: 'полос эквалайзера',
    installer: 'установщик для любой системы',
    ram: 'памяти на Windows',
    diagramAlt:
      'SoundCloud и YouTube Music идут в Resonance, а он добавляет тексты, эквалайзер, кроссфейд, нормализацию и темы',
    core: 'Resonance',
    outputs: ['Текст песен', 'Эквалайзер', 'Кроссфейд', 'Нормализация', 'Темы'],
  },
  window: {
    title: 'Обе медиатеки в одном окне',
    lead: 'Плейлисты SoundCloud стоят над медиатекой YouTube Music. Справа идёт текст песни, внизу панель плеера.',
    themesLabel: 'Тема',
    themes: { crimson: 'Красная', warm: 'Тёплая', teal: 'Бирюзовая' },
    themeNote: 'Окно берёт цвета из обложки, которая играет, или держит выбранную палитру.',
    alt: {
      crimson: 'Главный экран Resonance в красной теме',
      warm: 'Главный экран Resonance в тёплой теме',
      teal: 'Главный экран Resonance в бирюзовой теме',
    },
  },
  sound: {
    title: 'Звук под себя',
    lead: 'Эквалайзер, кроссфейд и громкость работают с треками из обоих сервисов.',
    eq: {
      title: 'Эквалайзер',
      desc: 'Десять полос. Начни с пресета или двигай каждую полосу.',
      presets: { flat: 'Flat', bass: 'Bass boost', vocal: 'Vocal', bright: 'Bright' },
    },
    crossfade: {
      title: 'Кроссфейд',
      desc: 'Один трек плавно переходит в следующий.',
      length: 'Длина перехода',
      off: 'Выкл',
      unit: 'с',
    },
    norm: {
      title: 'Нормализация',
      desc: 'Тихие и громкие треки звучат на одном уровне. Лимитер не даёт клиппинга.',
      enabled: 'Вкл',
      disabled: 'Выкл',
      targets: { quiet: 'Тихо', standard: 'Стандарт', loud: 'Громко' },
    },
  },
  lyrics: {
    title: 'Текст идёт в такт',
    lead: 'Строки прокручиваются вместе с треком. Если текст не тот, смени источник в один клик.',
    change: 'Сменить текст',
    tabLyrics: 'Текст',
    tabNext: 'Далее',
    alt: 'Панель текста в Resonance: трек, который играет, и синхронные строки, текущая выделена',
  },
  setup: {
    title: 'От установки до первого трека меньше минуты',
    steps: [
      { title: 'Установи Resonance', desc: 'Установщики весят меньше 20 МБ для Windows, macOS и Linux.' },
      { title: 'Войди в оба сервиса', desc: 'Подключи SoundCloud и YouTube Music прямо в приложении.' },
      { title: 'Нажми Play', desc: 'Плейлисты и лайки из обоих сервисов лежат в одном сайдбаре.' },
    ],
  },
  download: {
    title: 'Скачать Resonance',
    lead: 'Бесплатно и с открытым кодом. Каждая кнопка берёт установщик из последнего подписанного релиза на GitHub.',
    windowsDetail: 'Windows 10 и 11, 64 бит',
    macosDetail: 'macOS 13 и новее',
    linuxDetail: 'Wayland или X11, PipeWire или PulseAudio',
    windowsPrimary: 'Скачать .exe',
    macosPrimary: 'Apple Silicon',
    linuxPrimary: 'Скачать .AppImage',
    also: 'Ещё',
    macIntel: 'Intel .dmg',
    source: 'Собрать из исходников на GitHub',
  },
  footer: {
    description: 'Десктоп-плеер для SoundCloud и YouTube Music на Tauri и Rust.',
    disclaimer: 'Независимый проект с открытым кодом, не связан с SoundCloud или Google.',
    releases: 'Релизы',
    product: 'Продукт',
    project: 'Проект',
  },
}

export const translations = { en, ru }

interface I18nContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
  t: typeof en
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: translations.en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'ru') {
        setLocaleState(saved)
        document.documentElement.lang = saved
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next
    } catch {
      // ignore storage errors
    }
  }

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t: translations[locale],
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
