"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { X, Phone } from "lucide-react"

const MENU_LINKS = [
  { href: "/", label: "Home", en: "TOP" },
  { href: "/about-us/", label: "私たちについて", en: "ABOUT US" },
  { href: "/properties/property-categories/land/", label: "土地を買う", en: "LAND" },
  { href: "/properties/property-categories/house/", label: "住まいを買う", en: "HOUSES" },
  { href: "/map/", label: "エリアから探す", en: "MAP" },
  { href: "/sales/", label: "不動産を売る", en: "SELL" },
  { href: "/services/", label: "サービス", en: "SERVICES" },
  { href: "/articles/", label: "ブログ記事", en: "JOURNAL" },
  { href: "/contact/", label: "お問い合わせ", en: "CONTACT" },
]

const panelVariants: Variants = {
  hidden: { x: "108%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 },
  },
  exit: {
    x: "108%",
    transition: { duration: 0.32, ease: [0.55, 0, 0.75, 0.05] },
  },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.12 + i * 0.045, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function MenuContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* 背景オーバーレイ */}
      <motion.div
        className="fixed inset-0 z-[74] bg-black/35 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* ドロワーパネル */}
      <motion.div
        className="fixed inset-y-3 right-3 z-[75] flex flex-col overflow-hidden rounded-[10px] bg-[#0a0a0a] text-white"
        style={{ width: "min(420px, calc(100vw - 72px))" }}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-7 pt-6 pb-2 lg:px-9">
          <p
            className="text-white/40"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              letterSpacing: "0.35em",
            }}
          >
            MENU
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors duration-300 hover:border-white/50 hover:text-white"
          >
            <X size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* ナビリンク */}
        <nav className="flex-1 overflow-y-auto px-7 pt-2 lg:px-9">
          {MENU_LINKS.map((link, i) => (
            <motion.div
              key={link.href}
              custom={i}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={link.href}
                onClick={onClose}
                className="group flex items-baseline gap-4 border-b border-white/10 py-[13px] transition-colors duration-300"
              >
                <span className="font-serif text-[19px] font-light leading-snug text-white/80 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-white">
                  {link.label}
                </span>
                <span
                  className="ml-auto hidden text-[10px] tracking-[0.28em] text-white/25 transition-colors duration-300 group-hover:text-white/55 sm:block"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {link.en}
                </span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* フッター — 連絡先 */}
        <motion.div
          className="px-7 pt-5 pb-7 lg:px-9"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <p
                className="mb-2 text-[10px] tracking-[0.28em] text-white/35 uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                SAIFARM MINAMI-IZU
              </p>
              <p className="text-[11px] leading-relaxed text-white/45">
                静岡県賀茂郡南伊豆町伊浜2074
              </p>
              <a
                href="tel:0558-64-8880"
                className="mt-1.5 inline-flex items-baseline gap-2 text-white/80 transition-colors hover:text-white"
              >
                <Phone size={11} strokeWidth={1.5} className="translate-y-px" />
                <span
                  className="text-[17px] font-light tracking-[0.06em] tabular-nums"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  0558-64-8880
                </span>
              </a>
            </div>
            <Image
              src="/common/logo-mark-white.png"
              alt=""
              width={222}
              height={105}
              className="h-[30px] w-auto opacity-40"
            />
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
