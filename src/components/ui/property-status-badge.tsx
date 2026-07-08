import { cn } from "@/lib/utils"
import { getPropertyStatusLabel } from "@/lib/property-status"

type Props = {
  status: number
  className?: string
}

/** ステータス別配色 — モノトーン + 赤1色のグラスピル */
const STATUS_STYLES: Record<number, string> = {
  2: "bg-red-600/80 text-white ring-white/25",       // 新着物件 — 赤（唯一のアクセント）
  3: "bg-white/85 text-black/70 ring-white/40",      // 価格変更 — ホワイトグラス
  7: "bg-[#141311]/65 text-white/90 ring-white/15",  // 商談中 — スモークブラック
  8: "bg-[#e7e3da]/80 text-black/50 ring-white/40",  // ご成約 — ウォームグレー（後退色）
}

export function PropertyStatusBadge({ status, className }: Props) {
  const label = getPropertyStatusLabel(status)
  if (!label) return null

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-[6px] text-[10.5px] font-medium tracking-[0.18em] ring-1 backdrop-blur-md shadow-[0_4px_14px_-4px_rgba(13,12,10,0.35)]",
        STATUS_STYLES[status] ?? "bg-[#e7e3da]/80 text-black/50 ring-white/40",
        className,
      )}
    >
      {label}
    </span>
  )
}
