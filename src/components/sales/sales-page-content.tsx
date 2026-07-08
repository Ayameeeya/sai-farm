"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { Phone, ArrowRight } from "lucide-react"
import { motion, AnimatePresence, type Transition } from "framer-motion"
import { SellingForm } from "@/components/forms/selling-form"

type Props = {
  heroImage: string
  sideImage: string
  illustrationImage: string
}

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1]

/*
 * 暖色パレット
 * 紙: #faf8f3 / 濃紙: #f3eee6
 * インク: #38332c（暖かい黒）
 * ダーク: #2e2822（エスプレッソ）
 * アクセント: #a97e52（クレイ）
 */

const CONCERNS = [
  {
    title: "どうやって売ればいいのか分からない",
    body: "不動産売却は多くの方にとって初めての経験。何から始めればいいのか、誰に相談すればいいのか——その最初の一歩からご一緒します。",
  },
  {
    title: "交渉ややりとりに不安がある",
    body: "買主との価格交渉、契約書類の準備、引き渡しまでの段取り。煩雑なやりとりはすべて経験豊富な担当者が間に入って進めます。",
  },
  {
    title: "できるだけ高く売りたい",
    body: "地域の相場を熟知したスタッフが適正な査定を行い、住宅雑誌・ホームページ・近隣の不動産会社への紹介など、販売に結びつく広告活動を展開します。",
  },
]

const STRENGTHS = [
  {
    label: "LOCAL",
    title: "地域密着",
    body: "伊豆半島・南伊豆エリアに特化。地元の相場・環境・需要を知り尽くしているからこそ、適正な価格で売却できます。",
  },
  {
    label: "EXPERIENCE",
    title: "経験豊富な担当者",
    body: "土地・戸建・別荘まで、都会から自然への住み替えを数多く手がけてきた担当者が、査定から引き渡しまで一貫して対応します。",
  },
  {
    label: "NETWORK",
    title: "販売ネットワーク",
    body: "自社サイトへの掲載に加え、住宅雑誌や近隣不動産会社への紹介、当社にご相談中の購入希望者へのご案内まで、幅広く販路を持っています。",
  },
]

const STEPS = [
  {
    title: "不動産売却のご相談",
    body: "まずはフォームまたはお電話でご相談ください。ご相談はすべて無料です。",
  },
  {
    title: "物件の確認・調査",
    body: "後日担当者よりご連絡し、ご都合の合う日程でお客様の物件を拝見させていただきます。",
  },
  {
    title: "媒介契約・売り出し価格の決定",
    body: "売却内容についてご相談のうえ契約を結び、売り出し価格を決めます。",
  },
  {
    title: "販売活動・ご見学対応",
    body: "担当者が購入希望者を探索し、物件のご案内・見学対応を行います。",
  },
  {
    title: "売買契約・お引き渡し",
    body: "売主様・買主様間で売買契約を締結し、決済・物件のお引き渡しを行います。",
  },
]

const FAQS = [
  {
    q: "売却をお願いした場合、どのようなことをしてくれますか？",
    a: "お預かりした物件情報を幅広く広告掲載し、販売活動いたします。住宅雑誌・ホームページへの掲載、近隣の不動産会社への紹介をし、購入希望者様にご紹介いたします。既に当社にご相談頂いている購入希望者への物件紹介も併せて行います。",
  },
  {
    q: "相談にお金はかかりますか？",
    a: "ご相談は全て無料で承っております。お気軽にご利用ください。",
  },
  {
    q: "相談後はすぐに売却しなければいけないですか？",
    a: "いいえ。ご都合に合わせて売却時期を設定できます。まずはお気軽にご相談ください。",
  },
]

const STATS = [
  { value: "¥0", label: "ご相談・査定は無料", sub: "FREE CONSULTATION" },
  { value: "9–18", label: "お電話受付時間", sub: "OPEN HOURS" },
  { value: "5", label: "ステップで売却完了", sub: "SIMPLE STEPS" },
]

const TEL = "0558-64-8880"

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: EASE },
}

function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p
      className={light ? "text-[#f6f2ea]/50" : "text-[#a97e52]"}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "13px",
        letterSpacing: "0.35em",
      }}
    >
      {children}
    </p>
  )
}

