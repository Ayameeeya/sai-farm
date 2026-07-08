import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = { href: string; label: string; active: boolean }

type Props = {
  tabs: Tab[]
}

/** Gatsby フィルタボタン: 黒アクティブ / ホバーで半透明黒 */
export function FilterTabs({ tabs }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded-[6px] px-4 py-2 text-[13px] tracking-[0.06em] transition-colors duration-300",
            tab.active
              ? "bg-black/80 text-white"
              : "bg-transparent text-black/70 hover:bg-black/50 hover:text-white",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
