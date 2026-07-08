import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = { href: string; label: string; active: boolean }

/** Floema Journal 風 — 白ピル + アクティブ黒 */
export function JournalFilter({ tabs }: { tabs: Tab[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded-full border px-4 py-2 text-[13px] tracking-[0.04em] transition-all duration-300",
            tab.active
              ? "border-black bg-black text-white"
              : "border-black/10 bg-white text-black/55 hover:border-black/25 hover:text-black",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
