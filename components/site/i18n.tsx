'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Locale = 'en' | 'ru'

const STORAGE_KEY = 'resonance-locale'

const en = {
  nav: {
    tour: 'Tour',
    features: 'Why Resonance',
    themes: 'Themes',
    sound: 'Sound',
    download: 'Download',
    language: 'Language',
    menu: 'Menu',
  },
  hero: {
    title: 'SoundCloud and YouTube Music in one player.',
    lead: 'Likes, playlists and favorites from both services in one window, with synced lyrics, an equalizer and crossfade.',
    download: 'Download for',
    tour: 'See the app',
    meta: 'Windows, macOS and Linux',
    version: 'Latest release',
    sceneAlt: 'The Resonance window taken apart into its layers: sidebar, search, the SoundCloud and YouTube Music libraries, lyrics and the player bar.',
    layersLabel: 'Window layers',
    layers: [
      { id: 'sidebar', name: 'Sidebar', desc: 'Playlists from both services in one list' },
      { id: 'search', name: 'Search', desc: 'Songs, artists and albums' },
      { id: 'soundcloud', name: 'SoundCloud', desc: 'Your SoundCloud playlists' },
      { id: 'youtube', name: 'YouTube Music', desc: 'Your YouTube Music library' },
      { id: 'lyrics', name: 'Lyrics', desc: 'Synced to the track' },
      { id: 'player', name: 'Player', desc: 'Play, skip, shuffle, volume' },
    ],
    bgLines: [
      'Two libraries, one window',
      'The line being sung is the bright one',
      'Everything else waits its turn',
      'SoundCloud on the left',
      'YouTube Music on the right',
      'One player bar for both',
      'Press play',
    ],
  },
  tour: {
    title: 'Everything you play, one window',
    lead: 'These are real screens from the app. Pick one.',
    tabs: [
      {
        id: 'home',
        label: 'Home',
        title: 'Both libraries, side by side',
        desc: 'SoundCloud playlists sit above your YouTube Music library, with search for songs, artists and albums at the top.',
        alt: 'Resonance home screen: SoundCloud and YouTube Music playlists, the player bar and synced lyrics',
      },
      {
        id: 'favorites',
        label: 'Favorites',
        title: 'Every like in one collection',
        desc: 'Likes from both services are merged. Filter by All, SoundCloud or YouTube Music, search inside, then play or shuffle.',
        alt: 'Resonance favorites collection with a track list and service filters',
      },
      {
        id: 'playlist',
        label: 'Playlist',
        title: 'Open a playlist, press play',
        desc: 'A SoundCloud playlist and a YouTube Music playlist look and behave the same. Play it in order or shuffle it.',
        alt: 'Resonance playlist page with a Play and a Shuffle button',
      },
      {
        id: 'lyrics',
        label: 'Lyrics',
        title: 'Lyrics that follow the song',
        desc: 'Synced lines scroll with the track and the current one lights up. Open them fullscreen, or search another source if the match is wrong.',
        alt: 'Resonance fullscreen lyrics view with the playing track and a highlighted line',
      },
      {
        id: 'eq',
        label: 'Equalizer',
        title: 'Shape the sound',
        desc: 'Five bands from 60 Hz to 14 kHz, a preset row and a crossfade control, one tap away from the lyrics view.',
        alt: 'Resonance equalizer with the Bass Boost preset and a smooth response curve',
      },
      {
        id: 'queue',
        label: 'Up next',
        title: 'The queue stays beside the player',
        desc: 'The Up next tab lists what plays after this track, with the current one marked.',
        alt: 'Resonance Up next queue beside the favorites list',
      },
    ],
  },
  why: {
    title: 'What sets it apart',
    items: [
      {
        id: 'library',
        title: 'Two services, one library',
        desc: 'SoundCloud and YouTube Music share one sidebar. Likes from both land in a single Favorites list.',
      },
      {
        id: 'colors',
        title: 'Colors that follow the song',
        desc: 'Background and accent come from the playing cover, a color or your own photo, on Liquid Glass surfaces.',
      },
      {
        id: 'fade',
        title: 'Crossfade you can shape',
        desc: 'Up to 12 seconds with a linear, equal-power or S-curve fade, plus loudness normalization.',
      },
      {
        id: 'lyrics',
        title: 'Lyrics you can swap',
        desc: 'Wrong match? Search another lyrics source without leaving the track.',
      },
    ],
    alts: {
      library: 'Resonance home screen with SoundCloud and YouTube Music playlists',
      colors: 'Resonance in three different color themes',
      fade: 'Resonance audio settings with crossfade and normalization',
      lyrics: 'Resonance fullscreen lyrics view',
    },
  },
  themes: {
    title: 'Make it look like yours',
    lead: 'Pick a background color and an accent, or let the app take both from the cover that plays. The whole window follows, and so does this page.',
    names: { crimson: 'Crimson', teal: 'Teal', blue: 'Blue', green: 'Green', orange: 'Amber', pink: 'Rose' },
    alt: 'Resonance home screen in the selected color theme',
    points: [
      { title: 'Colors from the artwork', desc: 'Background and accent follow the cover that is playing.' },
      { title: 'Your own colors', desc: 'Twelve backgrounds, ten accents, a picker and eight palette styles.' },
      { title: 'Glass, photo, metal', desc: 'Liquid Glass or Frosted surfaces, your photo behind the player, a metallic style.' },
    ],
    pick: 'Theme',
  },
  sound: {
    title: 'Sound you set yourself',
    lead: 'Everything here works on tracks from both services. Drag, tap, compare.',
    eq: {
      title: 'Equalizer',
      sub: '5 bands, 60 Hz to 14 kHz',
      presets: { flat: 'Flat', bass: 'Bass Boost', vocal: 'Vocal', rock: 'Rock', electronic: 'Electronic', custom: 'Custom' },
      hint: 'Drag a point to build your own curve.',
      reset: 'Reset',
    },
    xfade: {
      title: 'Crossfade',
      length: 'Transition duration',
      curve: 'Transition curve',
      curves: { linear: 'Linear', smooth: 'Smooth (Equal Power)', ultra: 'Ultra-smooth (S-Curve)' },
      out: 'Track A volume',
      in: 'Track B volume',
      zone: 'overlap',
      cut: 'No crossfade: a hard cut',
    },
    norm: {
      title: 'Normalization',
      sub: 'Quiet and loud tracks meet at one level.',
      on: 'Enabled',
      off: 'Disabled',
      target: 'Target loudness',
      targets: { quiet: 'Quiet', standard: 'Standard', loud: 'Loud' },
      a: 'Quiet track',
      b: 'Loud track',
    },
  },
  lyrics: {
    title: 'Lyrics that keep time',
    lead: 'Lines scroll with the track and the current one lights up. It works for tracks from both services.',
    points: [
      { title: 'Synced', desc: 'The line being sung is the bright one.' },
      { title: 'Fullscreen', desc: 'Cover, controls and lyrics fill the window. Press F.' },
      { title: 'Swappable', desc: 'Search another source if the match is wrong.' },
    ],
    alt: 'Resonance fullscreen lyrics view with the playing track and a highlighted line',
  },
  setup: {
    title: 'From install to the first track in a minute',
    steps: [
      { title: 'Install Resonance', desc: 'Pick the installer for Windows, macOS or Linux below.' },
      { title: 'Sign in to both services', desc: 'Connect SoundCloud and YouTube Music inside the app, each in its own window.' },
      { title: 'Press play', desc: 'Playlists and likes from both services sit in one sidebar.' },
    ],
  },
  download: {
    title: 'Download Resonance',
    lead: 'Each button fetches the installer from the latest release on GitHub.',
    detail: {
      windows: 'Windows 10 and 11, 64-bit',
      macos: 'macOS 13 and later',
      linux: 'Wayland or X11, PipeWire or PulseAudio',
    },
    primary: { windows: 'Download .exe', macos: 'Apple Silicon', linux: 'Download .AppImage' },
    also: 'Also',
    yours: 'Your system',
  },
  rail: {
    top: 'Top',
    tour: 'Tour',
    features: 'Why Resonance',
    themes: 'Themes',
    sound: 'Sound',
    lyrics: 'Lyrics',
    setup: 'Setup',
    download: 'Download',
    label: 'Sections',
  },
  footer: {
    description: 'Desktop player for SoundCloud and YouTube Music, built with Tauri and Rust.',
    disclaimer: 'Independent project, not affiliated with SoundCloud or Google.',
    releases: 'Releases',
    product: 'Product',
    project: 'Project',
  },
}

