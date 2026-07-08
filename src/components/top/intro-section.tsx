"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, type Variants } from "framer-motion"

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: EASE },
  }),
}

const IMAGE_LABELS = [
  { en: "Sea", ja: "海" },
  { en: "Mountain", ja: "山" },
  { en: "Starry Sky", ja: "星空" },
]

const BODY_TEXTS = [
  "この半島で流れるのは“自然主体”の特別な時間。大自然に包まれながら、自然の恵みを堪能する。そこだけにある特別なもの。",
  "目の前に広がる海、満点の星空の中で眠る夜——。都会から自然へ、非日常を日常に。初めてのリゾート暮らしを、私たちサイファームがサポートいたします。",
]

// 行頭に来てはいけない文字は前の文字とセットにする(禁則処理)
const KINSOKU = /^[、。”」』）｝〉》・ーぁぃぅぇぉっゃゅょ々〜]$/
function splitKinsoku(text: string): string[] {
  const segments: string[] = []
  for (const ch of text) {
    if (segments.length > 0 && KINSOKU.test(ch)) {
      segments[segments.length - 1] += ch
    } else {
      segments.push(ch)
    }
  }
  return segments
}

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const imageInnerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 本文: 文字単位のscroll-reveal (CTAと同じ所作)
      gsap.fromTo(
        ".intro-char",
        { opacity: 0.12, filter: "blur(6px)", y: 10 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          stagger: 0.012,
          ease: "none",
          scrollTrigger: {
            trigger: bodyRef.current,
            start: "top 88%",
            end: "top 38%",
            scrub: true,
          },
        },
      )

      // 見出し: マスクリベール(ヒーローと同じ所作)
      gsap.from(headingRef.current, {
        yPercent: 110,
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 88%",
          once: true,
        },
      })

      // 写真: 緩やかなパララックス
      gsap.fromTo(
        imageInnerRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: imageInnerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-white overflow-hidden">

      {/* ─── 上段: ラベル(左) × 本文(右) ─── */}
      <div className="px-6 lg:px-12 pt-32 lg:pt-64 pb-24 lg:pb-52 flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-8">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[12px] tracking-[0.45em] text-black/40 uppercase shrink-0"
        >
          About Izu Peninsula
        </motion.p>

        <div className="lg:w-[46%] lg:max-w-[600px]">
          <div ref={bodyRef} className="grid sm:grid-cols-2 gap-x-10 gap-y-6 mb-10">
            {BODY_TEXTS.map((text, i) => (
              <p
                key={i}
                aria-label={text}
                className="text-[14px] lg:text-[15px] leading-[2.2] text-black/60"
              >
                {splitKinsoku(text).map((seg, j) => (
                  <span key={j} aria-hidden className="intro-char inline-block will-change-transform">
                    {seg}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              href="/about-us/"
              className="group inline-flex items-center gap-3 text-[13px] tracking-[0.2em] text-black/70 hover:text-black transition-colors duration-300"
            >
              <span className="uppercase">私たちについて</span>
              <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-16" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ─── 巨大見出し: ベースラインが写真上端に接する ─── */}
      <div className="overflow-hidden px-6 lg:px-12">
        <h2
          ref={headingRef}
          className="font-serif font-light text-black leading-[1.1] lg:leading-none"
        >
          <span className="block whitespace-nowrap text-[13.5vw] lg:inline lg:text-[8.4vw]">
            伊豆半島で
          </span>
          <span className="block whitespace-nowrap text-[13.5vw] lg:inline lg:pl-0 lg:text-[8.4vw]">
            流れる時間
          </span>
        </h2>
      </div>

      {/* ─── 全幅写真: 上端に3カラムラベル ─── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(480px, 74vw, 1000px)" }}
      >
        <div ref={imageInnerRef} className="absolute -inset-y-[10%] inset-x-0">
          <Image
            src="https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=2400&q=90"
            alt="伊豆半島の星空"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* 下端のみ黒へフェード(次の黒セクションへの橋渡し) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.45) 82%, rgba(14,14,14,0.95) 100%)",
          }}
        />

        {/* 写真上端: 3カラムラベル */}
        <div className="absolute top-0 inset-x-0 flex justify-between px-6 lg:px-12 pt-5 lg:pt-7">
          {IMAGE_LABELS.map((label, i) => (
            <motion.p
              key={label.en}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-white/90 text-[11px] lg:text-[12px] tracking-[0.35em] uppercase flex items-baseline gap-3"
            >
              {label.en}
              <span className="font-serif tracking-[0.2em] text-white/55 hidden sm:inline">
                {label.ja}
              </span>
            </motion.p>
          ))}
        </div>
      </div>

    </section>
  )
}
