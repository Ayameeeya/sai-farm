"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInterval } from "usehooks-ts"
import Link from "next/link"

function wrap(min: number, max: number, v: number): number {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

type SlideItem = {
  src: string
  title: string
  text: string
  url: string
}

type Props = {
  data: SlideItem[]
  dark?: boolean
}

export function ImageSlider({ data, dark = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const imageIndex = wrap(0, data.length, currentIndex)

  useInterval(() => setCurrentIndex((i) => i + 1), 5500)

  const next = () => setCurrentIndex((i) => i + 1)
  const prev = () => setCurrentIndex((i) => i - 1)

  const current = data[imageIndex]
  const arrowClass = dark
    ? "text-black/50 hover:text-black"
    : "text-white/50 hover:text-white"

  return (
    <div className="relative w-full flex items-start justify-center pb-10 lg:pb-24">

      {/* SP: 左タップ */}
      <button onClick={prev} className="absolute left-0 z-[99] lg:hidden w-8 h-[450px] bg-transparent" aria-label="前へ" />

      {/* PC: 左矢印 */}
      <button
        onClick={prev}
        className={`hidden lg:flex items-start pt-[90px] justify-center w-[72px] h-[450px] bg-transparent transition-colors ${arrowClass}`}
        aria-label="前へ"
      >
        <svg width="28" height="56" viewBox="0 0 28 56" fill="none">
          <path d="M22 4 L4 28 L22 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* スライドエリア */}
      <div className="relative w-full lg:w-[80%]">
        {/* 画像（ここだけ overflow-hidden） */}
        <div className="relative h-[450px] overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.img
              key={current.src + imageIndex}
              src={current.src}
              alt={current.title}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1, transition: { duration: 0.75, ease: "easeOut" } }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              className="absolute top-0 left-0 h-[450px] w-full object-cover z-[50]"
            />
          </AnimatePresence>

          {/* ページネーションドット */}
          <div className="absolute bottom-5 left-6 flex gap-2.5 z-[75]">
            {data.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all duration-400 rounded-full ${
                  i === imageIndex
                    ? "w-6 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        {/* InfoCard — グラスモーフィズム */}
        <AnimatePresence mode="wait">
          <motion.div
            key={"card-" + imageIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute bottom-0 right-0 lg:bottom-[-28px] lg:right-[-36px] w-full lg:w-[460px] z-[75] p-8 lg:p-10"
            style={{
              background: "rgba(255, 255, 255, 0.18)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.35)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            }}
          >
            <p className="text-[10px] tracking-[0.3em] text-black/50 uppercase mb-3">Featured</p>
            <h3 className="font-serif text-[17px] lg:text-[20px] font-light text-black mb-3 leading-snug">
              {current.title}
            </h3>
            <p className="text-[12px] leading-[1.9] text-black/60 mb-6 line-clamp-3">
              {current.text}
            </p>
            {/* 黒ボタン */}
            <Link
              href={current.url}
              className="inline-flex items-center justify-center gap-0 text-[12px] tracking-[0.15em] bg-black text-white px-5 py-2.5 hover:bg-stone-700 transition-colors duration-300"
            >
              詳細を見る
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PC: 右矢印 */}
      <button
        onClick={next}
        className={`hidden lg:flex items-start pt-[90px] justify-center w-[100px] pl-10 h-[450px] bg-transparent transition-colors ${arrowClass}`}
        aria-label="次へ"
      >
        <svg width="28" height="56" viewBox="0 0 28 56" fill="none">
          <path d="M6 4 L24 28 L6 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* SP: 右タップ */}
      <button onClick={next} className="absolute right-0 z-[99] lg:hidden w-12 h-[450px] bg-transparent" aria-label="次へ" />
    </div>
  )
}
