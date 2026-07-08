"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Fog } from "@/components/ui/fog"
import { Ferrofluid } from "@/components/ui/ferrofluid"
import { LightRays } from "@/components/ui/light-rays"
import { LetterSwapButton } from "@/components/ui/letter-swap-button"
import { CharReveal } from "@/components/about/char-reveal"
import { MEDIA } from "@/lib/media"

gsap.registerPlugin(ScrollTrigger)

const PROMISE_IMAGE = MEDIA.IMG_1842

const INTRO_PARAGRAPHS = [
  "私たちサイファームは、伊豆半島の最南端、南伊豆高原に拠点を置く不動産会社です。",
  "25年前、自然の中で暮らしたいという希望を抱き、手付かずの原生林が残る伊豆に移住してきました。",
  "山梨や千葉、岡山——いくつもの候補地を実際に訪れ、宿泊して比べたうえで、比べものにならないほどの自然の豊かさを感じた伊豆を、最終的な移住先に選びました。",
]

const CLOSING_PARAGRAPHS = [
  "田舎暮らしを考えている方に対して、同じ価値観を共有し、自然の中で生活することへのアドバイスやきめ細かなサポートを行ってまいります。",
  "実際に移住してからは、初めてのことばかりで分からない方がほとんどです。先に移住してきた経験と、お客様方の色々な経験を踏まえて——自らが田舎暮らしに憧れて移住してきたからこそわかる、同じ目線での不安や問題に対処していくことを心掛けております。",
  "建築等では、地元の工務店や色々な建築方法などのサポートを通し、インフラの整備や不安のない生活を送れるよう手助けしてまいります。",
]

type Chapter = {
  no: string
  en: string
  kanji: string
  image: string
  imageClass: string
  align: "left" | "right"
  lines: string
  /** 明るいセクション (テキストを墨色に) */
  light?: boolean
  /** シェーダの種類 */
  shader: "water" | "fog" | "rays"
  /** 前のシーンから受け継ぐ色 (この色から現れる) */
  entryColor?: string
  /** シーン終わりに満ちていく色 (次のシーンへ渡す) */
  exitColor?: string
}

export type AboutStoryImages = {
  ocean: string
  forest: string
  green: string
  life: string
}

