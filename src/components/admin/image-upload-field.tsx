"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { X, UploadCloud, LoaderCircle, ImageIcon } from "lucide-react"
import { uploadImages } from "@/app/admin/actions"

const cnDrop = (active: boolean) =>
  `flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[8px] border border-dashed px-6 py-8 text-center transition-colors ${
    active ? "border-black bg-black/[0.03]" : "border-black/20 hover:border-black/40"
  }`

type Props = {
  images: string[]
  onChange: (images: string[]) => void
  label?: string
  /** 1枚だけの場合は並び替えを非表示 */
  single?: boolean
}

export function ImageUploadField({ images, onChange, label, single = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // ドラッグ並び替え中のタイル index（null なら非ドラッグ）
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const onFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (!list.length) return
    setError(null)
    setUploading(true)
    const formData = new FormData()
    list.forEach((f) => formData.append("files", f))
    const result = await uploadImages(formData)
    setUploading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (result.urls) {
      onChange(single ? result.urls.slice(0, 1) : [...images, ...result.urls])
    }
  }

  /** ドラッグ中のタイルが別のタイルに重なったら、その位置へ挿入して並び替える */
  const reorderTo = (target: number) => {
    if (dragIndex === null || dragIndex === target) return
    const next = [...images]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(target, 0, moved)
    setDragIndex(target)
    onChange(next)
  }

  // 最新の reorderTo をネイティブリスナーから呼ぶための参照
  const reorderRef = useRef(reorderTo)
  reorderRef.current = reorderTo

  // タッチ端末: 長押しでドラッグ開始 → 指を動かして並び替え
  // （touchmove の preventDefault が必要なため React ハンドラではなく非 passive で登録）
  const hasImages = images.length > 0
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || single) return

    let timer: ReturnType<typeof setTimeout> | null = null
    let active = false
    let startX = 0
    let startY = 0

    const indexFromPoint = (x: number, y: number) => {
      const tile = document.elementFromPoint(x, y)?.closest("[data-image-tile]")
      if (!tile) return -1
      return [...grid.querySelectorAll("[data-image-tile]")].indexOf(tile)
    }

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      const idx = indexFromPoint(t.clientX, t.clientY)
      if (idx < 0) return
      startX = t.clientX
      startY = t.clientY
      timer = setTimeout(() => {
        active = true
        setDragIndex(idx)
        navigator.vibrate?.(10)
      }, 300)
    }

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!active) {
        // 長押し前に動いたら通常スクロールとして扱う
        if (timer && Math.hypot(t.clientX - startX, t.clientY - startY) > 10) {
          clearTimeout(timer)
          timer = null
        }
        return
      }
      e.preventDefault()
      const idx = indexFromPoint(t.clientX, t.clientY)
      if (idx >= 0) reorderRef.current(idx)
    }

    const onTouchEnd = () => {
      if (timer) clearTimeout(timer)
      timer = null
      if (active) {
        active = false
        setDragIndex(null)
      }
    }

    grid.addEventListener("touchstart", onTouchStart, { passive: true })
    grid.addEventListener("touchmove", onTouchMove, { passive: false })
    grid.addEventListener("touchend", onTouchEnd)
    grid.addEventListener("touchcancel", onTouchEnd)
    return () => {
      if (timer) clearTimeout(timer)
      grid.removeEventListener("touchstart", onTouchStart)
      grid.removeEventListener("touchmove", onTouchMove)
      grid.removeEventListener("touchend", onTouchEnd)
      grid.removeEventListener("touchcancel", onTouchEnd)
    }
  }, [single, hasImages])

  return (
    <div>
      {label && <p className="mb-3 text-[13px] font-medium text-black/70">{label}</p>}

      {images.length > 0 && (
        <div
          ref={gridRef}
          className={
            single
              ? "mb-3"
              : "mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5"
          }
        >
          {images.map((url, i) => (
            <div
              key={url}
              data-image-tile
              draggable={!single}
              onDragStart={(e) => {
                setDragIndex(i)
                e.dataTransfer.effectAllowed = "move"
                // Firefox はデータがないとドラッグが始まらない
                e.dataTransfer.setData("text/plain", String(i))
              }}
              onDragEnter={(e) => {
                e.preventDefault()
                reorderTo(i)
              }}
              onDragOver={(e) => {
                if (dragIndex !== null) e.preventDefault()
              }}
              onDragEnd={() => setDragIndex(null)}
              onDrop={(e) => {
                if (dragIndex !== null) e.preventDefault()
              }}
              className={`group relative overflow-hidden rounded-[6px] bg-black/5 ring-1 ring-black/8 ${
                single ? "aspect-[16/10] max-w-[280px]" : "aspect-[4/3] cursor-grab active:cursor-grabbing"
              } ${dragIndex === i ? "opacity-40 ring-2 ring-black" : ""}`}
            >
              <Image src={url} alt="" fill draggable={false} className="pointer-events-none object-cover" sizes="160px" />
              {!single && i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-[4px] bg-black/70 px-1.5 py-0.5 text-[9px] text-white">
                  メイン
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                aria-label="この画像を削除"
              >
                <X size={13} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          onFiles(e.dataTransfer.files)
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cnDrop(dragOver)}
      >
        {uploading ? (
          <>
            <LoaderCircle size={20} strokeWidth={1.5} className="animate-spin text-black/40" />
            <p className="text-[12px] text-black/50">アップロード中…</p>
          </>
        ) : images.length && single ? (
          <>
            <ImageIcon size={18} strokeWidth={1.5} className="text-black/40" />
            <p className="text-[12px] text-black/50">クリックまたはドロップで差し替え</p>
          </>
        ) : (
          <>
            <UploadCloud size={20} strokeWidth={1.5} className="text-black/40" />
            <p className="text-[12px] text-black/50">
              ここに画像をドラッグ&ドロップ、またはクリックして選択
            </p>
            {!single && (
              <p className="text-[10.5px] text-black/35">複数枚まとめて追加できます</p>
            )}
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={!single}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) onFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </div>

      {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}
    </div>
  )
}
