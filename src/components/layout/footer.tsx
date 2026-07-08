"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LetterSwapButton } from "@/components/ui/letter-swap-button"
import { FooterMain } from "@/components/layout/footer-main"
import { MEDIA } from "@/lib/media"

gsap.registerPlugin(ScrollTrigger)

const CTA_IMAGE = MEDIA.IMG_1721
const BOTTOM_IMAGE = MEDIA.IMG_CHOJAGAHARA
const ABOUT_BOTTOM_IMAGE = MEDIA.P1010417

export function Footer() {
  const pathname = usePathname()
  const isTop = pathname === "/"
  const isAbout = pathname === "/about-us/"
  const isMap = pathname === "/map/"
  const showReveal = isTop || isAbout

  if (isMap || pathname.startsWith("/admin")) return null

  const rootRef = useRef<HTMLElement>(null)
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null)
  const revealTriggerRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showReveal) return

    const ctx = gsap.context(() => {
      if (isTop) {
        gsap.fromTo(
          ".cta-float-char",
          {
            opacity: 0.15,
            yPercent: 50,
            scaleY: 1.2,
            scaleX: 0.96,
            filter: "blur(3px)",
            transformOrigin: "50% 100%",
          },
          {
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            filter: "blur(0px)",
            stagger: 0.018,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaHeadingRef.current,
              start: "top 92%",
              end: "top 28%",
              scrub: 0.8,
            },
          },
        )
      }

      gsap.fromTo(
        zoomRef.current,
        { scale: 1.45 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: revealTriggerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      )
    }, rootRef)

    return () => ctx.revert()
  }, [isTop, showReveal])

  // カーテンリベール（一番下の画像）
  const curtainReveal = (
    <div
      ref={revealTriggerRef}
      className="relative"
      style={{ height: "clamp(480px, 88vh, 900px)", clipPath: "inset(0)" }}
    >
      <div
        className="fixed inset-x-0 bottom-0"
        style={{ height: "clamp(480px, 88vh, 900px)" }}
      >
        <div ref={zoomRef} className="absolute inset-0 will-change-transform">
          <Image
            src={isAbout ? ABOUT_BOTTOM_IMAGE : BOTTOM_IMAGE}
            alt={isAbout ? "南伊豆 長者ヶ原" : "南伊豆 白浜のビーチ"}
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-black/15" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-[3vw] lg:gap-[2.5vw] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
            <Image
              src="/common/logo-mark-white.png"
              alt=""
              width={222}
              height={105}
              className="w-[clamp(64px,9vw,140px)] h-auto drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
            />
            <span
              className="leading-none uppercase font-semibold"
              style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "clamp(28px, 4.8vw, 76px)",
                letterSpacing: "0.35em",
              }}
            >
              SAIFARM
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  if (!isTop) {
    return (
      <footer ref={rootRef} className="relative z-10 -mt-4 text-white">
        <div className="overflow-hidden rounded-t-[16px] bg-[#0a0a0a]">
          <FooterMain />
        </div>
        {isAbout && <div className="bg-[#0a0a0a]">{curtainReveal}</div>}
      </footer>
    )
  }

  return (
    <footer ref={rootRef} className="bg-[#0a0a0a] text-white">
      {/* CTA — トップのみ */}
      <div className="bg-white">
        <div
          className="relative overflow-hidden rounded-t-[16px]"
          style={{ height: "clamp(900px, 145vh, 1500px)" }}
        >
          <Image
            src={CTA_IMAGE}
            alt="南伊豆 ヒリゾ浜の海"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />

          <div className="relative z-10 h-full flex flex-col items-center text-center px-6 pt-[7vh] lg:pt-[9vh]">
            <h2
              ref={ctaHeadingRef}
              aria-label="南伊豆で、暮らしを探す。"
              className="font-sans font-bold text-white leading-[1.08] tracking-[0.02em]"
              style={{ fontSize: "clamp(44px, 7.6vw, 104px)" }}
            >
              {["南伊豆で、", "暮らしを", "探す。"].map((line, li) => (
                <span key={li} aria-hidden className="block">
                  {line.split("").map((ch, i) => (
                    <span key={i} className="cta-float-char inline-block will-change-transform">
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            <p className="mt-[13vh] lg:mt-[15vh] text-[13px] lg:text-[14px] leading-[2] text-white/90">
              <span className="block whitespace-nowrap">移住も、別荘も、リゾートも。</span>
              <span className="block whitespace-nowrap">南伊豆での暮らしのはじまりを、</span>
              <span className="block whitespace-nowrap">地元の目線でお手伝いします。</span>
            </p>
            <LetterSwapButton
              href="/contact/"
              label="お問い合わせ"
              variant="light"
              icon="send"
              className="mt-10"
            />
          </div>
        </div>
      </div>

      <FooterMain />

      {curtainReveal}
    </footer>
  )
}
