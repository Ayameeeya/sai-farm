"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Newspaper,
  Megaphone,
  Landmark,
  Tags,
  Wrench,
  MapPinned,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

/** 日常的に使うメニュー */
const MAIN_ITEMS = [
  { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/admin/properties", label: "物件", icon: Building2 },
  { href: "/admin/articles", label: "ブログ記事", icon: Newspaper },
  { href: "/admin/news", label: "お知らせ", icon: Megaphone },
]

/** 変更頻度の低い設定系メニュー */
const SETTINGS_ITEMS = [
  { href: "/admin/services", label: "サービス", icon: Wrench },
  { href: "/admin/facilities", label: "周辺施設", icon: MapPinned },
  { href: "/admin/taxonomy", label: "タグ・カテゴリ", icon: Tags },
  { href: "/admin/company", label: "会社情報", icon: Landmark },
]

function AdminLogo() {
  return (
    <>
      <Image
        src="/common/logo-mark-black.png"
        alt=""
        width={222}
        height={105}
        className="h-[16px] w-auto"
      />
      <span
        className="text-[13px] font-semibold tracking-[0.25em] text-black uppercase"
        style={{ fontFamily: "var(--font-barlow)" }}
      >
        Admin
      </span>
    </>
  )
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin" || pathname === "/admin/"
      : pathname.startsWith(href)

  return (
    <>
      <nav className="flex-1">
        <div className="space-y-1">
          {MAIN_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[13px] transition-colors duration-200",
                  isActive(item.href)
                    ? "bg-black text-white"
                    : "text-black/60 hover:bg-black/5 hover:text-black",
                )}
              >
                <Icon size={15} strokeWidth={1.5} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <p className="mt-7 mb-2 px-3 text-[10px] font-medium tracking-[0.2em] text-black/30 uppercase">
          設定
        </p>
        <div className="space-y-0.5">
          {SETTINGS_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-[8px] px-3 py-2 text-[12px] transition-colors duration-200",
                  isActive(item.href)
                    ? "bg-black text-white"
                    : "text-black/45 hover:bg-black/5 hover:text-black",
                )}
              >
                <Icon size={14} strokeWidth={1.5} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="space-y-1 border-t border-black/8 pt-4">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[13px] text-black/60 transition-colors duration-200 hover:bg-black/5 hover:text-black"
        >
          <ExternalLink size={15} strokeWidth={1.5} />
          サイトを表示
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-[13px] text-black/60 transition-colors duration-200 hover:bg-black/5 hover:text-black"
        >
          <LogOut size={15} strokeWidth={1.5} />
          ログアウト
        </button>
      </div>
    </>
  )
}

export function AdminNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      {/* Mobile: top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/8 bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={close}>
          <AdminLogo />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          className="flex h-9 w-9 items-center justify-center rounded-[8px] text-black/70 transition-colors duration-200 hover:bg-black/5"
        >
          {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </header>

      {/* Mobile: drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={close}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-[260px] flex-col overflow-y-auto bg-white px-4 py-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between px-2">
              <Link href="/admin" className="flex items-center gap-2.5" onClick={close}>
                <AdminLogo />
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="メニューを閉じる"
                className="flex h-9 w-9 items-center justify-center rounded-[8px] text-black/70 transition-colors duration-200 hover:bg-black/5"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <NavContent onNavigate={close} />
          </div>
        </div>
      )}

      {/* Desktop: sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col border-r border-black/8 bg-white px-4 py-6 lg:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-2">
          <AdminLogo />
        </Link>
        <NavContent />
      </aside>
    </>
  )
}
