'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RS_PATHS } from './logo'
import { usePlayback } from './playback'

const COVERS = [
  '/images/ooes-cover.png',
  '/images/playlists/stalker.png',
  '/images/playlists/vajbik.png',
  '/images/playlists/dm.png',
  '/images/playlists/p1448.png',
  '/images/playlists/hardstyle.png',
]

/** x, y, z, size, tilt around Y, depth factor for the pointer parallax */
const LAYOUT: [number, number, number, number, number, number][] = [
  [-2.35, 1.9, 0.9, 1.1, 0.35, 1.0],
  [2.4, 2.0, -0.7, 1.25, -0.3, 0.5],
  [2.5, -1.6, 1.0, 1.0, -0.32, 1.1],
  [-2.45, -1.95, 0.2, 1.15, 0.3, 0.7],
  [-0.3, -2.4, 1.6, 0.85, 0.12, 1.4],
  [1.0, 2.35, 1.9, 0.8, -0.2, 1.5],
]

function roundedPlane(size: number, radius: number) {
  const h = size / 2
  const s = new THREE.Shape()
  s.moveTo(-h + radius, -h)
  s.lineTo(h - radius, -h)
  s.quadraticCurveTo(h, -h, h, -h + radius)
  s.lineTo(h, h - radius)
  s.quadraticCurveTo(h, h, h - radius, h)
  s.lineTo(-h + radius, h)
  s.quadraticCurveTo(-h, h, -h, h - radius)
  s.lineTo(-h, -h + radius)
  s.quadraticCurveTo(-h, -h, -h + radius, -h)
  const g = new THREE.ShapeGeometry(s, 8)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + h) / size, (pos.getY(i) + h) / size)
  }
  uv.needsUpdate = true
  return g
}

function grooveCanvas() {
  const c = document.createElement('canvas')
  c.width = c.height = 1024
  const g = c.getContext('2d')!
  g.fillStyle = '#1c1c1c'
  g.fillRect(0, 0, 1024, 1024)
  for (let r = 200; r < 506; r += 2.4) {
    g.strokeStyle = `rgba(255,255,255,${0.05 + ((r * 7919) % 100) / 100 * 0.1})`
    g.lineWidth = 1.1
    g.beginPath()
    g.arc(512, 512, r, 0, Math.PI * 2)
    g.stroke()
  }
  for (const r of [262, 331, 398, 452]) {
    g.strokeStyle = 'rgba(0,0,0,0.95)'
    g.lineWidth = 4
    g.beginPath()
    g.arc(512, 512, r, 0, Math.PI * 2)
    g.stroke()
  }
  return c
}

/** two bright wedges, kept still while the record turns under them, like light on real vinyl */
function sheenCanvas() {
  const c = document.createElement('canvas')
  c.width = c.height = 1024
  const g = c.getContext('2d')!
  const cone = g.createConicGradient(0.35, 512, 512)
  const stops: [number, number][] = [
    [0, 0], [0.04, 0.12], [0.085, 0.5], [0.13, 0.12], [0.17, 0],
    [0.5, 0], [0.54, 0.1], [0.585, 0.4], [0.63, 0.1], [0.67, 0], [1, 0],
  ]
  for (const [o, a] of stops) cone.addColorStop(o, `rgba(255,255,255,${a})`)
  g.fillStyle = cone
  g.fillRect(0, 0, 1024, 1024)
  g.globalCompositeOperation = 'destination-in'
  const mask = g.createRadialGradient(512, 512, 190, 512, 512, 510)
  mask.addColorStop(0, 'rgba(0,0,0,0)')
  mask.addColorStop(0.03, 'rgba(0,0,0,1)')
  mask.addColorStop(0.97, 'rgba(0,0,0,1)')
  mask.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = mask
  g.fillRect(0, 0, 1024, 1024)
  return c
}

function glowCanvas() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')!
  const r = g.createRadialGradient(256, 256, 0, 256, 256, 256)
  r.addColorStop(0, 'rgba(255,155,138,0.42)')
  r.addColorStop(0.5, 'rgba(255,155,138,0.12)')
  r.addColorStop(1, 'rgba(255,155,138,0)')
  g.fillStyle = r
  g.fillRect(0, 0, 512, 512)
  return c
}

