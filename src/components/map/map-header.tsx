"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRightFromSquare } from "lucide-react"
import { BAR_H } from "@/components/top/top-page-nav"

/** 地図ページ: グローバルナビ下の検索・一覧リンクオーバーレイ */
export function MapToolbar({ children }: { children?: React.ReactNode }) {
  if (!children) return null

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-[65] px-5"
      style={{ top: BAR_H + 14 }}
    >
      <div className="relative flex items-start justify-center">
        {children}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.25 } }}
          className="pointer-events-auto absolute right-0 top-0"
        >
          <Link
            href="/properties/property-categories/all/"
            className="flex h-11 items-center gap-2 rounded-full bg-white/95 px-5 text-[12.5px] tracking-[0.05em] text-black/75 shadow-[0_14px_40px_-10px_rgba(13,12,10,0.35)] ring-1 ring-black/5 backdrop-blur-md transition-colors hover:text-black"
          >
            物件を一覧で表示
            <ArrowUpRightFromSquare size={13} strokeWidth={1.5} className="text-black/45" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
