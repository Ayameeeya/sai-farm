"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence } from "framer-motion"
import { MenuContent } from "@/components/top/menu-content"
import { BAR_H } from "@/components/top/top-page-nav"

const NAV_LINKS = [
  { href: "/properties/property-categories/land/", label: "土地を買う" },
  { href: "/properties/property-categories/house/", label: "住まいを買う" },
  { href: "/sales/", label: "売る" },
]

export const SUB_PAGE_PT = BAR_H + 24

export function SubPageNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div
        className="fixed top-[10px] left-1/2 z-50 flex -translate-x-1/2 items-center justify-center gap-3 rounded-[10px] bg-black px-4 lg:gap-4"
        style={{
          height: BAR_H,
          width: "min(480px, calc(100% - 24px))",
          fontFamily: "var(--font-barlow)",
        }}
      >
        <Link href="/">
          <Image
            src="/common/logo-mark-white.png"
            alt="Saifarm"
            width={222}
            height={105}
            className="h-[15px] w-auto"
          />
        </Link>

        <span className="h-3 w-px bg-white/20" />

        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="hidden whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white lg:block"
          >
            {l.label}
          </Link>
        ))}

        <span className="hidden h-3 w-px bg-white/20 lg:block" />

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="メニュー"
          className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
        >
          <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Menu</span>
          <span className="flex flex-col gap-[4px]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-px w-[14px] bg-current" />
            ))}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && <MenuContent onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