function labelCanvas() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(200, 180, 20, 256, 256, 256)
  grad.addColorStop(0, '#ffc3b8')
  grad.addColorStop(1, '#ff8d7b')
  g.fillStyle = grad
  g.beginPath()
  g.arc(256, 256, 256, 0, Math.PI * 2)
  g.fill()
  g.strokeStyle = 'rgba(42,15,11,0.25)'
  g.lineWidth = 3
  g.beginPath()
  g.arc(256, 256, 236, 0, Math.PI * 2)
  g.stroke()
  g.save()
  g.translate(256, 256)
  g.scale(0.4, 0.4)
  g.translate(-512, -512)
  g.fillStyle = '#2a0f0b'
  for (const d of RS_PATHS) g.fill(new Path2D(d), 'evenodd')
  g.restore()
  g.fillStyle = '#151515'
  g.beginPath()
  g.arc(256, 256, 11, 0, Math.PI * 2)
  g.fill()
  return c
}

export default function HeroScene({ onFail }: { onFail?: () => void }) {
  const mount = useRef<HTMLDivElement>(null)
  const { playing } = usePlayback()
  const playingRef = useRef(playing)
  const failRef = useRef(onFail)
  failRef.current = onFail

  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  useEffect(() => {
    const el = mount.current
    if (!el) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      failRef.current?.()
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60)
    camera.position.set(0, 0, 11)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envMap

    const key = new THREE.DirectionalLight(0xff9b8a, 2.4)
    key.position.set(4, 3, 5)
    const fill = new THREE.DirectionalLight(0xffffff, 1.1)
    fill.position.set(-4, 2, 3)
    scene.add(key, fill, new THREE.AmbientLight(0xffffff, 0.25))

    const disposables: { dispose: () => void }[] = [envMap, pmrem]
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o)
      return o
    }

    const world = new THREE.Group()
    scene.add(world)

    /* ---------- the record ---------- */
    const grooves = track(new THREE.CanvasTexture(grooveCanvas()))
    grooves.colorSpace = THREE.SRGBColorSpace
    grooves.anisotropy = renderer.capabilities.getMaxAnisotropy()
    const bump = track(new THREE.CanvasTexture(grooveCanvas()))

    const sideMat = track(new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, metalness: 0.4, roughness: 0.35 }))
    const topMat = track(
      new THREE.MeshPhysicalMaterial({
        map: grooves,
        bumpMap: bump,
        bumpScale: 1.6,
        color: 0xffffff,
        metalness: 0.55,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
        envMapIntensity: 1.5,
      }),
    )
    const discGeo = track(new THREE.CylinderGeometry(1.75, 1.75, 0.07, 160, 1))
    const disc = new THREE.Mesh(discGeo, [sideMat, topMat, sideMat])

    const labelTex = track(new THREE.CanvasTexture(labelCanvas()))
    labelTex.colorSpace = THREE.SRGBColorSpace
    labelTex.anisotropy = 8
    const labelGeo = track(new THREE.CircleGeometry(0.64, 64))
    const labelMat = track(new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.5, metalness: 0.1 }))
    const label = new THREE.Mesh(labelGeo, labelMat)
    label.rotation.x = -Math.PI / 2
    label.position.y = 0.037

    const spin = new THREE.Group()
    spin.add(disc, label)
    const vinyl = new THREE.Group()
    vinyl.rotation.x = Math.PI / 2
    vinyl.add(spin)

    const sheenTex = track(new THREE.CanvasTexture(sheenCanvas()))
    const sheenGeo = track(new THREE.CircleGeometry(1.75, 128))
    const sheenMat = track(
      new THREE.MeshBasicMaterial({
        map: sheenTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    )
    const sheen = new THREE.Mesh(sheenGeo, sheenMat)
    sheen.rotation.x = -Math.PI / 2
    sheen.position.y = 0.0365
    vinyl.add(sheen)
    world.add(vinyl)

    const glowTex = track(new THREE.CanvasTexture(glowCanvas()))
    const glowGeo = track(new THREE.PlaneGeometry(5.4, 5.4))
    const glowMat = track(
      new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    )
    const glow = new THREE.Mesh(glowGeo, glowMat)
    glow.position.z = -1.6
    world.add(glow)

    /* ---------- sound rings behind the record ---------- */
    const ringGeo = track(new THREE.RingGeometry(1.0, 1.018, 160))
    const rings = [0, 1, 2].map(() => {
      const m = track(new THREE.MeshBasicMaterial({ color: 0xff9b8a, transparent: true, opacity: 0, depthWrite: false }))
      const mesh = new THREE.Mesh(ringGeo, m)
      mesh.position.z = -0.4
      world.add(mesh)
      return mesh
    })

    /* ---------- floating covers ---------- */
    const loader = new THREE.TextureLoader()
    const covers = LAYOUT.map(([x, y, z, size, tilt, depth], i) => {
      const tex = track(loader.load(COVERS[i % COVERS.length]))
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      const mat = track(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0, envMapIntensity: 0.5 }))
      const geo = track(roundedPlane(size, size * 0.09))
      const m = new THREE.Mesh(geo, mat)
      m.position.set(x, y, z)
      m.rotation.set(0, tilt, 0)
      world.add(m)
      return { m, x, y, z, tilt, depth, phase: i * 1.7 }
    })

    /* ---------- sizing ---------- */
    let width = 1
    let height = 1
    const resize = () => {
      const r = el.getBoundingClientRect()
      width = Math.max(1, Math.round(r.width))
      height = Math.max(1, Math.round(r.height))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
      const visW = visH * camera.aspect
      const fit = Math.min(1.1, visW / 6.9, visH / 6.6)
      world.userData.fit = fit
      camera.updateProjectionMatrix()
      if (reduced) render()
    }

    /* ---------- state ---------- */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      pointer.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      pointer.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
    }
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
    io.observe(el)

    let spinSpeed = reduced ? 0 : 1.1
    let spinVel = spinSpeed
    let ringsOn = 1
    const clock = new THREE.Clock()
    let intro = reduced ? 1 : 0
    let raf = 0

    function render() {
      const fit = (world.userData.fit as number) ?? 1
      const sy = reduced ? 0 : Math.min(1, window.scrollY / (window.innerHeight * 0.9))
      world.scale.setScalar(fit * (0.9 + 0.1 * easeOut(intro)))
      world.position.y = sy * 0.8
      world.position.z = (1 - easeOut(intro)) * -3
      world.rotation.y = (1 - easeOut(intro)) * 0.9 + pointer.x * 0.32 + sy * 0.35
      world.rotation.x = pointer.y * 0.16 - sy * 0.2
      vinyl.rotation.z = -0.28 // tilt of the record
      renderer.render(scene, camera)
    }
    const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, t), 3)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden) return
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime
      intro = Math.min(1, intro + dt / 1.5)

      const on = playingRef.current
      spinSpeed = on ? 1.1 : 0
      spinVel += (spinSpeed - spinVel) * Math.min(1, dt * 2.2)
      spin.rotation.y -= spinVel * dt
      ringsOn += ((on ? 1 : 0.15) - ringsOn) * Math.min(1, dt * 2)

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4)
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4)

      rings.forEach((r, i) => {
        const ph = ((t * (on ? 0.32 : 0.12) + i / rings.length) % 1 + 1) % 1
        r.scale.setScalar(1.25 + ph * 1.5)
        ;(r.material as THREE.MeshBasicMaterial).opacity = (1 - ph) * 0.32 * ringsOn
      })

      covers.forEach((c) => {
        c.m.position.x = c.x + pointer.x * 0.22 * c.depth
        c.m.position.y = c.y + Math.sin(t * 0.8 + c.phase) * 0.09 - pointer.y * 0.16 * c.depth
        c.m.rotation.y = c.tilt + Math.sin(t * 0.5 + c.phase) * 0.05
        c.m.rotation.x = Math.cos(t * 0.45 + c.phase) * 0.035
      })
      render()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()
    if (reduced) {
      // a still frame once the covers have loaded
      const t = window.setTimeout(render, 600)
      disposables.push({ dispose: () => window.clearTimeout(t) })
    } else {
      raf = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mount} className="absolute inset-0 data-[failed=true]:hidden" />
}
