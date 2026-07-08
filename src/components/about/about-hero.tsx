"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Fog } from "@/components/ui/fog"
import { CharReveal } from "@/components/about/char-reveal"
import { MEDIA } from "@/lib/media"

gsap.registerPlugin(ScrollTrigger)

const HERO_VIDEO = MEDIA.IMG_E1859_MP4
const HERO_POSTER = MEDIA.IMG_1850

const HEADING_LINES = ["自然と、", "共に暮らす。"]

const INTRO_PARAGRAPHS = [
  "私たちサイファームは、伊豆半島の最南端、南伊豆高原に拠点を置く不動産会社です。",
  "25年前、自然の中で暮らしたいという希望を抱き、手付かずの原生林が残る伊豆に移住してきました。",
  "山梨や千葉、岡山——いくつもの候補地を実際に訪れ、宿泊して比べたうえで、比べものにならないほどの自然の豊かさを感じた伊豆を、最終的な移住先に選びました。",
]

export function AboutHero() {
  const rootRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const darkenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 登場: 写真のスロー・ズームアウト + 見出しのマスクリベール
      gsap.from(imageRef.current, {
        scale: 1.14,
        duration: 3.2,
        ease: "power2.out",
      })

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
      tl.from(".about-hero-line", {
        yPercent: 115,
        duration: 1.5,
        stagger: 0.14,
        delay: 0.35,
      })
        .from(
          ".about-hero-label",
          { opacity: 0, y: 14, duration: 1 },
          "-=1.0",
        )
        .from(
          ".about-hero-lead",
          { opacity: 0, y: 18, duration: 1.1 },
          "-=0.8",
        )
        .from(
          ".about-hero-foot",
          { opacity: 0, duration: 1.2 },
          "-=0.7",
        )

      // 退場: テキストは先に浮き上がって消える
      gsap.to(contentRef.current, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=55%",
          scrub: true,
        },
      })

      // 写真はそのまま続き、スクロールでだんだん黒に沈む
      gsap.fromTo(
        darkenRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: bgRef.current,
            start: "25% top",
            end: "82% top",
            scrub: true,
          },
        },
      )

      // 25年前: 見出しのマスクリベール
      gsap.utils.toArray<HTMLElement>(".story-mask-line").forEach((line) => {
        gsap.from(line, {
          yPercent: 115,
          duration: 1.3,
          ease: "power4.out",
          scrollTrigger: { trigger: line, start: "top 90%", once: true },
        })
      })

      // 25年前: 本文の文字単位scroll-reveal
      gsap.utils.toArray<HTMLElement>(".story-body").forEach((body) => {
        gsap.fromTo(
          body.querySelectorAll(".story-char"),
          { opacity: 0.08, filter: "blur(6px)", y: 10 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            stagger: 0.012,
            ease: "none",
            scrollTrigger: {
              trigger: body,
              start: "top 88%",
              end: "top 42%",
              scrub: true,
            },
          },
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-[#0d0c0a] text-white"
    >
      {/* 背景: 原生林の写真。グラデとスクロール暗転で完全な黒へ溶ける */}
      <div ref={bgRef} className="absolute inset-x-0 top-0 h-[185svh] min-h-[1100px]">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <video
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER}
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center saturate-[0.8]"
            src={HERO_VIDEO}
          />
        </div>

        {/* 下端は常に黒へ溶かす */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 62%, rgba(13,12,10,0.4) 76%, rgba(13,12,10,0.8) 88%, #0d0c0a 98%)",
          }}
        />

        {/* スクロールでだんだん暗転 */}
        <div
          ref={darkenRef}
          className="pointer-events-none absolute inset-0 bg-[#0d0c0a] opacity-0"
        />
      </div>

      {/* 流れる霧: 見出し2行目あたりで湧き、25年前との境目あたりで漂って消える */}
      <div
        className="absolute inset-x-0 top-0 h-[200svh]"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 19%, rgba(0,0,0,0.6) 33%, rgba(0,0,0,0.9) 48%, black 62%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 19%, rgba(0,0,0,0.6) 33%, rgba(0,0,0,0.9) 48%, black 62%, black 90%, transparent 100%)",
        }}
      >
        <Fog
          color="#e9e2d3"
          opacity={1}
          speed={0.07}
          scale={2.2}
          alphaTop={0.8}
          thresholdLow={0.36}
          timeOffset={26}
        />
      </div>

      {/* 1画面目: ヒーローコンテンツ */}
      <div className="relative h-[100svh]">
        {/* テキスト部だけの淡いビネット (全面オーバーレイは使わない) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 58% 46% at 50% 50%, rgba(13,12,10,0.34) 0%, rgba(13,12,10,0.16) 55%, transparent 78%)",
          }}
        />

        <div
          ref={contentRef}
          className="flex h-full flex-col items-center justify-center px-6 text-center"
          style={{ textShadow: "0 1px 28px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.3)" }}
        >
          <p
            className="about-hero-label mb-6 text-white/60 lg:mb-8"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              letterSpacing: "0.45em",
            }}
          >
            ABOUT US
          </p>

          <h1 className="font-serif font-light leading-[1.16] text-[clamp(44px,9vw,110px)]">
            {HEADING_LINES.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span className="about-hero-line block will-change-transform">{line}</span>
              </span>
            ))}
          </h1>

          <p className="about-hero-lead mt-8 text-[13px] leading-[2.4] text-white/70 lg:mt-10 lg:text-[14px]">
            伊豆半島の最南端、南伊豆高原。
            <br />
            サイファームは、この土地に魅せられて移住した私たち自身の物語から始まりました。
          </p>
        </div>

        {/* 1画面目の下端: クレジット */}
        <div className="about-hero-foot absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-7 lg:px-12 lg:pb-9">
          <p
            className="hidden text-[11px] tracking-[0.35em] text-white/40 uppercase sm:block"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Saifarm Minami-Izu
          </p>
          <p
            className="mx-auto text-[11px] tracking-[0.35em] text-white/40 uppercase sm:mx-0"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Izu Peninsula, Shizuoka
          </p>
        </div>
      </div>

      {/* ─── OUR STORY: 25年前 (完全な黒の上) ─── */}
      <div className="relative z-10 mt-[85svh]">
        <div className="mx-auto w-full max-w-screen-xl px-6 pb-28 pt-2 lg:px-12 lg:pb-40">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            <p
              className="shrink-0 text-[12px] tracking-[0.45em] text-white/45 uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Story
            </p>

            <div className="lg:w-[58%] lg:max-w-[680px]">
              <h2 className="font-serif font-light leading-[1.4] text-[clamp(26px,4vw,44px)]">
                <span className="block overflow-hidden pb-[0.1em]">
                  <span className="story-mask-line block">25年前、</span>
                </span>
                <span className="block overflow-hidden pb-[0.1em]">
                  <span className="story-mask-line block">私たちも移住者でした。</span>
                </span>
              </h2>

              <div className="story-body mt-10 space-y-6 lg:mt-12">
                {INTRO_PARAGRAPHS.map((text) => (
                  <CharReveal
                    key={text}
                    text={text}
                    className="text-[14px] leading-[2.3] text-white/70 lg:text-[15px]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
