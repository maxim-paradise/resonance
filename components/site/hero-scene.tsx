'use client'

import { useEffect, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'

/*
 * The Resonance window, taken apart. Every layer is cut from the real home-screen screenshot and
 * floats at its own depth, joined to the window shell by thin guide lines, like an exploded view.
 * On load the SoundCloud layer flies in from the left and the YouTube Music layer from the right
 * and both dock into the one library. The pointer turns the stack; clicking a layer (or its chip)
 * brings it forward. Scrolling assembles the window back into one flat screen.
 * prefers-reduced-motion is deliberately not honoured (see motion.tsx).
 */

const SRC = '/shots/home.jpg'
const IW = 1424 // the screenshot's size in pixels
const IH = 821

type LayerDef = { id: string; x: number; y: number; w: number; h: number; z: number; from: number; edge: number }

/* crop rectangles in screenshot pixels; z is the exploded depth; from is where it flies in from */
const LAYERS: LayerDef[] = [
  { id: 'sidebar', x: 13, y: 12, w: 274, h: 797, z: 0.5, from: 0, edge: 0xffffff },
  { id: 'search', x: 296, y: 12, w: 746, h: 132, z: 0.82, from: 0, edge: 0xffffff },
  { id: 'soundcloud', x: 296, y: 150, w: 746, h: 330, z: 1.0, from: -1, edge: 0xff5500 },
  { id: 'youtube', x: 296, y: 520, w: 746, h: 170, z: 1.0, from: 1, edge: 0xff0033 },
  { id: 'lyrics', x: 1052, y: 12, w: 362, h: 797, z: 0.66, from: 0, edge: 0xffffff },
  { id: 'player', x: 308, y: 694, w: 722, h: 106, z: 1.38, from: 0, edge: 0xffffff },
]
export const LAYER_IDS = LAYERS.map((l) => l.id)

const WORLD_W = 4.2
const PX = WORLD_W / IW // world units per screenshot pixel

interface Layer {
  def: LayerDef
  group: THREE.Group
  mat: THREE.MeshBasicMaterial
  edgeMat: THREE.LineBasicMaterial
  guide: THREE.LineSegments
  guidePos: Float32Array
  hx: number
  hy: number
  cx: number
  cy: number
  lift: number
}

export default function HeroScene({
  onFail,
  onSelect,
  control,
}: {
  onFail?: () => void
  onSelect?: (index: number) => void
  control?: MutableRefObject<{ select: (i: number) => void; pick: (clientX: number, clientY: number) => void } | null>
}) {
  const mount = useRef<HTMLDivElement>(null)
  const cb = useRef({ onFail, onSelect })
  cb.current = { onFail, onSelect }

  useEffect(() => {
    const el = mount.current
    if (!el) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      cb.current.onFail?.()
      return
    }
    const small = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'
    el.appendChild(renderer.domElement)

    const disposables: { dispose: () => void }[] = []
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o)
      return o
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
    camera.position.set(0, 0, 9)

    const stack = new THREE.Group() // turned by pointer and scroll
    scene.add(stack)

    const base = new THREE.TextureLoader().load(SRC)
    base.colorSpace = THREE.SRGBColorSpace
    base.anisotropy = renderer.capabilities.getMaxAnisotropy()
    base.minFilter = THREE.LinearMipmapLinearFilter
    disposables.push(base)

    /* the window shell: the whole screenshot, dimmed, with a title bar on top */
    const shellMat = track(new THREE.MeshBasicMaterial({ map: base, color: 0x3a3a3a, toneMapped: false }))
    const shell = new THREE.Mesh(track(new THREE.PlaneGeometry(WORLD_W, IH * PX)), shellMat)
    stack.add(shell)
    const barH = 0.11
    const bar = new THREE.Mesh(
      track(new THREE.PlaneGeometry(WORLD_W, barH)),
      track(new THREE.MeshBasicMaterial({ color: 0x0d0d0d, toneMapped: false })),
    )
    bar.position.set(0, (IH * PX) / 2 + barH / 2, 0)
    stack.add(bar)
    const shellEdge = new THREE.LineSegments(
      track(new THREE.EdgesGeometry(track(new THREE.PlaneGeometry(WORLD_W, IH * PX + barH)))),
      track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })),
    )
    shellEdge.position.y = barH / 2
    stack.add(shellEdge)

    /* the layers */
    const layers: Layer[] = LAYERS.map((def) => {
      const tex = base.clone()
      tex.repeat.set(def.w / IW, def.h / IH)
      tex.offset.set(def.x / IW, 1 - (def.y + def.h) / IH)
      tex.needsUpdate = true
      disposables.push(tex)
      const w = def.w * PX
      const h = def.h * PX
      const mat = track(new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }))
      const plane = new THREE.Mesh(track(new THREE.PlaneGeometry(w, h)), mat)
      plane.userData.index = LAYERS.indexOf(def)
      const edgeMat = track(new THREE.LineBasicMaterial({ color: def.edge, transparent: true, opacity: 0.55 }))
      const edge = new THREE.LineSegments(track(new THREE.EdgesGeometry(plane.geometry)), edgeMat)
      edge.position.z = 0.001
      const group = new THREE.Group()
      group.add(plane, edge)
      const cx = (def.x + def.w / 2 - IW / 2) * PX
      const cy = -(def.y + def.h / 2 - IH / 2) * PX
      group.position.set(cx, cy, 0)
      stack.add(group)

      // four guide lines from the layer's corners straight down to the shell
      const guidePos = new Float32Array(8 * 3)
      const gGeo = track(new THREE.BufferGeometry())
      gGeo.setAttribute('position', new THREE.BufferAttribute(guidePos, 3))
      const guide = new THREE.LineSegments(
        gGeo,
        track(new THREE.LineBasicMaterial({ color: def.edge, transparent: true, opacity: 0.2 })),
      )
      guide.frustumCulled = false
      stack.add(guide)
      return { def, group, mat, edgeMat, guide, guidePos, hx: w / 2, hy: h / 2, cx, cy, lift: 0 }
    })
    const planes = layers.map((l) => l.group.children[0])

    /* ---------- state ---------- */
    let selected = -1
    const select = (i: number) => {
      selected = selected === i ? -1 : i
      cb.current.onSelect?.(selected)
    }

    const ray = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const pick = (clientX: number, clientY: number) => {
      const box = el.getBoundingClientRect()
      ndc.set(((clientX - box.left) / box.width) * 2 - 1, -((clientY - box.top) / box.height) * 2 + 1)
      ray.setFromCamera(ndc, camera)
      const hit = ray.intersectObjects(planes, false)[0]
      if (hit) select(hit.object.userData.index as number)
      else if (selected !== -1) select(selected)
    }
    if (control) control.current = { select, pick }

    /* ---------- layout on the anchor ---------- */
    let wPx = 1
    let hPx = 1
    const anchor = { x: 0, y: 0, w: 400, h: 400 }
    const layout = () => {
      const box = el.getBoundingClientRect()
      wPx = Math.max(1, Math.round(box.width))
      hPx = Math.max(1, Math.round(box.height))
      renderer.setSize(wPx, hPx, false)
      const a = document.getElementById('hero-anchor')?.getBoundingClientRect()
      anchor.w = a ? a.width : wPx * 0.5
      anchor.h = a ? a.height : hPx * 0.6
      anchor.x = a ? a.left - box.left + a.width / 2 : wPx * 0.72
      anchor.y = a ? a.top - box.top + a.height * 0.46 : hPx * 0.5
      camera.aspect = wPx / hPx
      camera.setViewOffset(wPx, hPx, -(anchor.x - wPx / 2), -(anchor.y - hPx / 2), wPx, hPx)
      // the flat window should fill the anchor's width; the exploded one is allowed to spill out
      const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
      const pxPerWorld = hPx / visH
      camera.zoom = Math.min((anchor.w * 0.98) / (WORLD_W * pxPerWorld), (anchor.h * 0.82) / ((IH * PX + barH) * pxPerWorld))
      camera.updateProjectionMatrix()
    }

    /* ---------- pointer ---------- */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e: PointerEvent) => {
      const box = el.getBoundingClientRect()
      pointer.tx = Math.max(-1, Math.min(1, (e.clientX - box.left - anchor.x) / (wPx * 0.5)))
      pointer.ty = Math.max(-1, Math.min(1, (e.clientY - box.top - anchor.y) / (hPx * 0.5)))
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
    io.observe(el)
    const ro = new ResizeObserver(layout)
    ro.observe(el)
    const anchorEl = document.getElementById('hero-anchor')
    if (anchorEl) ro.observe(anchorEl)
    layout()

    const clock = new THREE.Clock()
    let raf = 0
    let assembled = 0
    const easeOut = (t: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3)
    const easeInOut = (t: number) => {
      const x = THREE.MathUtils.clamp(t, 0, 1)
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden) return
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3)
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3)

      // 0 = taken apart, 1 = one flat window; driven by how far the hero has scrolled away
      // assembles once the window itself rises past the top eighth of the screen, so on a phone,
      // where it sits under the headline, you still see it taken apart as it scrolls into view
      const vh = window.innerHeight
      const top = anchorEl ? anchorEl.getBoundingClientRect().top : vh * 0.2 - window.scrollY
      const scroll = THREE.MathUtils.clamp((vh * 0.12 - top) / (vh * 0.36), 0, 1)
      assembled += (easeInOut(scroll) - assembled) * Math.min(1, dt * 8)
      const apart = 1 - assembled

      // the whole stack turns three-quarters on, follows the pointer, and squares up as it assembles
      const intro = easeOut(t / 1.8)
      stack.rotation.y = (-0.52 + pointer.x * 0.2) * apart + (1 - intro) * -0.4
      stack.rotation.x = (0.3 - pointer.y * 0.12) * apart
      stack.rotation.z = 0.04 * apart
      stack.position.y = Math.sin(t * 0.6) * 0.04 * apart

      layers.forEach((L, i) => {
        // each layer arrives in turn; the two services fly in from opposite sides
        const arrive = easeOut((t - 0.25 - i * 0.12) / 1.1)
        const fly = (1 - arrive) * L.def.from * 4.5
        const rise = (1 - arrive) * (L.def.from === 0 ? 1.6 : 0)
        const liftTarget = selected === i ? 0.55 : 0
        L.lift += (liftTarget - L.lift) * Math.min(1, dt * 7)
        // a slow breathing so the exploded view never sits dead still
        const breathe = Math.sin(t * 0.9 + i * 1.3) * 0.035
        const z = (L.def.z + breathe + L.lift) * apart + 0.004 * (i + 1) + rise
        L.group.position.set(L.cx + fly, L.cy, z)
        // the others fade back while one is picked, but the assembled window is always whole
        const dim = selected === -1 || selected === i ? 1 : 1 - 0.55 * apart
        const op = arrive * dim
        L.mat.opacity = op
        L.edgeMat.opacity = (selected === i ? 1 : 0.45) * arrive * (0.35 + 0.65 * apart)

        // guide lines from the corners down to the shell
        const p = L.guidePos
        const corners = [
          [-L.hx, -L.hy],
          [L.hx, -L.hy],
          [L.hx, L.hy],
          [-L.hx, L.hy],
        ]
        corners.forEach(([dx, dy], k) => {
          const o = k * 6
          p[o] = L.cx + dx + fly
          p[o + 1] = L.cy + dy
          p[o + 2] = z
          p[o + 3] = L.cx + dx
          p[o + 4] = L.cy + dy
          p[o + 5] = 0
        })
        L.guide.geometry.attributes.position.needsUpdate = true
        ;(L.guide.material as THREE.LineBasicMaterial).opacity = 0.22 * apart * arrive
      })
      shellMat.color.setScalar(0.23 + 0.77 * assembled)

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      if (control) control.current = null
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [control])

  return <div ref={mount} className="absolute inset-0" />
}
