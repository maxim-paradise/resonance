'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RS_PATH } from './logo'

/*
 * One canvas for the whole hero: a field of dots that ripples like water behind, and a dark chrome
 * sphere in front whose surface carries two interfering waves, one per service. The sphere sits on
 * the element with id="hero-anchor"; the canvas ignores the pointer and listens on the window.
 * prefers-reduced-motion is deliberately not honoured (see motion.tsx).
 */

const SPHERE_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform vec3 uPointer;
  uniform float uPointerGain;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec2 vUv;
  varying float vH;

  const vec3 SRC_A = vec3(-0.80, 0.22, 0.56);
  const vec3 SRC_B = vec3( 0.80, -0.12, 0.58);

  float height(vec3 n) {
    vec3 a = normalize(SRC_A);
    vec3 b = normalize(SRC_B);
    float da = acos(clamp(dot(n, a), -1.0, 1.0));
    float db = acos(clamp(dot(n, b), -1.0, 1.0));
    float wa = sin(da * 19.0 - uTime * 1.7) / (1.0 + da * 2.4);
    float wb = sin(db * 19.0 - uTime * 1.9 + 1.2) / (1.0 + db * 2.4);
    float h = (wa + wb) * 0.5;
    // the pointer is a tuning fork: the side it points at swells
    float near = smoothstep(0.2, 1.0, dot(n, normalize(uPointer)));
    return h * (1.0 + uPointerGain * near);
  }

  vec3 displaced(vec3 n) {
    return n * (1.0 + uAmp * height(n));
  }

  void main() {
    vec3 n = normalize(position);
    vec3 t = normalize(cross(n, vec3(0.0, 1.0, 0.013)));
    vec3 b = cross(n, t);
    float e = 0.012;
    vec3 p0 = displaced(n);
    vec3 p1 = displaced(normalize(n + t * e));
    vec3 p2 = displaced(normalize(n + b * e));
    vNormal = normalize(normalMatrix * normalize(cross(p1 - p0, p2 - p0)));
    vH = height(n);
    vUv = uv;
    vec4 world = modelMatrix * vec4(p0, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const SPHERE_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uCoral;
  uniform sampler2D uLogo;
  uniform float uLogoU;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec2 vUv;
  varying float vH;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vWorld);
    if (dot(N, V) < 0.0) N = -N;
    vec3 R = reflect(-V, N);

    // a little studio: a soft top box, a coral kicker low on the left, a cold fill on the right
    float top = pow(max(dot(R, normalize(vec3(0.2, 1.0, 0.5))), 0.0), 7.0);
    float side = pow(max(dot(R, normalize(vec3(1.0, 0.1, 0.3))), 0.0), 16.0);
    float kick = pow(max(dot(R, normalize(vec3(-0.9, -0.5, 0.5))), 0.0), 9.0);
    float horizon = smoothstep(-0.2, 0.9, R.y);

    vec3 col = mix(vec3(0.035), vec3(0.17, 0.17, 0.18), horizon);
    col += vec3(0.80, 0.82, 0.86) * top * 0.55;
    col += vec3(0.60, 0.66, 0.75) * side * 0.35;
    col += uCoral * kick * 0.5;

    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col += uCoral * fres * 0.55;

    // crests glow coral where the two waves reinforce each other
    float crest = smoothstep(0.35, 1.0, vH);
    col += uCoral * crest * 0.14;

    // the RS mark, pressed into the front of the sphere
    vec2 lp = vec2((vUv.x - uLogoU) * 7.0 + 0.5, (vUv.y - 0.5) * 3.5 + 0.5);
    float inside = step(0.0, lp.x) * step(lp.x, 1.0) * step(0.0, lp.y) * step(lp.y, 1.0);
    float mark = texture2D(uLogo, lp).a * inside;
    col = mix(col, uCoral * 0.9, mark * 0.72);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

const BG_VERT = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const BG_FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;       // in device pixels
  uniform float uTime;
  uniform float uDpr;
  uniform vec2 uSphere;    // sphere centre, device px, y down
  uniform float uSphereR;
  uniform vec2 uPointer;   // device px, y down, negative when away
  uniform float uPointerOn;
  uniform vec3 uCoral;

  float ring(vec2 p, vec2 c, float k, float speed, float phase, float decay) {
    float d = length(p - c);
    return sin(d * k - uTime * speed + phase) * exp(-d * decay);
  }

  void main() {
    vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
    float cell = 24.0 * uDpr;
    vec2 g = floor(frag / cell);
    vec2 centre = (g + 0.5) * cell;
    vec2 off = frag - centre;

    float R = uSphereR;
    // two sources either side of the sphere: the two services
    float w = 0.0;
    w += ring(centre, uSphere + vec2(-0.55 * R, 0.0), 0.021 / uDpr, 1.5, 0.0, 0.0016 / uDpr);
    w += ring(centre, uSphere + vec2( 0.55 * R, 0.0), 0.021 / uDpr, 1.5, 1.9, 0.0016 / uDpr);
    // the pointer drops its own small ripples
    w += uPointerOn * 0.7 * ring(centre, uPointer, 0.05 / uDpr, 3.2, 0.0, 0.0065 / uDpr);
    w *= 0.62;

    // nothing under the sphere itself, it is drawn on top and would show through its edge
    float dS = length(centre - uSphere);
    float clear = smoothstep(R * 0.92, R * 1.35, dS);

    float crest = clamp(w * 0.5 + 0.5, 0.0, 1.0);
    float radius = (1.1 + 1.9 * crest * crest) * uDpr;
    float d = length(off);
    float dotA = 1.0 - smoothstep(radius - 0.8 * uDpr, radius + 0.4 * uDpr, d);

    // soft vignette so the field dies out towards the edges of the hero
    vec2 uv = frag / uRes;
    float edge = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x) * smoothstep(1.0, 0.72, uv.y);

    float lift = clamp(w, 0.0, 1.0);
    vec3 grey = vec3(0.62, 0.62, 0.64);
    vec3 col = mix(grey, uCoral, pow(lift, 1.4) * 0.95);
    float a = dotA * clear * edge * (0.16 + 0.7 * crest * crest);
    gl_FragColor = vec4(col, a);
  }
