"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightFromSquare } from "lucide-react"
import { BAR_H } from "@/components/top/top-page-nav"

type LatestProperty = {
  id: string
  property_name: string
  slug: string
  price: number | null
  address: string | null
  property_category: { name: string; slug: string } | null
  property_images: { image_url: string; sort_order: number }[]
}

type Props = {
  latestProperty?: LatestProperty
}

export function HeroSection({ latestProperty }: Props) {
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([line1Ref.current, line2Ref.current], {
        y: 140,
        opacity: 0,
        duration: 1.4,
        stagger: 0.09,
        delay: 0.3,
        ease: "power4.out",
      })
    })
    return () => ctx.revert()
  }, [])

  const thumbUrl = latestProperty?.property_images
    ?.sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url

  return (
    <section className="bg-white px-2 lg:px-2.5" style={{ paddingTop: BAR_H }}>
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: `calc(100vh - ${BAR_H}px + 20px)`,
          borderRadius: "16px",
        }}
      >
        {/* 左下グラデーション */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
          }}
        />

        {/* 背景動画 */}
        <video
          muted
          autoPlay
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="/movies/top.mp4"
        />

        {/* 大見出し — PC: 左下横書き / SP: 左端縦書き（回転） */}

        {/* PC のみ */}
        <div className="absolute bottom-0 left-0 z-10 hidden px-8 pb-10 lg:block">
          <div className="overflow-hidden">
            <div
              ref={line1Ref}
              className="text-white leading-[0.9]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(88px, 20vw, 240px)",
                letterSpacing: "0.01em",
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              LIVE
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              ref={line2Ref}
              className="text-white leading-[0.9]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(88px, 20vw, 240px)",
                letterSpacing: "0.01em",
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              NATURALLY.
            </div>
          </div>
        </div>

        {/* SP のみ — デザイン用 左上はみ出し2行（塗り×アウトラインのミックス） */}
        <div
          className="absolute left-0 top-0 z-10 lg:hidden"
          style={{
            pointerEvents: "none",
            transform: "translate(-5%, -6%)",
            lineHeight: 0.84,
          }}
        >
          {/* LIVE — 白塗り、overlay で映像に溶ける */}
          <div
            className="font-black text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(96px, 32vw, 150px)",
              letterSpacing: "0.01em",
              mixBlendMode: "overlay",
            }}
          >
            LIVE
          </div>
          {/* 同じ文字を薄く重ねて視認性を担保 */}
          <div
            aria-hidden
            className="absolute left-0 top-0 font-black text-white/30"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(96px, 32vw, 150px)",
              letterSpacing: "0.01em",
            }}
          >
            LIVE
          </div>
          {/* NATURALLY. — 塗りなし、白の縁取りだけで背景が透ける */}
          <div
            className="font-black"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(96px, 32vw, 150px)",
              letterSpacing: "0.01em",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(255,255,255,0.85)",
            }}
          >
            NATURALLY.
          </div>
        </div>

        {/* 右下: 新着物件カード */}
        {latestProperty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute bottom-10 right-5 lg:bottom-12 lg:right-10 z-10 w-[220px] lg:w-[250px]"
          >
            <Link href={`/properties/${latestProperty.slug}/`} className="block group">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
              >
                {/* サムネイル — 60%、下角丸のみ */}
                <div
                  className="relative w-full overflow-hidden"
                  style={{ height: 150, borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" }}
                >
                  {thumbUrl ? (
                    <Image
                      src={thumbUrl}
                      alt={latestProperty.property_name}
                      fill
                      className="object-cover transition-all duration-[1500ms] ease-out group-hover:scale-[1.08] group-hover:translate-x-[-2%] group-hover:translate-y-[-2%]"
                      sizes="250px"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10" />
                  )}
                </div>

                {/* テキストエリア — 40% */}
                <div className="px-4 py-1.5 pb-2 flex flex-col justify-between" style={{ minHeight: 100 }}>
                  {/* ラベル: 上端（画像のすぐ下） */}
                  <p
                    className="text-white/55 text-[9px] tracking-[0.32em] uppercase font-semibold"
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    New Arrival
                  </p>

                  {/* タイトル + アイコン: 下端 */}
                  <div>
                    <p
                      className="text-white font-bold leading-snug line-clamp-3 mb-1"
                      style={{
                        fontFamily: "var(--font-barlow)",
                        fontSize: "18px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {latestProperty.property_name}
                    </p>
                    <div className="flex items-end justify-between">
                      <span
                        className="text-white/55 text-[10px] tracking-[0.1em]"
                        style={{ fontFamily: "var(--font-barlow)" }}
                      >
                        {latestProperty.property_category?.name ?? "物件"}
                      </span>
                      <ArrowUpRightFromSquare
                        size={14}
                        className="text-white/55 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