const ru: typeof en = {
  nav: {
    tour: 'Обзор',
    features: 'Почему Resonance',
    themes: 'Темы',
    sound: 'Звук',
    download: 'Скачать',
    language: 'Язык',
    menu: 'Меню',
  },
  hero: {
    title: 'SoundCloud и YouTube Music в одном плеере.',
    lead: 'Лайки, плейлисты и избранное из обоих сервисов в одном окне, с синхронным текстом, эквалайзером и кроссфейдом.',
    download: 'Скачать для',
    tour: 'Посмотреть приложение',
    meta: 'Windows, macOS и Linux',
    version: 'Последний релиз',
    sceneAlt: 'Окно Resonance, разобранное на слои: сайдбар, поиск, медиатеки SoundCloud и YouTube Music, текст песни и панель плеера.',
    layersLabel: 'Слои окна',
    layers: [
      { id: 'sidebar', name: 'Сайдбар', desc: 'Плейлисты обоих сервисов в одном списке' },
      { id: 'search', name: 'Поиск', desc: 'Песни, исполнители и альбомы' },
      { id: 'soundcloud', name: 'SoundCloud', desc: 'Ваши плейлисты SoundCloud' },
      { id: 'youtube', name: 'YouTube Music', desc: 'Ваша медиатека YouTube Music' },
      { id: 'lyrics', name: 'Текст', desc: 'Синхронно с треком' },
      { id: 'player', name: 'Плеер', desc: 'Пуск, переключение, перемешивание, громкость' },
    ],
    bgLines: [
      'Две медиатеки, одно окно',
      'Поющаяся строка самая яркая',
      'Остальные ждут своей очереди',
      'SoundCloud слева',
      'YouTube Music справа',
      'Одна панель плеера на обоих',
      'Нажмите Play',
    ],
  },
  tour: {
    title: 'Всё, что вы слушаете, в одном окне',
    lead: 'Это настоящие экраны приложения. Выберите любой.',
    tabs: [
      {
        id: 'home',
        label: 'Главная',
        title: 'Обе медиатеки рядом',
        desc: 'Плейлисты SoundCloud стоят над медиатекой YouTube Music, а сверху поиск по песням, исполнителям и альбомам.',
        alt: 'Главный экран Resonance: плейлисты SoundCloud и YouTube Music, панель плеера и текст песни',
      },
      {
        id: 'favorites',
        label: 'Избранное',
        title: 'Все лайки в одной коллекции',
        desc: 'Лайки из обоих сервисов объединены. Фильтруйте по «Все», SoundCloud или YouTube Music, ищите внутри, запускайте по порядку или вперемешку.',
        alt: 'Коллекция избранного в Resonance со списком треков и фильтрами сервисов',
      },
      {
        id: 'playlist',
        label: 'Плейлист',
        title: 'Откройте плейлист и нажмите Play',
        desc: 'Плейлист из SoundCloud и плейлист из YouTube Music выглядят и работают одинаково. Играйте по порядку или перемешайте.',
        alt: 'Страница плейлиста в Resonance с кнопками Play и Shuffle',
      },
      {
        id: 'lyrics',
        label: 'Текст',
        title: 'Текст идёт вместе с песней',
        desc: 'Синхронные строки прокручиваются с треком, текущая подсвечена. Откройте их на весь экран или найдите другой источник, если текст не тот.',
        alt: 'Полноэкранный режим текста в Resonance: играющий трек и подсвеченная строка',
      },
      {
        id: 'eq',
        label: 'Эквалайзер',
        title: 'Настройте звук',
        desc: 'Пять полос от 60 Гц до 14 кГц, ряд пресетов и кроссфейд: всё на одном экране с текстом, в одно касание.',
        alt: 'Эквалайзер Resonance с пресетом Bass Boost и плавной кривой',
      },
      {
        id: 'queue',
        label: 'Далее',
        title: 'Очередь рядом с плеером',
        desc: 'Вкладка «Далее» показывает, что играет после этого трека, текущий отмечен.',
        alt: 'Очередь «Далее» рядом со списком избранного в Resonance',
      },
    ],
  },
  why: {
    title: 'Чем он отличается',
    items: [
      {
        id: 'library',
        title: 'Два сервиса, одна медиатека',
        desc: 'SoundCloud и YouTube Music делят один сайдбар. Лайки из обоих попадают в единое «Избранное».',
      },
      {
        id: 'colors',
        title: 'Цвета следуют за песней',
        desc: 'Фон и акцент берутся из играющей обложки, из цвета или вашего фото, на поверхностях Liquid Glass.',
      },
      {
        id: 'fade',
        title: 'Кроссфейд, который настраивается',
        desc: 'До 12 секунд с линейной, равномощной или S-образной кривой, плюс нормализация громкости.',
      },
      {
        id: 'lyrics',
        title: 'Текст можно заменить',
        desc: 'Текст не тот? Найдите другой источник, не выходя из трека.',
      },
    ],
    alts: {
      library: 'Главный экран Resonance с плейлистами SoundCloud и YouTube Music',
      colors: 'Resonance в трёх разных цветовых темах',
      fade: 'Настройки звука Resonance: кроссфейд и нормализация',
      lyrics: 'Полноэкранный режим текста в Resonance',
    },
  },
  themes: {
    title: 'Сделайте под себя',
    lead: 'Выберите цвет фона и акцент или позвольте приложению взять оба из играющей обложки. Окно перекрашивается целиком, и эта страница тоже.',
    names: { crimson: 'Малиновая', teal: 'Бирюзовая', blue: 'Синяя', green: 'Зелёная', orange: 'Янтарная', pink: 'Розовая' },
    alt: 'Главный экран Resonance в выбранной цветовой теме',
    points: [
      { title: 'Цвета из обложки', desc: 'Фон и акцент следуют за обложкой играющего трека.' },
      { title: 'Свои цвета', desc: 'Двенадцать фонов, десять акцентов, палитра и восемь стилей.' },
      { title: 'Стекло, фото, металл', desc: 'Поверхности Liquid Glass или Frosted, ваше фото за плеером, металлический стиль.' },
    ],
    pick: 'Тема',
  },
  sound: {
    title: 'Звук под себя',
    lead: 'Всё это работает на треках из обоих сервисов. Тяните, нажимайте, сравнивайте.',
    eq: {
      title: 'Эквалайзер',
      sub: '5 полос, от 60 Гц до 14 кГц',
      presets: { flat: 'Flat', bass: 'Bass Boost', vocal: 'Vocal', rock: 'Rock', electronic: 'Electronic', custom: 'Свой' },
      hint: 'Потяните точку, чтобы собрать свою кривую.',
      reset: 'Сброс',
    },
    xfade: {
      title: 'Кроссфейд',
      length: 'Длительность перехода',
      curve: 'Кривая перехода',
      curves: { linear: 'Linear', smooth: 'Smooth (Equal Power)', ultra: 'Ultra-smooth (S-Curve)' },
      out: 'Громкость трека A',
      in: 'Громкость трека B',
      zone: 'наложение',
      cut: 'Без кроссфейда: резкая склейка',
    },
    norm: {
      title: 'Нормализация',
      sub: 'Тихие и громкие треки встречаются на одном уровне.',
      on: 'Вкл',
      off: 'Выкл',
      target: 'Целевая громкость',
      targets: { quiet: 'Тихо', standard: 'Стандарт', loud: 'Громко' },
      a: 'Тихий трек',
      b: 'Громкий трек',
    },
  },
  lyrics: {
    title: 'Текст идёт в такт',
    lead: 'Строки прокручиваются вместе с треком, текущая загорается. Работает для треков из обоих сервисов.',
    points: [
      { title: 'Синхронно', desc: 'Поющаяся строка самая яркая.' },
      { title: 'На весь экран', desc: 'Обложка, управление и текст на всё окно. Клавиша F.' },
      { title: 'Можно заменить', desc: 'Найдите другой источник, если текст не тот.' },
    ],
    alt: 'Полноэкранный режим текста в Resonance: играющий трек и подсвеченная строка',
  },
  setup: {
    title: 'От установки до первого трека за минуту',
    steps: [
      { title: 'Установите Resonance', desc: 'Выберите установщик для Windows, macOS или Linux ниже.' },
      { title: 'Войдите в оба сервиса', desc: 'Подключите SoundCloud и YouTube Music прямо в приложении, каждый в своём окне.' },
      { title: 'Нажмите Play', desc: 'Плейлисты и лайки из обоих сервисов лежат в одном сайдбаре.' },
    ],
  },
  download: {
    title: 'Скачать Resonance',
    lead: 'Каждая кнопка берёт установщик из последнего релиза на GitHub.',
    detail: {
      windows: 'Windows 10 и 11, 64 бит',
      macos: 'macOS 13 и новее',
      linux: 'Wayland или X11, PipeWire или PulseAudio',
    },
    primary: { windows: 'Скачать .exe', macos: 'Apple Silicon', linux: 'Скачать .AppImage' },
    also: 'Ещё',
    yours: 'Ваша система',
  },
  rail: {
    top: 'Наверх',
    tour: 'Обзор',
    features: 'Почему Resonance',
    themes: 'Темы',
    sound: 'Звук',
    lyrics: 'Текст',
    setup: 'Установка',
    download: 'Скачать',
    label: 'Разделы',
  },
  footer: {
    description: 'Десктоп-плеер для SoundCloud и YouTube Music на Tauri и Rust.',
    disclaimer: 'Независимый проект, не связан с SoundCloud или Google.',
    releases: 'Релизы',
    product: 'Продукт',
    project: 'Проект',
  },
}

export const translations = { en, ru }
export type Dict = typeof en

interface I18nContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
  t: Dict
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
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
