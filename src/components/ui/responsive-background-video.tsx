"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  /** PC向け（〜1280px） */
  src: string
  /** スマホ向け軽量版 */
  mobileSrc: string
  poster: string
  className?: string
  /** ファーストビューなら true（即時再生を優先） */
  priority?: boolean
}

/**
 * 背景ループ動画。
 * - poster を先に見せて空白を防ぐ
 * - media 属性付き source を HTML に出し、hydration 前から端末別に読み込む
 * - faststart 済みファイル前提で再生開始を早める
 */
export function ResponsiveBackgroundVideo({
  src,
  mobileSrc,
  poster,
  className,
  priority = false,
}: Props) {
  const [ready, setReady] = useState(false)

  return (
    <div className={cn("absolute inset-0", className)}>
      {/* poster を常に背面に置き、動画が来るまで空白にしない */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          ready ? "opacity-0" : "opacity-100",
        )}
      />
      <video
        muted
        autoPlay
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        poster={poster}
        aria-hidden
        onLoadedData={() => setReady(true)}
        onPlaying={() => setReady(true)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        <source src={mobileSrc} type="video/mp4" media="(max-width: 767px)" />
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
