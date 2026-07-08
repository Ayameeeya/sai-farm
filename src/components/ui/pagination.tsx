import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  currentPage: number
  totalPages: number
  buildHref: (page: number) => string
}

export function Pagination({ currentPage, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <Link
        href={hasPrev ? buildHref(currentPage - 1) : "#"}
        aria-disabled={!hasPrev}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-[6px] transition-colors duration-300",
          hasPrev
            ? "text-black/60 hover:bg-black/50 hover:text-white"
            : "pointer-events-none text-black/20",
        )}
      >
        <ChevronLeft size={18} />
      </Link>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-[6px] text-[13px] tabular-nums transition-colors duration-300",
            p === currentPage
              ? "bg-black text-white"
              : "text-black/60 hover:bg-black/50 hover:text-white",
          )}
        >
          {p}
        </Link>
      ))}

      <Link
        href={hasNext ? buildHref(currentPage + 1) : "#"}
        aria-disabled={!hasNext}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-[6px] transition-colors duration-300",
          hasNext
            ? "text-black/60 hover:bg-black/50 hover:text-white"
            : "pointer-events-none text-black/20",
        )}
      >
        <ChevronRight size={18} />
      </Link>
    </div>
  )
}
