"use client"

import { useRef, useState, useEffect, useCallback } from "react"

type Props = {
  children: React.ReactNode[]
  gap?: number
  paddingX?: number
  /** スマホ（640px未満）での横パディング。未指定時は paddingX を使用 */
  mobilePaddingX?: number
  className?: string
  /** 暗い背景に置く場合 true */
  dark?: boolean
}

export function HorizontalCarousel({
  children,
  gap = 24,
  paddingX = 48,
  mobilePaddingX,
  className = "",
  dark = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [effectivePx, setEffectivePx] = useState(paddingX)

  useEffect(() => {
    const update = () => {
      setEffectivePx(window.innerWidth < 640 && mobilePaddingX != null ? mobilePaddingX : paddingX)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [paddingX, mobilePaddingX])

  // drag-to-scroll
  const dragState = useRef({ down: false, startX: 0, startScroll: 0, moved: 0 })
  const [dragging, setDragging] = useState(false)

  const updateProgress = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateProgress()
    el.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)
    return () => {
      el.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [updateProgress])

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current
    if (!el || e.pointerType === "touch") return // タッチはネイティブ慣性に任せる
    dragState.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, moved: 0 }
    setDragging(true)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollRef.current
    const s = dragState.current
    if (!el || !s.down) return
    const dx = e.clientX - s.startX
    s.moved = Math.max(s.moved, Math.abs(dx))
    el.scrollLeft = s.startScroll - dx
  }

  const endDrag = () => {
    dragState.current.down = false
    setDragging(false)
  }

  // ドラッグ直後のクリック(リンク遷移)を抑止
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.moved > 6) {
      e.preventDefault()
      e.stopPropagation()
    }
    dragState.current.moved = 0
  }

  const trackColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"
  const fillColor = dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)"

  return (
    <div className={className}>
      {/* Scroll track */}
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="flex overflow-x-auto select-none"
        style={{
          gap,
          paddingLeft: effectivePx,
          paddingRight: effectivePx,
          cursor: dragging ? "grabbing" : "grab",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {children.map((child, i) => (
          <div key={i} data-card style={{ flexShrink: 0 }} className={dragging ? "pointer-events-none" : ""}>
            {child}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="mt-10 lg:mt-14 relative h-px"
        style={{ marginLeft: effectivePx, marginRight: effectivePx, backgroundColor: trackColor }}
      >
        <div
          className="absolute top-0 left-0 h-px transition-[width] duration-150 ease-out"
          style={{ width: `${Math.max(8, progress * 100)}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  )
}
