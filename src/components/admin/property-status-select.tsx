"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updatePropertyStatus } from "@/app/admin/actions"

const OPTIONS = [
  { value: 1, label: "公開中" },
  { value: 2, label: "新着物件" },
  { value: 3, label: "価格変更" },
  { value: 7, label: "商談中" },
  { value: 8, label: "ご成約" },
  { value: 9, label: "非公開" },
]

/** ステータス別バッジ配色 — 公開中は青・新着は赤・商談中はネオン黄緑のビビッドカラー */
const BADGE: Record<number, string> = {
  1: "bg-blue-600 text-white",
  2: "bg-red-600 text-white",
  3: "bg-yellow-400 text-black font-medium",
  7: "bg-lime-400 text-black font-medium",
  8: "bg-black text-white",
  9: "bg-black/8 text-black/50",
}

export function PropertyStatusSelect({
  propertyId,
  status,
}: {
  propertyId: string
  status: number
}) {
  const router = useRouter()
  const [current, setCurrent] = useState(status)
  const [pending, startTransition] = useTransition()

  const onChange = (value: number) => {
    const prev = current
    setCurrent(value)
    startTransition(async () => {
      const result = await updatePropertyStatus(propertyId, value)
      if (result.error) {
        setCurrent(prev)
        window.alert(`ステータスの変更に失敗しました: ${result.error}`)
        return
      }
      router.refresh()
    })
  }

  const label = OPTIONS.find((o) => o.value === current)?.label ?? "公開中"

  return (
    <span
      className={`relative inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] transition-opacity ${pending ? "opacity-50" : ""} ${BADGE[current] ?? "bg-blue-600 text-white"}`}
    >
      {label}
      {/* select は透明で重ね、幅はバッジのテキストにぴったり合わせる */}
      <select
        value={current}
        disabled={pending}
        onChange={(e) => onChange(Number(e.target.value))}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
        aria-label="ステータスを変更"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </span>
  )
}
