"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion"
import { MenuContent } from "@/components/top/menu-content"

const PILL_W     = 480   // ピル幅 (px)
export const BAR_H = 36   // バー高さ (px)
/** 白バー→ピル型ナビのページ用 padding-top（バーとコンテンツを密着） */
export const SCROLL_PAGE_PT = BAR_H
/** スティッキー要素用（スクロール後ピル位置 + 余白） */
export const STICKY_TOP = BAR_H + 24
const PILL_MT    = 10    // スクロール後の上マージン (px)
const PILL_RADIUS = 10   // スクロール後の角丸 (px) — 完全ピルより控えめ

const NAV_LINKS = [
  { href: "/properties/property-categories/land/", label: "土地を買う" },
  { href: "/properties/property-categories/house/", label: "住まいを買う" },
  { href: "/sales/", label: "売る" },
]

function useClipPath(
  progress: MotionValue<number>,
  sideInset: number
): MotionValue<string> {
  const side   = useTransform(progress, [0, 1], [0, sideInset])
  const radius = useTransform(progress, [0, 1], [0, PILL_RADIUS])
  return useTransform(
    [side, radius] as MotionValue<number>[],
    ([s, r]: number[]) => `inset(0px ${s}px 0px ${s}px round ${r}px)`
  )
}

export function TopPageNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [vw, setVw] = useState(1440)

  useEffect(() => {
    setVw(window.innerWidth)
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const { scrollY } = useScroll()
  const rawProgress = useTransform(scrollY, [0, 100], [0, 1], { clamp: true })
  const progress    = useSpring(rawProgress, { stiffness: 160, damping: 26, mass: 1 })

  const sideInset = Math.max(0, (vw - PILL_W) / 2)

  const clipPath   = useClipPath(progress, sideInset)
  const bgColor    = useTransform(progress, [0, 1], ["rgba(255,255,255,1)", "rgba(0,0,0,1)"])
  const translateY = useTransform(progress, [0, 1], [0, PILL_MT])

  // ── 初期コンテンツ の透明度 ──
  const topOpacity  = useTransform(progress, [0, 0.35], [1, 0])
  // ── ピルコンテンツ の透明度 ──
  const pillOpacity = useTransform(progress, [0.55, 0.9], [0, 1])
  const pillPointer = useTransform(progress, (v) => (v > 0.6 ? "auto" : "none"))

  return (
    <>
      {/* ─── 背景レイヤー ─── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
        style={{ height: BAR_H, backgroundColor: bgColor, clipPath, y: translateY }}
      />

      {/* ─── コンテンツレイヤー（clip-path + translateY を同期） ─── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[41]"
        style={{
          height: BAR_H,
          clipPath,
          y: translateY,
          fontFamily: "var(--font-barlow)",
          pointerEvents: "none",
        }}
      >
        {/* ══ 初期: 左右に広がった白ヘッダー ══ */}
        <motion.div
          className="absolute inset-0 flex items-center px-3 lg:px-5"
          style={{ opacity: topOpacity }}
        >
          {/* 左 */}
          <div className="flex-1 flex items-center gap-1.5">
            <span className="text-[7.5px] tracking-[0.18em] text-black/40 uppercase font-medium lg:text-[10px] lg:tracking-[0.25em]">
              Minami-Izu
            </span>
            <span className="text-black/20 text-[7.5px] lg:text-[10px]">|</span>
            <span className="text-[7.5px] tracking-[0.18em] text-black/40 uppercase font-medium lg:text-[10px] lg:tracking-[0.25em]">
              Real Estate
            </span>
          </div>
          {/* 中央ブランド */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2.5 text-[15px] lg:text-[16px] tracking-[0.35em] uppercase font-semibold text-black pointer-events-auto"
          >
            <Image
              src="/common/logo-mark-black.png"
              alt=""
              width={222}
              height={105}
              className="h-[16px] w-auto"
            />
            SAIFARM
          </Link>
          {/* 右スペーサー + Menu */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="メニュー"
              className="flex items-center gap-2 text-black pointer-events-auto"
            >
              <span className="text-[12px] tracking-[0.25em] uppercase font-semibold">Menu</span>
              <span className="flex flex-col gap-[4px]">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block w-[16px] h-px bg-current" />
                ))}
              </span>
            </button>
          </div>
        </motion.div>

        {/* ══ ピル: 中央に収束した黒バー ══ */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: pillOpacity, pointerEvents: pillPointer }}
        >
          <div className="flex items-center gap-3 lg:gap-4">
            {/* ロゴマーク */}
            <Link href="/" className="pointer-events-auto">
              <Image
                src="/common/logo-mark-white.png"
                alt="Saifarm"
                width={222}
                height={105}
                className="h-[15px] w-auto"
              />
            </Link>

            <span className="w-px h-3 bg-white/20" />

            {/* ナビリンク */}
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hidden lg:block text-white/70 hover:text-white text-[12px] tracking-[0.15em] uppercase font-bold transition-colors whitespace-nowrap pointer-events-auto"
              >
                {l.label}
              </Link>
            ))}

            <span className="hidden lg:block w-px h-3 bg-white/20" />

            {/* Menu ボタン */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="メニュー"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors pointer-events-auto"
            >
              <span className="text-[12px] tracking-[0.2em] uppercase font-bold">Menu</span>
              <span className="flex flex-col gap-[4px]">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block w-[14px] h-px bg-current" />
                ))}
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* フルスクリーンメニュー */}
      <AnimatePresence>
        {menuOpen && <MenuContent onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
