"use client"

import { useEffect, useRef, useState } from "react"
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
 * - SP は軽量 mp4 をクライアントで選択してから読み込む
 * - faststart 済みファイル前提で再生開始を早める
 */
export function ResponsiveBackgroundVideo({
  src,
  mobileSrc,
  poster,
  className,
  priority = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [videoSrc, setVideoSrc] = useState<string | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const pick = () => setVideoSrc(mq.matches ? mobileSrc : src)
    pick()
    mq.addEventListener("change", pick)
    return () => mq.removeEventListener("change", pick)
  }, [src, mobileSrc])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    setReady(false)
    const markReady = () => setReady(true)
    video.addEventListener("playing", markReady)
    video.addEventListener("loadeddata", markReady)

    video.load()
    const p = video.play()
    if (p) p.catch(() => {})

    return () => {
      video.removeEventListener("playing", markReady)
      video.removeEventListener("loadeddata", markReady)
    }
  }, [videoSrc])

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
      {videoSrc && (
        <video
          ref={videoRef}
          key={videoSrc}
          muted
          autoPlay
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
          poster={poster}
          src={videoSrc}
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  )
}
