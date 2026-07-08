"use client"

import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type Category = { id: string; slug: string; name: string }
type Area = { id: string; slug: string; name: string }

type Props = {
  categories: Category[]
  areas: Area[]
  currentCategory: string
  currentArea?: string
  currentMin?: string
  currentMax?: string
}

export function CategoryFilter({
  categories,
  areas,
  currentCategory,
  currentArea,
  currentMin,
  currentMax,
}: Props) {
  const hasDetailFilter = Boolean(currentArea || currentMin || currentMax)
  const [showFilter, setShowFilter] = useState(hasDetailFilter)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleAreaChange = (areaSlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (areaSlug) params.set("area", areaSlug)
    else params.delete("area")
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePriceChange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min) params.set("min", min)
    else params.delete("min")
    if (max) params.set("max", max)
    else params.delete("max")
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const tabs = [
    { href: "/properties/property-categories/all/", label: "すべて", active: currentCategory === "all" },
    ...categories.map((cat) => ({
      href: `/properties/property-categories/${cat.slug}/`,
      label: cat.name,
      active: currentCategory === cat.slug,
    })),
  ]

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-black/15 pb-5">
        <nav className="flex flex-wrap items-baseline gap-x-7 gap-y-3">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "border-b pb-1 text-[14px] tracking-[0.08em] transition-colors duration-300",
                tab.active
                  ? "border-black text-black"
                  : "border-transparent text-black/40 hover:text-black",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 text-[12px] tracking-[0.15em] text-black/50 uppercase transition-colors duration-300 hover:text-black"
        >
          絞り込み
          <Plus
            size={14}
            strokeWidth={1.5}
            className={cn("transition-transform duration-300", showFilter && "rotate-45")}
          />
        </button>
      </div>

      {showFilter && (
        <div className="grid grid-cols-1 gap-x-14 gap-y-6 border-b border-black/15 py-6 sm:grid-cols-2">
          <div>
            <label className="mb-3 block text-[10px] tracking-[0.3em] text-black/40 uppercase">
              エリア
            </label>
            <select
              defaultValue={currentArea ?? ""}
              onChange={(e) => handleAreaChange(e.target.value)}
              className="w-full border-b border-black/20 bg-transparent pb-2 text-[14px] focus:border-black focus:outline-none"
            >
              <option value="">すべてのエリア</option>
              {areas.map((a) => (
                <option key={a.id} value={a.slug}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-3 block text-[10px] tracking-[0.3em] text-black/40 uppercase">
              価格（万円）
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="下限"
                defaultValue={currentMin ?? ""}
                className="w-full border-b border-black/20 bg-transparent pb-2 text-[14px] placeholder:text-black/30 focus:border-black focus:outline-none"
                onBlur={(e) => handlePriceChange(e.target.value, currentMax ?? "")}
              />
              <span className="shrink-0 text-[13px] text-black/40">〜</span>
              <input
                type="number"
                placeholder="上限"
                defaultValue={currentMax ?? ""}
                className="w-full border-b border-black/20 bg-transparent pb-2 text-[14px] placeholder:text-black/30 focus:border-black focus:outline-none"
                onBlur={(e) => handlePriceChange(currentMin ?? "", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