/** 無限マーキー */
function Marquee({ children, dark = false }: { children: string; dark?: boolean }) {
  const items = Array.from({ length: 6 }, () => children)
  return (
    <div
      className={`overflow-hidden border-y py-3.5 ${
        dark
          ? "border-[#f6f2ea]/10 bg-[#2e2822]"
          : "border-[#38332c]/10 bg-[#faf8f3]"
      }`}
    >
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {[...items, ...items].map((text, i) => (
          <span
            key={i}
            className={`flex items-center gap-8 pr-8 text-[15px] tracking-[0.3em] whitespace-nowrap ${
              dark ? "text-[#f6f2ea]/65" : "text-[#38332c]/55"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {text}
            <span className="h-1 w-1 rounded-full bg-[#a97e52]/70" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function SalesPageContent({ sideImage }: Props) {
  const formRef = useRef<HTMLDivElement>(null)
  const [showBar, setShowBar] = useState(false)

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.9
      const nearForm =
        formRef.current &&
        formRef.current.getBoundingClientRect().top < window.innerHeight * 0.75
      setShowBar(pastHero && !nearForm)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <main className="bg-[#faf8f3] text-[#38332c]">
      {/* ヒーロー */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          <Image
            src={sideImage}
            alt=""
            fill
            className="object-cover saturate-[0.9] sepia-[0.12]"
            sizes="100vw"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#211a12]/80 via-[#211a12]/30 to-[#211a12]/25" />

        {/* 巨大ウォーターマーク */}
        <motion.p
          aria-hidden
          className="pointer-events-none absolute -right-4 top-[8vh] select-none leading-[0.85] text-[#f6f2ea]/[0.12] lg:top-[4vh]"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(120px,22vw,340px)" }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
        >
          SELL
        </motion.p>

        <div className="relative mx-auto w-full max-w-screen-xl px-6 pb-20 lg:px-12 lg:pb-28">
          <motion.p
            className="mb-7 text-[#e8d9c3]/85"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              letterSpacing: "0.4em",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          >
            SELL YOUR PROPERTY — MINAMI-IZU
          </motion.p>

          <h1 className="font-serif font-light leading-[1.25] text-[#faf6ee]">
            {["大切な不動産だから、", "安心して任せられる相手に。"].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block text-[clamp(34px,5.6vw,76px)]"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.35 + i * 0.14 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-[600px] text-[14px] leading-[2.2] text-[#f6f2ea]/85"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
          >
            伊豆エリアの不動産売却は、地域密着のサイファーム南伊豆へ。
            経験豊富な担当者が、査定からお引き渡しまで丁寧にサポートいたします。
            しつこい営業は一切いたしません。まずはお話だけでもお気軽に。
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          >
            <button
              type="button"
              onClick={scrollToForm}
              className="group relative inline-flex items-center overflow-hidden rounded-[6px] bg-[#faf6ee] px-9 py-3.5 text-[13px] font-medium tracking-[0.15em] text-[#38332c]"
            >
              <span className="absolute inset-0 -translate-x-full bg-[#a97e52] transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative transition-colors duration-500 group-hover:text-white">
                無料で売却相談する
              </span>
            </button>
            <a
              href={`tel:${TEL.replace(/-/g, "")}`}
              className="inline-flex items-baseline gap-2.5 text-[#f6f2ea]/90 transition-colors hover:text-white"
            >
              <Phone size={15} strokeWidth={1.5} className="translate-y-0.5" />
              <span
                className="text-[24px] font-light tracking-[0.08em] tabular-nums"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                {TEL}
              </span>
              <span className="text-[11px] text-[#f6f2ea]/60">9:00–18:00 ※年末年始を除く</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* マーキー */}
      <Marquee dark>
        FREE CONSULTATION — ご相談・査定無料 — SAIFARM MINAMI-IZU —
      </Marquee>

      {/* 数字で見る — スタッツ */}
      <section className="mx-auto max-w-screen-xl px-6 py-16 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.sub}
              className="border-l-2 border-[#a97e52]/40 pl-6 lg:pl-8"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
            >
              <p
                className="text-[clamp(48px,6vw,76px)] font-light leading-none tracking-[0.02em] text-[#38332c] tabular-nums"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                {stat.value}
              </p>
              <p className="mt-3 text-[14px] text-[#38332c]/75">{stat.label}</p>
              <p
                className="mt-1.5 text-[11px] tracking-[0.28em] text-[#a97e52]/80"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* お悩み — 番号付き罫線リスト */}
      <section className="mx-auto max-w-screen-xl px-6 pb-20 lg:px-12 lg:pb-32">
        <motion.div {...fadeUp}>
          <SectionLabel>CONCERNS</SectionLabel>
          <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] font-light leading-[1.4] text-[#38332c]">
            こんなお悩みは
            <br className="lg:hidden" />
            ありませんか？
          </h2>
        </motion.div>

        <div className="mt-12 border-t border-[#38332c]/10 lg:mt-16">
          {CONCERNS.map((item, i) => (
            <motion.div
              key={item.title}
              className="group grid grid-cols-1 gap-3 border-b border-[#38332c]/10 py-8 transition-colors duration-500 hover:bg-[#f3eee6]/70 lg:grid-cols-12 lg:items-baseline lg:gap-10 lg:py-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
            >
              <p
                className="text-[15px] tracking-[0.2em] text-[#a97e52]/70 tabular-nums transition-colors duration-300 group-hover:text-[#a97e52] lg:col-span-1"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-serif text-[19px] font-light leading-[1.6] text-[#38332c]/90 lg:col-span-5 lg:text-[22px]">
                {item.title}
              </h3>
              <p className="text-[13px] leading-[2.1] text-[#38332c]/55 lg:col-span-6">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 私たちが解決します — エスプレッソのステートメント + 強み */}
      <section className="relative overflow-hidden bg-[#2e2822] px-6 py-20 text-[#f6f2ea] lg:py-32">


        <div className="relative mx-auto max-w-screen-xl lg:px-6">
          <motion.div {...fadeUp}>
            <SectionLabel light>OUR APPROACH</SectionLabel>
            <h2 className="mt-6 max-w-[820px] font-serif text-[clamp(26px,3.8vw,48px)] font-light leading-[1.6] text-[#faf6ee]">
              そのお悩み、
              <br />
              サイファーム南伊豆が
              <span className="relative inline-block">
                解決します。
                <motion.span
                  className="absolute -bottom-1 left-0 h-px w-full origin-left bg-[#cfa678]/80"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: EASE, delay: 0.5 }}
                />
              </span>
            </h2>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-12 border-t border-[#f6f2ea]/15 pt-14 lg:mt-20 lg:grid-cols-3 lg:gap-10">
            {STRENGTHS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.14 }}
              >
                <p
                  className="text-[12px] tracking-[0.3em] text-[#cfa678]/80"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {String(i + 1).padStart(2, "0")} — {s.label}
                </p>
                <h3 className="mt-4 font-serif text-[20px] font-light text-[#faf6ee] lg:text-[22px]">
                  {s.title}
                </h3>
                <p className="mt-4 text-[13px] leading-[2.1] text-[#f6f2ea]/65">{s.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-[#f6f2ea]/15 pt-10 lg:mt-20"
            {...fadeUp}
          >
            <button
              type="button"
              onClick={scrollToForm}
              className="group relative inline-flex items-center overflow-hidden rounded-[6px] bg-[#faf6ee] px-9 py-3.5 text-[13px] font-medium tracking-[0.15em] text-[#38332c]"
            >
              <span className="absolute inset-0 -translate-x-full bg-[#a97e52] transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative transition-colors duration-500 group-hover:text-white">
                無料で売却相談する
              </span>
            </button>
            <a
              href={`tel:${TEL.replace(/-/g, "")}`}
              className="inline-flex items-baseline gap-2.5 text-[#f6f2ea]/85 transition-colors hover:text-white"
            >
              <Phone size={15} strokeWidth={1.5} className="translate-y-0.5" />
              <span
                className="text-[22px] font-light tracking-[0.08em] tabular-nums"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                {TEL}
              </span>
            </a>
            <p className="w-full text-[12px] text-[#f6f2ea]/50 sm:w-auto">
              ご相談だけでも大歓迎です。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 売却の流れ — 縦タイムライン */}
      <section className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-32">
        <motion.div {...fadeUp}>
          <SectionLabel>PROCESS</SectionLabel>
          <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] font-light text-[#38332c]">
            不動産売却までの流れ
          </h2>
        </motion.div>

        <div className="mt-12 lg:mt-16">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative grid grid-cols-[72px_1fr] gap-x-5 pb-12 last:pb-0 lg:grid-cols-[130px_1fr] lg:gap-x-10 lg:pb-16"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            >
              {/* 番号と縦線 */}
              <div className="relative flex flex-col items-center">
                <p
                  className="leading-[0.9] text-[#a97e52]/25 tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(44px,6vw,88px)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                {i < STEPS.length - 1 && (
                  <span className="mt-5 w-px flex-1 bg-[#a97e52]/25" />
                )}
              </div>

              <div className="pb-2 pt-1 lg:pt-3">
                <h3 className="font-serif text-[18px] font-light leading-[1.6] text-[#38332c]/90 lg:text-[23px]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[560px] text-[13px] leading-[2.1] text-[#38332c]/55">
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* マーキー */}
      <Marquee>
        まずはお気軽にご相談ください — FREE CONSULTATION — 売却時期はご都合に合わせて —
      </Marquee>

      {/* FAQ */}
      <section className="bg-[#f3eee6]">
        <div className="mx-auto max-w-screen-xl px-6 py-20 lg:px-12 lg:py-32">
          <motion.div {...fadeUp}>
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] font-light text-[#38332c]">
              よくあるご質問
            </h2>
          </motion.div>

          <div className="mt-12 border-t border-[#38332c]/10 lg:mt-16">
            {FAQS.map((item, i) => (
              <motion.div
                key={item.q}
                className="grid grid-cols-1 gap-4 border-b border-[#38332c]/10 py-8 lg:grid-cols-2 lg:gap-14 lg:py-10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
              >
                <h3 className="flex gap-4 font-serif text-[16px] font-light leading-[1.8] text-[#38332c]/90 lg:text-[19px]">
                  <span
                    className="text-[14px] tracking-[0.1em] text-[#a97e52]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Q.
                  </span>
                  {item.q}
                </h3>
                <p className="flex gap-4 text-[13px] leading-[2.2] text-[#38332c]/60 lg:pl-0">
                  <span
                    className="text-[14px] tracking-[0.1em] text-[#a97e52]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    A.
                  </span>
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* フォーム */}
      <section
        ref={formRef}
        className="mx-auto max-w-screen-xl scroll-mt-24 px-6 py-20 lg:px-12 lg:py-32"
      >
        <motion.div {...fadeUp}>
          <SectionLabel>CONTACT</SectionLabel>
          <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,44px)] font-light text-[#38332c]">
            まずは、お話だけでも。
          </h2>
          <p className="mt-5 max-w-[600px] text-[13px] leading-[2.1] text-[#38332c]/55">
            下記フォームに不動産の情報をご入力ください。担当者より通常2〜3営業日以内にご連絡いたします。
            ご相談・査定はすべて無料、売却を無理におすすめすることはありません。
            お電話（{TEL} / 9時〜18時 ※年末年始を除く）でも承ります。
          </p>
        </motion.div>

        <div className="mt-12 lg:mt-16">
          <SellingForm />
        </div>
      </section>

      {/* 追従CTAバー */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f6f2ea]/10 bg-[#2e2822]/95 backdrop-blur-md"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-6 py-3.5 lg:px-12">
              <p className="hidden text-[12px] tracking-[0.1em] text-[#f6f2ea]/70 sm:block">
                ご相談・査定はすべて無料です
              </p>
              <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end sm:gap-6">
                <a
                  href={`tel:${TEL.replace(/-/g, "")}`}
                  className="inline-flex items-baseline gap-2 text-[#f6f2ea]/90 transition-colors hover:text-white"
                >
                  <Phone size={13} strokeWidth={1.5} className="translate-y-0.5" />
                  <span
                    className="text-[18px] font-light tracking-[0.06em] tabular-nums"
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    {TEL}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="rounded-[6px] bg-[#faf6ee] px-6 py-2.5 text-[12px] font-medium tracking-[0.14em] text-[#38332c] transition-colors duration-300 hover:bg-white"
                >
                  無料で売却相談
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
