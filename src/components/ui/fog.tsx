"use client"

// ドメインワープした fBm ノイズによる「流れる霧」の WebGL オーバーレイ。
// 透過キャンバスとして写真の上に重ねて使う。
import { useEffect, useRef } from "react"
import { Renderer, Program, Mesh, Triangle } from "ogl"

type FogProps = {
  className?: string
  /** 霧の色 (hex) */
  color?: string
  /** 全体の濃さ 0–1 */
  opacity?: number
  /** 流れる速さ */
  speed?: number
  /** 模様の細かさ (大きいほど細かい) */
  scale?: number
  /** 下端の濃さ 0–1 */
  alphaBottom?: number
  /** 上端の濃さ 0–1 */
  alphaTop?: number
  /** 濃さの下限しきい値 (下げるほど濃い霧) */
  thresholdLow?: number
  /** 濃さの上限しきい値 */
  thresholdHigh?: number
  /** ノイズ模様の初期位相 (秒)。ロード時の偏りを避けるために使う */
  timeOffset?: number
}

const hexToRGB = (hex: string): [number, number, number] => {
  const c = hex.replace("#", "").padEnd(6, "0")
  return [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ]
}

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `
precision highp float;

uniform vec3  iResolution;
uniform float iTime;
uniform vec3  uColor;
uniform float uOpacity;
uniform float uSpeed;
uniform float uScale;
uniform float uAlphaBottom;
uniform float uAlphaTop;
uniform float uThLow;
uniform float uThHigh;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = rot * p * 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv * vec2(iResolution.x / iResolution.y, 1.0) * uScale;
  float t = iTime * uSpeed;

  // ドメインワープで渦を巻くような揺らぎを作る
  vec2 q = vec2(
    fbm(p + vec2(t * 0.32, t * 0.04)),
    fbm(p + vec2(5.2, 1.3) + vec2(-t * 0.22, t * 0.06))
  );
  vec2 r = vec2(
    fbm(p + 2.4 * q + vec2(1.7, 9.2) + vec2(t * 0.12, 0.0)),
    fbm(p + 2.4 * q + vec2(8.3, 2.8) - vec2(t * 0.09, 0.0))
  );
  float f = fbm(p + 2.6 * r + vec2(t * 0.18, sin(t * 0.35) * 0.12));

  // 細かい霧をもう一層、逆方向に流す
  float f2 = fbm(p * 2.3 + vec2(-t * 0.4, t * 0.05) + r);
  f = f * 0.72 + f2 * 0.28;

  float fog = smoothstep(uThLow, uThHigh, f);
  fog = pow(fog, 1.1);

  // 下端と上端の濃さを個別に指定できる縦マスク
  float vmask = mix(uAlphaBottom, uAlphaTop, smoothstep(0.15, 0.95, uv.y));
  // 端はごくわずかに減衰させてタイル感を消す
  float xmask = smoothstep(0.0, 0.06, uv.x) * smoothstep(1.0, 0.94, uv.x);

  float a = clamp(fog * vmask * xmask * uOpacity, 0.0, 1.0);
  // ogl の canvas は premultipliedAlpha: false なので straight alpha で出力する
  gl_FragColor = vec4(uColor, a);
}
`

export function Fog({
  className = "",
  color = "#e9e2d3",
  opacity = 0.55,
  speed = 0.05,
  scale = 2.4,
  alphaBottom = 1,
  alphaTop = 0.35,
  thresholdLow = 0.42,
  thresholdHigh = 0.78,
  timeOffset = 0,
}: FogProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const visibleRef = useRef(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 画面外では GPU 描画をスキップ (複数設置時の負荷対策)
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
    })
    io.observe(container)

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      alpha: true,
      antialias: false,
    })
    const gl = renderer.gl
    const canvas = gl.canvas as HTMLCanvasElement
    gl.clearColor(0, 0, 0, 0)
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.display = "block"
    container.appendChild(canvas)

    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iTime: { value: 0 },
      uColor: { value: hexToRGB(color) },
      uOpacity: { value: opacity },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uAlphaBottom: { value: alphaBottom },
      uAlphaTop: { value: alphaTop },
      uThLow: { value: thresholdLow },
      uThHigh: { value: thresholdHigh },
    }

    const program = new Program(gl, { vertex, fragment, uniforms })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1]
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop)
      if (!visibleRef.current) return
      uniforms.iTime.value = timeOffset + t * 0.001
      renderer.render({ scene: mesh })
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      io.disconnect()
      ro.disconnect()
      if (canvas.parentElement === container) container.removeChild(canvas)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none relative h-full w-full overflow-hidden ${className}`}
      aria-hidden
    />
  )
}
