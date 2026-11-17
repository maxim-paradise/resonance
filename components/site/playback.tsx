'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface PlaybackValue {
  /** drives the 3D disc and the equalizer bars: spinning faster and pulsing when on */
  playing: boolean
  toggle: () => void
}

const PlaybackContext = createContext<PlaybackValue>({ playing: true, toggle: () => {} })

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(true)
  const toggle = useCallback(() => setPlaying((p) => !p), [])
  const value = useMemo(() => ({ playing, toggle }), [playing, toggle])
  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>
}

export function usePlayback() {
  return useContext(PlaybackContext)
}
