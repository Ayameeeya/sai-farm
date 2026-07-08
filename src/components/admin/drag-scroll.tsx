"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  children: React.ReactNode
}

/**
 * 横スクロールコンテナ。タッチはネイティブスクロール、
 * マウスはリストの途中を掴んでドラッグスクロールできる。
 * ドラッグした場合は行リンクのクリックを抑止する。
 */
export function DragScroll({ className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 })

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return
    // フォーム部品上からのドラッグは無効（select のドロップダウン等を邪魔しない）
    if ((e.target as HTMLElement).closest("select, input, textarea, button")) return
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startLeft: ref.current?.scrollLeft ?? 0,
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = ref.current
    if (!d.active || !el) return
    const dx = e.clientX - d.startX
    if (!d.moved) {
      if (Math.abs(dx) < 5) return
      d.moved = true
      el.setPointerCapture(e.pointerId)
    }
    el.scrollLeft = d.startLeft - dx
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    d.active = false
    if (d.moved) {
      ref.current?.releasePointerCapture(e.pointerId)
      // click はこの直後に同期発火するので、その後にフラグを戻す
      setTimeout(() => {
        drag.current.moved = false
      }, 0)
    }
  }

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
      className={cn("select-none overflow-x-auto", className)}
    >
      {children}
    </div>
  )
}
