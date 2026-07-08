"use client"

// 木漏れ日のように画面上部から差し込む光線の WebGL オーバーレイ。
// 透過キャンバスとして写真の上に重ねて使う。
import { useEffect, useRef } from "react"
import { Renderer, Program, Mesh, Triangle } from "ogl"

type LightRaysProps = {
  className?: string
  /** 光の色 (hex) */
  color?: string
  /** 全体の強さ 0–1 */
  opacity?: number
  /** 揺らめく速さ */
  speed?: number
  /** 光源の水平位置 0(左)–1(右) */
  originX?: number
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
uniform float uOriginX;

varying vec2 vUv;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

// 光源からの角度に応じた放射状の縞 (木漏れ日の光線)
float rayBand(vec2 src, vec2 coord, float freq, float phase, float drift) {
  vec2 d = coord - src;
  float ang = atan(d.x, d.y);
  // ゆっくり揺れる縞。sin 2波の干渉で不均一な太さにする
  float band =
    sin(ang * freq + phase + drift) * 0.6 +
    sin(ang * freq * 0.37 + phase * 1.7 - drift * 0.6) * 0.4;
  band = smoothstep(0.05, 0.95, band);
  float dist = length(d) / iResolution.y;
  float fall = exp(-dist * 0.42);
  return band * fall;
}

void main() {
  // ピクセル座標 (上が0になるよう反転)
  vec2 coord = vec2(vUv.x * iResolution.x, (1.0 - vUv.y) * iResolution.y);
  float t = iTime * uSpeed * 10.0;

  // 光源は画面上端の少し外。2層の光線をずらして重ねる
  vec2 src1 = vec2(iResolution.x * uOriginX, -iResolution.y * 0.42);
  vec2 src2 = vec2(iResolution.x * (uOriginX - 0.22), -iResolution.y * 0.62);

  float rays =
    rayBand(src1, coord, 34.0, 1.7, t) * 0.62 +
    rayBand(src2, coord, 21.0, 4.2, -t * 0.7) * 0.48;

  // 上ほど明るく、下に向かって減衰
  float vfade = mix(1.0, 0.28, smoothstep(0.02, 0.92, 1.0 - vUv.y));
  rays *= vfade;

  rays = pow(clamp(rays, 0.0, 1.0), 1.1);

  float a = clamp(rays * uOpacity, 0.0, 1.0);
  // ogl の canvas は premultipliedAlpha: false なので straight alpha で出力する
  gl_FragColor = vec4(uColor, a);
}
`

export function LightRays({
  className = "",
  color = "#fff3da",
  opacity = 0.8,
  speed = 0.06,
  originX = 0.72,
}: LightRaysProps) {
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
      uOriginX: { value: originX },
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
      uniforms.iTime.value = t * 0.001
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