`

function logoCanvas() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')!
  g.translate(256, 256)
  g.scale(0.4, 0.4)
  g.translate(-512, -512)
  g.fillStyle = '#fff'
  g.fill(new Path2D(RS_PATH), 'evenodd')
  return c
}

export default function HeroScene({ onFail }: { onFail?: () => void }) {
  const mount = useRef<HTMLDivElement>(null)
  const failRef = useRef(onFail)
  failRef.current = onFail

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

    const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2)
    renderer.setPixelRatio(dpr)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.autoClear = false
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'
    el.appendChild(renderer.domElement)

    const coral = new THREE.Color('#ff9b8a')
    const disposables: { dispose: () => void }[] = []
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o)
      return o
    }

    /* ---------- background: a full-screen quad drawn first ---------- */
    const bgScene = new THREE.Scene()
    const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const bgUniforms = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uDpr: { value: dpr },
      uSphere: { value: new THREE.Vector2(0, 0) },
      uSphereR: { value: 100 },
      uPointer: { value: new THREE.Vector2(-9999, -9999) },
      uPointerOn: { value: 0 },
      uCoral: { value: new THREE.Vector3(coral.r, coral.g, coral.b) },
    }
    const bgMat = track(
      new THREE.ShaderMaterial({
        vertexShader: BG_VERT,
        fragmentShader: BG_FRAG,
        uniforms: bgUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    )
    const bgGeo = track(new THREE.PlaneGeometry(2, 2))
    bgScene.add(new THREE.Mesh(bgGeo, bgMat))

    /* ---------- the sphere ---------- */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
    camera.position.set(0, 0, 10)

    const logoTex = track(new THREE.CanvasTexture(logoCanvas()))
    logoTex.anisotropy = 8
    const sphereUniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.034 },
      uPointer: { value: new THREE.Vector3(0, 0, 1) },
      uPointerGain: { value: 0 },
      uCoral: { value: new THREE.Vector3(coral.r, coral.g, coral.b) },
      uLogo: { value: logoTex },
      uLogoU: { value: 0.25 },
    }
    const sphereMat = track(
      new THREE.ShaderMaterial({ vertexShader: SPHERE_VERT, fragmentShader: SPHERE_FRAG, uniforms: sphereUniforms }),
    )
    const segs = coarse ? 96 : 192
    const sphereGeo = track(new THREE.SphereGeometry(1, segs, segs))
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    const holder = new THREE.Group()
    holder.add(sphere)
    scene.add(holder)

    /* soft coral halo behind the sphere */
    const haloCanvas = document.createElement('canvas')
    haloCanvas.width = haloCanvas.height = 256
    {
      const g = haloCanvas.getContext('2d')!
      const r = g.createRadialGradient(128, 128, 0, 128, 128, 128)
      r.addColorStop(0, 'rgba(255,155,138,0.34)')
      r.addColorStop(0.55, 'rgba(255,155,138,0.07)')
      r.addColorStop(1, 'rgba(255,155,138,0)')
      g.fillStyle = r
      g.fillRect(0, 0, 256, 256)
    }
    const haloTex = track(new THREE.CanvasTexture(haloCanvas))
    const haloMat = track(
      new THREE.MeshBasicMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
    )
    const haloGeo = track(new THREE.PlaneGeometry(1, 1))
    const halo = new THREE.Mesh(haloGeo, haloMat)
    halo.scale.setScalar(4.6)
    halo.position.z = -1.4
    holder.add(halo)

    /* ---------- layout: the sphere sits on the anchor element ---------- */
    let wPx = 1
    let hPx = 1
    const anchorPx = { x: 0, y: 0, r: 100 }
    const layout = () => {
      const box = el.getBoundingClientRect()
      wPx = Math.max(1, Math.round(box.width))
      hPx = Math.max(1, Math.round(box.height))
      renderer.setSize(wPx, hPx, false)
      camera.aspect = wPx / hPx
      camera.updateProjectionMatrix()
      bgUniforms.uRes.value.set(wPx * dpr, hPx * dpr)

      const a = document.getElementById('hero-anchor')?.getBoundingClientRect()
      const ax = a ? a.left + a.width / 2 - box.left : wPx * 0.72
      const ay = a ? a.top + a.height / 2 - box.top : hPx * 0.5
      const r = a ? Math.min(a.width, a.height) * 0.36 : Math.min(wPx, hPx) * 0.3
      anchorPx.x = ax
      anchorPx.y = ay
      anchorPx.r = Math.max(60, r)

      const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
      const perPx = visH / hPx
      holder.position.set((ax - wPx / 2) * perPx, -(ay - hPx / 2) * perPx, 0)
      holder.scale.setScalar(anchorPx.r * perPx)
      bgUniforms.uSphere.value.set(ax * dpr, ay * dpr)
      bgUniforms.uSphereR.value = anchorPx.r * dpr
    }

    /* ---------- pointer and scroll ---------- */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, on: 0, ton: 0, px: -9999, py: -9999 }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const box = el.getBoundingClientRect()
      const x = e.clientX - box.left
      const y = e.clientY - box.top
      const inside = y >= 0 && y <= box.height
      pointer.px = x
      pointer.py = y
      pointer.ton = inside ? 1 : 0
      pointer.tx = Math.max(-1, Math.min(1, (x - anchorPx.x) / (wPx * 0.5)))
      pointer.ty = Math.max(-1, Math.min(1, (y - anchorPx.y) / (hPx * 0.5)))
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
    io.observe(el)

    const ro = new ResizeObserver(layout)
    ro.observe(el)
    const anchor = document.getElementById('hero-anchor')
    if (anchor) ro.observe(anchor)
    layout()

    const clock = new THREE.Clock()
    let intro = 0
    let raf = 0
    const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, t), 3)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden) return
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime
      intro = Math.min(1, intro + dt / 1.6)
      const k = easeOut(intro)

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4)
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4)
      pointer.on += (pointer.ton - pointer.on) * Math.min(1, dt * 3)

      const scroll = Math.min(1, window.scrollY / (window.innerHeight * 0.9))

      sphereUniforms.uTime.value = t
      sphereUniforms.uAmp.value = 0.034 * (0.3 + 0.7 * k)
      sphereUniforms.uPointer.value.set(pointer.x * 1.4, -pointer.y * 1.4, 1)
      sphereUniforms.uPointerGain.value = 0.9 * pointer.on

      // the sphere turns a little towards the pointer and with the scroll, never away from the mark
      holder.rotation.y = pointer.x * 0.32 + scroll * 0.5 + (1 - k) * 0.9
      holder.rotation.x = pointer.y * 0.18 - scroll * 0.25
      const base = anchorPx.r
      holder.scale.setScalar((base * (0.82 + 0.18 * k) * (visHeightPerPx())) )

      bgUniforms.uTime.value = t
      bgUniforms.uPointer.value.set(pointer.px * dpr, pointer.py * dpr)
      bgUniforms.uPointerOn.value = pointer.on

      renderer.clear()
      renderer.render(bgScene, bgCam)
      renderer.clearDepth()
      renderer.render(scene, camera)
    }

    function visHeightPerPx() {
      const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
      return visH / hPx
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mount} className="absolute inset-0" />
}
