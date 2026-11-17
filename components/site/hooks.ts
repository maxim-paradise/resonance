'use client'

import { useEffect, useState } from 'react'
import { APP_VERSION, type OS } from '@/lib/links'

export function useOS(): OS {
  const [os, setOs] = useState<OS>('windows')
  useEffect(() => {
    const ua = (navigator.userAgent || '').toLowerCase()
    const platform = (navigator.platform || '').toLowerCase()
    if (/android|iphone|ipad|ipod/.test(ua)) return
    if (platform.includes('mac') || ua.includes('mac os')) setOs('macos')
    else if (platform.includes('linux') || ua.includes('linux') || ua.includes('x11')) setOs('linux')
    else setOs('windows')
  }, [])
  return os
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/** latest release tag from the download proxy; falls back to the version the screenshots came from */
export function useLatestVersion() {
  const [tag, setTag] = useState(APP_VERSION)
  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/api/download', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.tag === 'string' && d.tag) setTag(d.tag)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])
  return tag
}
