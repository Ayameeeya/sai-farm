import Link from "next/link"
import { Building2, Newspaper, Megaphone, ArrowUpRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata = { title: "管理画面" }

export default async function AdminDashboard() {
  const supabase = await createClient()
  const [
    { count: propertyCount },
    { count: activeCount },
    { count: articleCount },
    { count: newsCount },
  ] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("properties").select("id", { count: "exact", head: true }).lt("status", 7),
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("news").select("id", { count: "exact", head: true }),
  ])

  const cards = [
    { label: "物件（全体）", value: propertyCount ?? 0, href: "/admin/properties", icon: Building2 },
    { label: "公開中の物件", value: activeCount ?? 0, href: "/admin/properties", icon: Building2 },
    { label: "ブログ記事", value: articleCount ?? 0, href: "/admin/articles", icon: Newspaper },
    { label: "お知らせ", value: newsCount ?? 0, href: "/admin/news", icon: Megaphone },
  ]

  return (
    <div>
      <h1 className="mb-8 font-serif text-[24px] font-light text-black">ダッシュボード</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-[12px] bg-white p-6 ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_12px_40px_-12px_rgba(13,12,10,0.15)]"
            >
              <div className="flex items-center justify-between">
                <Icon size={18} strokeWidth={1.5} className="text-black/40" />
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.5}
                  className="text-black/25 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
              <p
                className="mt-5 text-[32px] font-light leading-none tabular-nums text-black"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                {card.value}
              </p>
              <p className="mt-2 text-[12px] text-black/50">{card.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <p className="text-[13px] font-medium text-black/70">クイックアクション</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/properties/new"
            className="rounded-[6px] bg-black px-5 py-2.5 text-[13px] text-white transition-colors hover:bg-black/85"
          >
            物件を登録
          </Link>
          <Link
            href="/admin/articles/new"
            className="rounded-[6px] border border-black/15 px-5 py-2.5 text-[13px] text-black/70 transition-colors hover:border-black/40 hover:text-black"
          >
            記事を AI 生成
          </Link>
        </div>
      </div>
    </div>
  )
}