export function AboutStory({ images }: { images: AboutStoryImages }) {
  const rootRef = useRef<HTMLDivElement>(null)

  const chapters: Chapter[] = [
    {
      no: "01",
      en: "SEA",
      kanji: "海",
      image: images.ocean,
      imageClass: "brightness-[0.96] saturate-[1.02]",
      align: "left",
      light: true,
      shader: "water",
      // 白く明るくなりきって次の原生林へ
      exitColor: "#edf0ee",
      lines:
        "ガレージからサーフボードを持って\n時間を忘れて波を待つ——\n目の前に広がるのは\nどこまでも澄み切った海。",
    },
    {
      no: "02",
      en: "FOREST",
      kanji: "原生林",
      image: images.forest,
      imageClass: "brightness-[0.7] saturate-[0.85]",
      align: "right",
      shader: "fog",
      // 白い明るみから現れ、霧が濃くなって次へ
      entryColor: "#edf0ee",
      exitColor: "#d9d3c6",
      lines:
        "アスファルトから離れ\n迷った先にあるのは手付かずの原生林。\n早朝には野鳥が囀り\n雨上がりには霧が立ち込め\n幻想的な光景に包まれます。",
    },
    {
      no: "03",
      en: "GEOPARK",
      kanji: "秘境",
      image: images.green,
      imageClass: "brightness-[0.62] saturate-[0.9]",
      align: "left",
      shader: "rays",
      // 濃い霧の中から現れ、差し込む光が満ちて明るい場面へ
      entryColor: "#d9d3c6",
      exitColor: "#f0ebdf",
      lines:
        "火山と海がつくりあげた\n伊豆半島ジオパーク——\nヒリゾ浜をはじめ\n手つかずの秘境が今も残る、\n地球の営みを間近に感じられる土地です。",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 本文: 文字単位のscroll-reveal (通常セクション)
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

      // 見出し: マスクリベール (通常セクション)
      gsap.utils.toArray<HTMLElement>(".story-mask-line").forEach((line) => {
        gsap.from(line, {
          yPercent: 115,
          duration: 1.3,
          ease: "power4.out",
          scrollTrigger: { trigger: line, start: "top 90%", once: true },
        })
      })

      // フェードアップ(汎用)
      gsap.utils.toArray<HTMLElement>(".story-fade").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 26,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        })
      })

      // 導入レイヤー: 前のシーンの色からセクションが現れる
      gsap.utils.toArray<HTMLElement>(".story-dim-in").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top 55%",
              end: "top 2%",
              scrub: true,
            },
          },
        )
      })

      // ─── チャプターシーン: ピン留めして「静→文字→シェーダが満ちる」 ───
      gsap.utils.toArray<HTMLElement>(".story-scene").forEach((scene) => {
        const image = scene.querySelector(".scene-image")
        const haze = scene.querySelector(".scene-haze")
        const entry = scene.querySelector(".scene-entry")
        const exit = scene.querySelector(".scene-exit")
        const shader = scene.querySelector(".scene-shader")
        const label = scene.querySelector(".scene-label")
        const kanjiLine = scene.querySelector(".scene-kanji-line")
        const chars = scene.querySelectorAll(".scene-char")
        const textWrap = scene.querySelector(".scene-text")

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "+=430%",
            pin: true,
            scrub: true,
            // シーンの入口付近ではピタッと止まる
            snap: {
              snapTo: (v: number) => (v < 0.08 ? 0 : v),
              duration: { min: 0.2, max: 0.8 },
              ease: "power2.out",
              inertia: false,
            },
          },
        })

        // ケンバーンズ: 全編かけてゆっくり寄りが引いていく
        tl.fromTo(image, { scale: 1.16 }, { scale: 1.0, duration: 3 }, 0)

        // 前のシーンの色から現れる (まずは画像をはっきり見せる)
        if (entry) tl.fromTo(entry, { opacity: 1 }, { opacity: 0, duration: 0.4 }, 0)

        // 可読性グラデ: 文字が出る前にじょじょに現れる
        if (haze) tl.fromTo(haze, { opacity: 0 }, { opacity: 1, duration: 0.45 }, 0.3)

        // 文字が現れる
        if (label)
          tl.fromTo(
            label,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
            0.6,
          )
        if (kanjiLine)
          tl.fromTo(
            kanjiLine,
            { yPercent: 115 },
            { yPercent: 0, duration: 0.4, ease: "power3.out" },
            0.7,
          )
        if (chars.length)
          tl.fromTo(
            chars,
            { opacity: 0.06, filter: "blur(6px)", y: 8 },
            { opacity: 1, filter: "blur(0px)", y: 0, stagger: 0.012, duration: 0.5 },
            0.85,
          )

        // シェーダ: テキストが全て出る少し前からうっすら、読了後に満ちる
        if (exit && shader) {
          const textRevealStart = 0.85
          const textStagger = 0.012
          const textDuration = 0.5
          const textEnd =
            chars.length > 0
              ? textRevealStart + (chars.length - 1) * textStagger + textDuration
              : 1.35
          const shaderHintStart = Math.max(textEnd - 0.18, 1.0)
          const shaderFullStart = textEnd + 1.1
          const textFadeStart = shaderFullStart + 0.2
          const exitStart = textFadeStart + 0.05

          tl.fromTo(shader, { opacity: 0 }, { opacity: 0.4, duration: 0.8 }, shaderHintStart)
          tl.to(shader, { opacity: 1, duration: 0.55 }, shaderFullStart)
          if (textWrap) tl.to(textWrap, { opacity: 0, duration: 0.45 }, textFadeStart)
          tl.fromTo(exit, { opacity: 0 }, { opacity: 1, duration: 0.45 }, exitStart)
        }
      })

      // ピンのスペーサー分を全トリガーの開始位置に反映させる
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="bg-[#0d0c0a] text-white">
      {/* ─── 章タイトル: 伊豆の魅力 ─── */}
      <div className="relative overflow-hidden px-6 pb-8 pt-16 lg:px-12 lg:pb-12 lg:pt-24">
        <div className="flex items-end justify-between gap-6">
          <h2
            className="story-fade leading-none text-white/[0.92] uppercase text-[clamp(52px,11vw,150px)]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
          >
            The Charm of Izu
          </h2>
          <p className="story-fade mb-2 shrink-0 font-serif text-[15px] tracking-[0.3em] text-white/50 lg:text-[18px]">
            伊豆の魅力
          </p>
        </div>
      </div>

      {/* ─── チャプターシーン ─── */}
      {chapters.map((ch) => (
        <section
          key={ch.no}
          className="story-scene relative h-[100svh] overflow-hidden"
        >
          {/* 背景写真 (ケンバーンズ) */}
          <div className="scene-image absolute inset-0 will-change-transform">
            <Image
              src={ch.image}
              alt={`南伊豆の${ch.kanji}`}
              fill
              className={`object-cover object-center ${ch.imageClass}`}
              sizes="100vw"
            />
          </div>

          {/* シェーダ (文字とともにうっすら、終盤に満ちる) */}
          <div className="scene-shader absolute inset-0 opacity-0">
            {ch.shader === "water" ? (
              <Ferrofluid
                colors={["#ffffff", "#dff2ef", "#a8d8d3"]}
                speed={0.26}
                scale={1.55}
                turbulence={1}
                fluidity={0.12}
                rimWidth={0.21}
                sharpness={2.8}
                shimmer={1.4}
                glow={2.0}
                flowDirection="right"
                opacity={1}
                mouseRadius={0.3}
                mouseStrength={0.9}
              />
            ) : ch.shader === "rays" ? (
              // 光線は右7割だけに差し込む
              <LightRays
                className="mix-blend-screen [mask-image:linear-gradient(to_right,transparent_0%,transparent_26%,black_52%)]"
                color="#fff3da"
                opacity={0.95}
                speed={0.05}
                originX={0.78}
              />
            ) : (
              // 原生林の濃霧: しきい値を下げて量感を出す
              <Fog
                color="#e3dccd"
                opacity={1}
                speed={0.06}
                scale={1.8}
                alphaTop={0.8}
                thresholdLow={0.3}
                thresholdHigh={0.62}
              />
            )}
          </div>

          {/* テキスト側の可読性 (文字の前にじょじょに現れる) */}
          <div
            className="scene-haze pointer-events-none absolute inset-0 opacity-0"
            style={{
              background: ch.light
                ? `linear-gradient(to ${
                    ch.align === "left" ? "right" : "left"
                  }, rgba(235,242,240,0.9) 0%, rgba(235,242,240,0.55) 38%, transparent 72%)`
                : `linear-gradient(to ${
                    ch.align === "left" ? "right" : "left"
                  }, rgba(13,12,10,0.45) 0%, rgba(13,12,10,0.12) 50%, transparent 90%)`,
            }}
          />

          {/* テキスト */}
          <div
            className={`scene-text relative z-20 flex h-full w-full items-center px-6 lg:px-12 ${
              ch.align === "right" ? "justify-end" : ""
            }`}
          >
            <div className={ch.align === "right" ? "lg:text-right" : ""}>
              <p
                className={`scene-label flex items-baseline gap-4 ${
                  ch.light ? "text-[#1c2422]/55" : "text-white/55"
                } ${ch.align === "right" ? "lg:justify-end" : ""}`}
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                <span className="text-[13px] tracking-[0.2em]">({ch.no})</span>
                <span className="text-[12px] tracking-[0.4em] uppercase">{ch.en}</span>
              </p>

              <h3
                className={`mt-6 overflow-hidden pb-[0.1em] font-serif font-light leading-[1.08] text-[clamp(56px,9vw,120px)] ${
                  ch.light ? "text-[#16211f]" : ""
                }`}
              >
                <span className="scene-kanji-line block will-change-transform">{ch.kanji}</span>
              </h3>

              <div className="mt-8 lg:mt-12">
                <CharReveal
                  text={ch.lines}
                  charClass="scene-char"
                  className={`text-[13.5px] leading-[2.5] lg:text-[14.5px] ${
                    ch.light ? "text-[#1c2422]/80" : "text-white/85"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* シーン終わりに満ちる色 (次のシーンへ) */}
          {ch.exitColor && (
            <div
              className="scene-exit pointer-events-none absolute inset-0 z-30 opacity-0"
              style={{ backgroundColor: ch.exitColor }}
            />
          )}

          {/* 前のシーンの色から現れる */}
          {ch.entryColor && (
            <div
              className="scene-entry pointer-events-none absolute inset-0 z-40"
              style={{ backgroundColor: ch.entryColor }}
            />
          )}
        </section>
      ))}

      {/* ─── PROMISE + SUPPORT: 上は明るい沢、下へ暮れていく1セクション ─── */}
      <section className="relative overflow-hidden">
        {/* 背景: 沢の清流。上は明るく、下に向かって夜に沈む */}
        <div className="absolute inset-0">
          <Image
            src={PROMISE_IMAGE}
            alt="南伊豆の沢"
            fill
            className="object-cover object-center brightness-[0.85] saturate-[0.9]"
            sizes="100vw"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 64% 42% at 50% 24%, rgba(13,12,10,0.4) 0%, transparent 72%), linear-gradient(to bottom, rgba(13,12,10,0.05) 0%, rgba(13,12,10,0.16) 34%, rgba(13,12,10,0.62) 55%, rgba(13,12,10,0.92) 70%, #0d0c0a 82%)",
            }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 62%, transparent 92%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 62%, transparent 92%)",
          }}
        >
          <Fog color="#dcd4c2" opacity={0.45} speed={0.06} scale={1.8} alphaBottom={0.4} alphaTop={0.8} />
        </div>

        {/* 緑の章の光の白から現れる */}
        <div
          className="story-dim-in pointer-events-none absolute inset-0 z-20"
          style={{ backgroundColor: "#f0ebdf" }}
        />

        <div className="relative z-10">
          {/* 上部: PROMISE (明るい) */}
          <div className="flex min-h-[92svh] flex-col items-center justify-center px-6 py-24 text-center">
            <p
              className="story-fade mb-6 text-white/70"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "12px",
                letterSpacing: "0.45em",
              }}
            >
              OUR PROMISE
            </p>
            <h2 className="font-serif font-light leading-[1.5] text-[clamp(28px,4.6vw,52px)]">
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="story-mask-line block">同じ目線で、</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="story-mask-line block">田舎暮らしに寄り添う。</span>
              </span>
            </h2>
          </div>

          {/* 下部: SUPPORT (暗い) */}
          <div className="mx-auto max-w-screen-xl px-6 pb-32 pt-10 lg:px-12 lg:pb-44 lg:pt-16">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            <p
              className="story-fade shrink-0 text-[12px] tracking-[0.45em] text-white/45 uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Support
            </p>

            <div className="lg:w-[58%] lg:max-w-[680px]">
              <div className="story-body space-y-6">
                {CLOSING_PARAGRAPHS.map((text) => (
                  <CharReveal
                    key={text}
                    text={text}
                    className="text-[14px] leading-[2.3] text-white/70 lg:text-[15px]"
                  />
                ))}
              </div>

              <div className="story-fade mt-12 flex flex-wrap items-center gap-6 lg:mt-16">
                <LetterSwapButton
                  href="/contact/"
                  label="お問い合わせ"
                  variant="light"
                  icon="send"
                />
                <LetterSwapButton
                  href="/properties/property-categories/all/"
                  label="物件を見る"
                  className="border border-white/25 bg-transparent text-white hover:bg-white/10"
                />
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  )
}
