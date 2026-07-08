import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * 管理画面一覧テーブルのソート可能ヘッダー。
 * クリックで ?sort=key&dir=asc|desc をトグルする。
 */
export function SortTh({
  label,
  sortKey,
  currentSort,
  currentDir,
  basePath,
  defaultDir = "asc",
  className,
}: {
  label: string
  sortKey: string
  currentSort: string
  currentDir: "asc" | "desc"
  basePath: string
  /** 初回クリック時の並び順（日付などは desc が自然） */
  defaultDir?: "asc" | "desc"
  className?: string
}) {
  const active = currentSort === sortKey
  const nextDir = active ? (currentDir === "asc" ? "desc" : "asc") : defaultDir

  return (
    <th className={cn("whitespace-nowrap px-4 py-3.5 font-medium first:px-5", className)}>
      <Link
        href={`${basePath}?sort=${sortKey}&dir=${nextDir}`}
        className={`inline-flex items-center gap-1 transition-colors hover:text-black ${active ? "text-black" : ""}`}
      >
        {label}
        <span className="text-[9px]">{active ? (currentDir === "asc" ? "▲" : "▼") : ""}</span>
      </Link>
    </th>
  )
}
