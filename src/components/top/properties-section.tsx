"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { LetterSwapButton } from "@/components/ui/letter-swap-button"
import { PropertyStatusBadge } from "@/components/ui/property-status-badge"
import { cn } from "@/lib/utils"
import type { Property } from "@/types"

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
const AUTO_INTERVAL = 6500

const EDGE_BTN =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/25 text-black/55 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 group-hover:bg-white/45 group-hover:text-black group-hover:border-white/70"

function formatPrice(price: number | null): string {
  if (!price) return "価格応談"
  if (price >= 10000) {
    const oku = Math.floor(price / 10000)
    const man = price % 10000
    return man > 0 ? `${oku}億${man.toLocaleString()}万円` : `${oku}億円`
  }
  return `${price.toLocaleString()}万円`
}

type Props = { properties: Property[] }

export function PropertiesSection({ properties }: Props) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)

  const { ref: sectionRef, inView } = useInView({ threshold: 0.25 })

  const goTo = useCallback(
    (target: number) => {
      const len = properties.length
      const normalized = ((target % len) + len) % len
      setDir(normalized > index || (index === len - 1 && normalized === 0) ? 1 : -1)
      setIndex(normalized)
    },
    [index, properties.length],
  )

  const goNext = useCallback(() => goTo(index + 1), [goTo, index])
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])

  // 自動めくり — ホバー・操作中は一時停止
  useEffect(() => {
    if (properties.length <= 1 || paused || !inView) return
    const id = setInterval(() => {
      setDir(1)
      setIndex((prev) => (prev + 1) % properties.length)
    }, AUTO_INTERVAL)
    return () => clearInterval(id)
  }, [properties.length, paused, inView])

  if (properties.length === 0) return null

  const p = properties[index]
  const images = (p.property_images ?? []).sort((a, b) => a.sort_order - b.sort_order)
  const imgSrc =
    images[0]?.image_url ??
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=85"
  const snippet = p.one_point ?? p.comment ?? ""
  const showEdgeNav = inView && properties.length > 1

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-24 lg:py-40 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 画面端ホバーで表示 — lg以上 */}
      {showEdgeNav && (
        <>
          <button
            type="button"
            aria-label="前の物件"
            onClick={goPrev}
            className="group fixed left-0 top-1/2 z-30 hidden lg:flex w-[88px] h-[min(52vh,440px)] -translate-y-1/2 items-center justify-center cursor-pointer"
          >
            <span className={cn(EDGE_BTN, "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")}>
              <ArrowLeft size={15} strokeWidth={1.5} />
            </span>
          </button>
          <button
            type="button"
            aria-label="次の物件"
            onClick={goNext}
            className="group fixed right-0 top-1/2 z-30 hidden lg:flex w-[88px] h-[min(52vh,440px)] -translate-y-1/2 items-center justify-center cursor-pointer"
          >
            <span className={cn(EDGE_BTN, "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")}>
              <ArrowRight size={15} strokeWidth={1.5} />
            </span>
          </button>
        </>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-14 lg:mb-20 flex items-end justify-between px-6 lg:px-12"
      >
        <div>
          <p
            className="text-black/45 mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "15px",
              letterSpacing: "0.35em",
            }}
          >
            PROPERTIES
          </p>
          <h2 className="font-serif text-[clamp(40px,5.5vw,84px)] font-light text-black leading-[1.05]">
            厳選物件
          </h2>
        </div>
        <Link
          href="/properties/"
          className="group hidden lg:inline-flex items-center gap-3 text-[12px] tracking-[0.15em] uppercase text-black/55 hover:text-black transition-colors duration-300"
        >
          すべて見る
          <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-16" />
        </Link>
      </motion.div>

      {/* Showcase */}
      <div className="px-6 lg:px-12 grid lg:grid-cols-[1fr_minmax(340px,40%)] gap-10 lg:gap-16 items-start">

        {/* 写真 — 固定アスペクトで全物件同サイズ。ホバーでケンバーンズ */}
        <div className="group relative overflow-hidden rounded-[6px] w-full" style={{ aspectRatio: "4/3" }}>
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={p.id}
              custom={dir}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src={imgSrc}
                alt={p.property_name}
                fill
                className="object-cover saturate-[0.9] [transform-origin:62%_38%] transition-transform duration-[8000ms] ease-out group-hover:scale-[1.14]"
                sizes="(max-width: 1024px) 90vw, 55vw"
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* カウンター */}
          <div
            className="absolute bottom-5 left-5 z-10 flex items-baseline gap-1.5 text-white mix-blend-difference"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            <span className="text-[16px] font-semibold tabular-nums tracking-[0.1em]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[11px] opacity-60 tabular-nums tracking-[0.1em]">
              / {String(properties.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* 情報カラム */}
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              {/* カテゴリ + 物件名 — 近接グループ */}
              <div className="mb-6">
                {(p.property_category || p.status === 2) && (
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2.5">
                    {p.property_category && (
                      <span className="font-serif text-[17px] lg:text-[20px] font-light text-black/60 tracking-[0.04em]">
                        {p.property_category.name}
                      </span>
                    )}
                    <PropertyStatusBadge status={p.status} />
                  </div>
                )}
                <h3 className="font-serif text-[30px] lg:text-[42px] font-light text-black leading-[1.25] min-h-[2.5em]">
                  {p.property_name}
                </h3>
              </div>

              {/* 紹介文 — 4行分の高さで固定 */}
              <p className="text-[14px] lg:text-[15px] leading-[2.2] text-black/60 line-clamp-4 mb-10 h-[8.8em]">
                {snippet}
              </p>

              {/* 諸元 — 図面風の罫線リスト */}
              <dl className="border-t border-black/10">
                <div className="flex justify-between items-baseline py-3.5 border-b border-black/10">
                  <dt className="text-[11px] tracking-[0.3em] uppercase text-black/40">Price</dt>
                  <dd className="font-serif text-[19px] lg:text-[22px] text-black/90">
                    {formatPrice(p.price)}
                  </dd>
                </div>
                <div className="flex justify-between items-baseline py-3.5 border-b border-black/10 gap-6">
                  <dt className="text-[11px] tracking-[0.3em] uppercase text-black/40 shrink-0">Address</dt>
                  <dd className="text-[13px] text-black/65 truncate">{p.address ?? "南伊豆"}</dd>
                </div>
                <div className="flex justify-between items-baseline py-3.5 border-b border-black/10">
                  <dt className="text-[11px] tracking-[0.3em] uppercase text-black/40">Layout</dt>
                  <dd className="text-[13px] text-black/65">{p.layout ?? "—"}</dd>
                </div>
              </dl>

              <LetterSwapButton
                href={`/properties/${p.slug}/`}
                label="物件を見る"
                className="mt-8"
              />
            </motion.div>
          </AnimatePresence>

          {/* インデックスナビ */}
          <div className="mt-12 pt-6">
            <div className="flex items-center gap-4" style={{ fontFamily: "var(--font-barlow)" }}>
              {properties.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`物件 ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "text-[13px] tabular-nums tracking-[0.1em] transition-all duration-300",
                    i === index
                      ? "text-black border-b border-black pb-0.5"
                      : "text-black/35 hover:text-black/70",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: see all */}
      <div className="mt-14 flex justify-center px-6 lg:hidden">
        <Link
          href="/properties/"
          className="group inline-flex items-center gap-3 text-[12px] tracking-[0.15em] uppercase text-black/55 transition-colors duration-300 hover:text-black"
        >
          すべての物件を見る
          <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-16" />
        </Link>
      </div>
    </section>
  )
}
