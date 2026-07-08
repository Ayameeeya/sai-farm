"use client"

import { motion } from "framer-motion"
import FlowingMenu from "@/components/FlowingMenu"
import { MEDIA } from "@/lib/media"

const PURPOSES = [
  {
    text: "土地を買う",
    en: "Buy Land",
    link: "/properties/property-categories/land/",
    image: MEDIA.IMG_1744,
  },
  {
    text: "住まいを買う",
    en: "Buy House",
    link: "/properties/property-categories/house/",
    image: MEDIA.HOUSE_2654738,
  },
  {
    text: "エリアから探す",
    en: "Search by Area",
    link: "/map/",
    image: MEDIA.ARTICLES_24029746,
  },
  {
    text: "不動産の売却",
    en: "Sell Property",
    link: "/sales/",
    image: MEDIA.IMG_1729,
  },
]

export function PurposeSection() {
  const items = PURPOSES

  return (
    <section className="bg-[#0e0e0e] overflow-hidden">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-8 lg:px-20 pt-16 lg:pt-28 pb-10 lg:pb-14"
      >
        <p
          className="text-white/45 mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "15px",
            letterSpacing: "0.35em",
          }}
        >
          PURPOSE
        </p>
        <h2 className="font-serif text-[clamp(40px,5.5vw,84px)] font-light text-white leading-[1.05]">
          目的から選ぶ
        </h2>
      </motion.div>

      {/* FlowingMenu — 公式コンポーネント */}
      <div style={{ height: "clamp(256px, 28vw, 400px)" }}>
        <FlowingMenu
          items={items}
          speed={18}
          bgColor="#0e0e0e"
          textColor="rgba(255,255,255,0.82)"
          marqueeBgColor="#f0ede8"
          marqueeTextColor="#111111"
          borderColor="rgba(255,255,255,0.07)"
        />
      </div>

      {/* Bottom padding */}
      <div className="pb-12 lg:pb-20" />

    </section>
  )
}
