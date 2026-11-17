'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Locale = 'en' | 'ru'

const STORAGE_KEY = 'resonance-locale'

const en = {
  nav: {
    tour: 'Tour',
    features: 'Features',
    sound: 'Sound',
    themes: 'Themes',
    specs: 'Specs',
    download: 'Download',
    language: 'Language',
    menu: 'Menu',
  },
  hero: {
    eyebrow: 'Free desktop player',
    title: 'Your SoundCloud and YouTube Music in one player.',
    lead: 'Resonance puts likes, playlists and favorites from both services in one native window. Synced lyrics, an equalizer, crossfade and themes come with it.',
    download: 'Download for',
    tour: 'See the app',
    meta: 'Windows, macOS and Linux · open source',
    version: 'Latest release',
    sceneAlt: 'A spinning vinyl with the Resonance mark, surrounded by floating album covers',
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
        desc: 'Likes from both services are merged. Filter by All, SoundCloud or YouTube Music, search inside, refresh, then play or shuffle.',
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
  features: {
    title: 'All of it, plainly',
    lead: 'Every function in the app today, grouped the way Settings groups them.',
    filters: { all: 'All', library: 'Library', playback: 'Playback', sound: 'Sound', look: 'Look', app: 'App' },
    items: [
      { id: 'two', cat: 'library', title: 'Two services, one library', desc: 'SoundCloud and YouTube Music playlists sit in one sidebar and open the same way.' },
      { id: 'fav', cat: 'library', title: 'Combined favorites', desc: 'Likes from both services in one collection, with All, SoundCloud and YouTube Music filters.' },
      { id: 'search', cat: 'library', title: 'Search', desc: 'Find songs, artists and albums from the home screen.' },
      { id: 'playlists', cat: 'library', title: 'Playlists', desc: 'Open, play and shuffle playlists. Make your own with the plus button.' },
      { id: 'bar', cat: 'playback', title: 'Player bar', desc: 'Play, skip, shuffle, repeat, seek and volume. Like or dislike a track, or add it to the queue.' },
      { id: 'queue', cat: 'playback', title: 'Up next queue', desc: 'A panel beside the player lists what comes next and marks the current track.' },
      { id: 'lyrics', cat: 'playback', title: 'Synced lyrics', desc: 'Lines scroll with the song and the current line is highlighted.' },
      { id: 'fullscreen', cat: 'playback', title: 'Fullscreen view', desc: 'Cover, controls and lyrics fill the window. Switch to the equalizer or open crossfade from the top bar.' },
      { id: 'change', cat: 'playback', title: 'Change lyrics', desc: 'Wrong match? Search for another lyrics source without leaving the track.' },
      { id: 'eq', cat: 'sound', title: 'Equalizer', desc: 'Five bands from 60 Hz to 14 kHz, plus or minus 12 dB. Flat, Bass Boost, Vocal, Rock, Electronic or Custom.' },
      { id: 'xfade', cat: 'sound', title: 'Crossfade', desc: 'Blend tracks over 0 to 12 seconds. Linear, Smooth (Equal Power) or Ultra-smooth (S-Curve).' },
      { id: 'norm', cat: 'sound', title: 'Normalization', desc: 'Quiet and loud tracks meet at -18, -14 or -11 LUFS, without clipping or distortion.' },
      { id: 'glass', cat: 'look', title: 'Glass effects', desc: 'Liquid Glass, Frosted or Off, with sliders for blur, tint density and refraction.' },
      { id: 'bg', cat: 'look', title: 'Player background', desc: 'Colors from the artwork, a flat color, or your own photo with dim and blur.' },
      { id: 'accent', cat: 'look', title: 'Accent and palettes', desc: 'Take the accent from the artwork or pick one. Eight palette styles, from Vibrant to Monochrome.' },
      { id: 'metal', cat: 'look', title: 'Metallic and neon', desc: 'A brushed-steel style and a neon accent with adjustable intensity.' },
      { id: 'theme', cat: 'look', title: 'Theme and motion', desc: 'Dark, Light or System. Expressive, Standard or Reduced motion. Reset it all in one click.' },
      { id: 'keys', cat: 'app', title: 'Keyboard shortcuts', desc: 'Space, arrows, L, F and slash by default. Rebind any of them.' },
      { id: 'lang', cat: 'app', title: 'English and Russian', desc: 'Switch the interface language in Settings.' },
      { id: 'update', cat: 'app', title: 'Built-in updates', desc: 'See your version and the latest one, and check again from the sidebar.' },
      { id: 'local', cat: 'app', title: 'Sign-in stays local', desc: 'You sign in to each service in its own window. Sessions live in the local app data folder.' },
      { id: 'os', cat: 'app', title: 'Windows, macOS, Linux', desc: 'A native app built with Tauri and Rust. Free, with the source on GitHub.' },
    ],
  },
  themes: {
    title: 'Make it look like yours',
    lead: 'Take colors from the cover that plays, or pick an accent. The page below changes with it.',
    names: { crimson: 'Crimson', teal: 'From artwork', orange: 'Orange', pink: 'Pink', blue: 'Blue' },
    alt: 'Resonance home screen with the selected accent color',
    points: [
      { title: 'Colors from the artwork', desc: 'Background and accent follow the cover that is playing.' },
      { title: 'Your own accent', desc: 'Ten ready colors and a picker, with eight palette styles.' },
      { title: 'Glass, photo, metal', desc: 'Liquid Glass or Frosted surfaces, your photo behind the player, a metallic style.' },
    ],
    pick: 'Accent color',
  },
  sound: {
    title: 'Sound you set yourself',
    lead: 'Everything here works on tracks from both services. Drag, tap, listen.',
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
      out: 'Track A',
      in: 'Track B',
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
    lead: 'Lines scroll with the track and the current one lights up. Press play to watch the demo.',
    change: 'Change lyrics',
    play: 'Play demo',
    pause: 'Pause demo',
    set: [
      ['Lines scroll with the track', 'The current line lights up', 'The ones behind it fade out', 'The ones ahead wait their turn', 'Wrong match for this song?', 'Search another lyrics source', 'And the words keep time again'],
      ['This is the second version', 'It came from another source', 'The timing works the same way', 'Switch back whenever you like', 'The track itself never changes', 'Only the words under it do', 'Press play and sing along'],
    ],
    note: 'Demo lines, not real lyrics.',
  },
  setup: {
    title: 'From install to the first track in a minute',
    steps: [
      { title: 'Install Resonance', desc: 'Pick the installer for Windows, macOS or Linux below.' },
      { title: 'Sign in to both services', desc: 'Connect SoundCloud and YouTube Music inside the app, each in its own window.' },
      { title: 'Press play', desc: 'Playlists and likes from both services sit in one sidebar.' },
    ],
  },
  specs: {
    title: 'Characteristics',
    rows: [
      ['Price', 'Free'],
      ['Source code', 'Open, on GitHub'],
      ['Services', 'SoundCloud, YouTube Music'],
      ['Windows', 'Windows 10 and 11, 64-bit'],
      ['macOS', 'macOS 13 and later, Apple Silicon and Intel'],
      ['Linux', 'Wayland or X11, PipeWire or PulseAudio'],
      ['Equalizer', '5 bands, 60 Hz to 14 kHz, plus or minus 12 dB'],
      ['Crossfade', '0 to 12 seconds, 3 curves'],
      ['Loudness targets', '-18, -14 or -11 LUFS'],
      ['Interface', 'English and Russian, dark, light or system theme'],
      ['Built with', 'Tauri and Rust'],
    ],
  },
  download: {
    title: 'Download Resonance',
    lead: 'Free and open source. Each button fetches the installer from the latest signed GitHub release.',
    detail: {
      windows: 'Windows 10 and 11, 64-bit',
      macos: 'macOS 13 and later',
      linux: 'Wayland or X11, PipeWire or PulseAudio',
    },
    primary: { windows: 'Download .exe', macos: 'Apple Silicon', linux: 'Download .AppImage' },
    also: 'Also',
    yours: 'Your system',
    source: 'Build from source on GitHub',
  },
  bar: {
    now: 'Now playing',
    tagline: 'Free for Windows, macOS and Linux',
    play: 'Play',
    pause: 'Pause',
    prev: 'Previous section',
    next: 'Next section',
    seek: 'Page position',
    download: 'Download',
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
    tour: 'Обзор',
    features: 'Функции',
    sound: 'Звук',
    themes: 'Темы',
    specs: 'Параметры',
    download: 'Скачать',
    language: 'Язык',
    menu: 'Меню',
  },
  hero: {
    eyebrow: 'Бесплатный десктоп-плеер',
    title: 'Ваши SoundCloud и YouTube Music в одном плеере.',
    lead: 'Resonance собирает лайки, плейлисты и избранное из обоих сервисов в одном нативном окне. Синхронный текст песен, эквалайзер, кроссфейд и темы уже внутри.',
    download: 'Скачать для',
    tour: 'Посмотреть приложение',
    meta: 'Windows, macOS и Linux · открытый код',
    version: 'Последний релиз',
    sceneAlt: 'Вращающаяся виниловая пластинка с логотипом Resonance и летающие обложки альбомов',
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
        desc: 'Лайки из обоих сервисов объединены. Фильтруйте по «Все», SoundCloud или YouTube Music, ищите внутри, обновляйте, запускайте по порядку или вперемешку.',
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
  features: {
    title: 'Всё, что умеет плеер',
    lead: 'Каждая функция приложения на сегодня, сгруппированная так же, как в настройках.',
    filters: { all: 'Все', library: 'Медиатека', playback: 'Воспроизведение', sound: 'Звук', look: 'Внешний вид', app: 'Приложение' },
    items: [
      { id: 'two', cat: 'library', title: 'Два сервиса, одна медиатека', desc: 'Плейлисты SoundCloud и YouTube Music лежат в одном сайдбаре и открываются одинаково.' },
      { id: 'fav', cat: 'library', title: 'Общее избранное', desc: 'Лайки из обоих сервисов в одной коллекции с фильтрами «Все», SoundCloud и YouTube Music.' },
      { id: 'search', cat: 'library', title: 'Поиск', desc: 'Ищите песни, исполнителей и альбомы с главного экрана.' },
      { id: 'playlists', cat: 'library', title: 'Плейлисты', desc: 'Открывайте, запускайте и перемешивайте плейлисты. Свои создаются кнопкой с плюсом.' },
      { id: 'bar', cat: 'playback', title: 'Панель плеера', desc: 'Пуск, переключение, перемешивание, повтор, перемотка и громкость. Лайк, дизлайк и добавление в очередь.' },
      { id: 'queue', cat: 'playback', title: 'Очередь «Далее»', desc: 'Панель рядом с плеером показывает, что играет следом, и отмечает текущий трек.' },
      { id: 'lyrics', cat: 'playback', title: 'Синхронный текст', desc: 'Строки прокручиваются вместе с песней, текущая строка подсвечена.' },
      { id: 'fullscreen', cat: 'playback', title: 'Полноэкранный режим', desc: 'Обложка, управление и текст на всё окно. Сверху переключатель на эквалайзер и быстрый доступ к кроссфейду.' },
      { id: 'change', cat: 'playback', title: 'Сменить текст', desc: 'Текст не тот? Найдите другой источник, не выходя из трека.' },
      { id: 'eq', cat: 'sound', title: 'Эквалайзер', desc: 'Пять полос от 60 Гц до 14 кГц, плюс-минус 12 дБ. Flat, Bass Boost, Vocal, Rock, Electronic или свой.' },
      { id: 'xfade', cat: 'sound', title: 'Кроссфейд', desc: 'Плавный переход между треками от 0 до 12 секунд. Linear, Smooth (Equal Power) или Ultra-smooth (S-Curve).' },
      { id: 'norm', cat: 'sound', title: 'Нормализация', desc: 'Тихие и громкие треки встречаются на уровне -18, -14 или -11 LUFS, без клиппинга и искажений.' },
      { id: 'glass', cat: 'look', title: 'Эффекты стекла', desc: 'Liquid Glass, Frosted или выкл., с ползунками размытия, плотности оттенка и преломления.' },
      { id: 'bg', cat: 'look', title: 'Фон плеера', desc: 'Цвета из обложки, сплошной цвет или ваше фото с затемнением и размытием.' },
      { id: 'accent', cat: 'look', title: 'Акцент и палитры', desc: 'Акцент из обложки или любой свой. Восемь стилей палитры, от Vibrant до Monochrome.' },
      { id: 'metal', cat: 'look', title: 'Металл и неон', desc: 'Стиль шлифованной стали и неоновый акцент с регулируемой яркостью.' },
      { id: 'theme', cat: 'look', title: 'Тема и анимации', desc: 'Тёмная, светлая или системная. Выразительные, стандартные или уменьшенные анимации. Сброс одним кликом.' },
      { id: 'keys', cat: 'app', title: 'Горячие клавиши', desc: 'По умолчанию пробел, стрелки, L, F и слэш. Любую можно переназначить.' },
      { id: 'lang', cat: 'app', title: 'Русский и английский', desc: 'Язык интерфейса переключается в настройках.' },
      { id: 'update', cat: 'app', title: 'Встроенные обновления', desc: 'Видно вашу версию и последнюю, проверить снова можно из сайдбара.' },
      { id: 'local', cat: 'app', title: 'Вход остаётся локальным', desc: 'В каждый сервис вы входите в его собственном окне. Сессии хранятся в локальной папке данных приложения.' },
      { id: 'os', cat: 'app', title: 'Windows, macOS, Linux', desc: 'Нативное приложение на Tauri и Rust. Бесплатно, исходный код на GitHub.' },
    ],
  },
  themes: {
    title: 'Сделайте под себя',
    lead: 'Берите цвета с играющей обложки или выбирайте акцент. Страница ниже меняется вместе с ним.',
    names: { crimson: 'Малиновая', teal: 'Из обложки', orange: 'Оранжевая', pink: 'Розовая', blue: 'Синяя' },
    alt: 'Главный экран Resonance с выбранным цветом акцента',
    points: [
      { title: 'Цвета из обложки', desc: 'Фон и акцент следуют за обложкой играющего трека.' },
      { title: 'Свой акцент', desc: 'Десять готовых цветов и палитра, плюс восемь стилей.' },
      { title: 'Стекло, фото, металл', desc: 'Поверхности Liquid Glass или Frosted, ваше фото за плеером, металлический стиль.' },
    ],
    pick: 'Цвет акцента',
  },
  sound: {
    title: 'Звук под себя',
    lead: 'Всё это работает на треках из обоих сервисов. Тяните, нажимайте, слушайте.',
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
      out: 'Трек A',
      in: 'Трек B',
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
    lead: 'Строки прокручиваются вместе с треком, текущая загорается. Нажмите Play, чтобы увидеть демо.',
    change: 'Сменить текст',
    play: 'Запустить демо',
    pause: 'Пауза',
    set: [
      ['Строки идут вместе с треком', 'Текущая строка загорается', 'Прошедшие гаснут позади', 'Следующие ждут своей очереди', 'Текст не тот для этой песни?', 'Найдите другой источник', 'И слова снова идут в такт'],
      ['Это вторая версия текста', 'Она пришла из другого источника', 'Тайминг работает так же', 'Вернуться можно в любой момент', 'Сам трек при этом не меняется', 'Меняются только слова под ним', 'Нажмите Play и подпевайте'],
    ],
    note: 'Демо-строки, не настоящий текст.',
  },
  setup: {
    title: 'От установки до первого трека за минуту',
    steps: [
      { title: 'Установите Resonance', desc: 'Выберите установщик для Windows, macOS или Linux ниже.' },
      { title: 'Войдите в оба сервиса', desc: 'Подключите SoundCloud и YouTube Music прямо в приложении, каждый в своём окне.' },
      { title: 'Нажмите Play', desc: 'Плейлисты и лайки из обоих сервисов лежат в одном сайдбаре.' },
    ],
  },
  specs: {
    title: 'Характеристики',
    rows: [
      ['Цена', 'Бесплатно'],
      ['Исходный код', 'Открытый, на GitHub'],
      ['Сервисы', 'SoundCloud, YouTube Music'],
      ['Windows', 'Windows 10 и 11, 64 бит'],
      ['macOS', 'macOS 13 и новее, Apple Silicon и Intel'],
      ['Linux', 'Wayland или X11, PipeWire или PulseAudio'],
      ['Эквалайзер', '5 полос, от 60 Гц до 14 кГц, плюс-минус 12 дБ'],
      ['Кроссфейд', 'от 0 до 12 секунд, 3 кривые'],
      ['Целевая громкость', '-18, -14 или -11 LUFS'],
      ['Интерфейс', 'Русский и английский, тёмная, светлая или системная тема'],
      ['Сделано на', 'Tauri и Rust'],
    ],
  },
  download: {
    title: 'Скачать Resonance',
    lead: 'Бесплатно и с открытым кодом. Каждая кнопка берёт установщик из последнего подписанного релиза на GitHub.',
    detail: {
      windows: 'Windows 10 и 11, 64 бит',
      macos: 'macOS 13 и новее',
      linux: 'Wayland или X11, PipeWire или PulseAudio',
    },
    primary: { windows: 'Скачать .exe', macos: 'Apple Silicon', linux: 'Скачать .AppImage' },
    also: 'Ещё',
    yours: 'Ваша система',
    source: 'Собрать из исходников на GitHub',
  },
  bar: {
    now: 'Сейчас играет',
    tagline: 'Бесплатно для Windows, macOS и Linux',
    play: 'Играть',
    pause: 'Пауза',
    prev: 'Предыдущий раздел',
    next: 'Следующий раздел',
    seek: 'Положение на странице',
    download: 'Скачать',
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
