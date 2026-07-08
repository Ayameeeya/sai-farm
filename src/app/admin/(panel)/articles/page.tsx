import Link from "next/link"
import Image from "next/image"
import { Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SortTh } from "@/components/admin/sort-th"
import { DragScroll } from "@/components/admin/drag-scroll"

export const metadata = { title: "記事管理" }

type Row = {
  id: string
  title: string
  slug: string
  published: boolean
  featured_photo_url: string | null
  updated_at: string
  category: { name: string } | null
}

const SORTERS: Record<string, (a: Row, b: Row) => number> = {
  title: (a, b) => a.title.localeCompare(b.title, "ja"),
  category: (a, b) => (a.category?.name ?? "").localeCompare(b.category?.name ?? "", "ja"),
  published: (a, b) => Number(a.published) - Number(b.published),
  updated: (a, b) => a.updated_at.localeCompare(b.updated_at),
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; dir?: string }>
}) {
  const params = await searchParams
  const sort = params.sort && params.sort in SORTERS ? params.sort : "updated"
  const dir: "asc" | "desc" = params.dir === "asc" ? "asc" : "desc"

  const supabase = await createClient()
  const { data } = await supabase
    .from("articles")
    .select("id, title, slug, published, featured_photo_url, updated_at, category:article_categories(name)")

  const articles = ((data ?? []) as unknown as Row[]).sort(
    (a, b) => SORTERS[sort](a, b) * (dir === "asc" ? 1 : -1),
  )

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-[24px] font-light text-black">記事管理</h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[6px] bg-black px-5 py-2.5 text-[13px] text-white transition-colors hover:bg-black/85"
        >
          <Sparkles size={14} strokeWidth={1.5} />
          AI で記事を作成
        </Link>
      </div>

      <DragScroll className="rounded-[12px] bg-white ring-1 ring-black/5">
        <table className="w-full whitespace-nowrap text-left text-[13px]">
          <thead>
            <tr className="border-b border-black/8 text-[11px] tracking-[0.1em] text-black/45">
              <SortTh label="記事" sortKey="title" currentSort={sort} currentDir={dir} basePath="/admin/articles" />
              <SortTh label="カテゴリ" sortKey="category" currentSort={sort} currentDir={dir} basePath="/admin/articles" className="hidden sm:table-cell" />
              <SortTh label="状態" sortKey="published" currentSort={sort} currentDir={dir} basePath="/admin/articles" defaultDir="desc" />
              <SortTh label="更新日" sortKey="updated" currentSort={sort} currentDir={dir} basePath="/admin/articles" defaultDir="desc" className="hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody>
            {(articles ?? []).map((a) => (
              <tr key={a.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                <td className="px-5 py-3">
                  <Link href={`/admin/articles/${a.id}`} className="flex items-center gap-3">
                    <span className="relative block h-10 w-14 shrink-0 overflow-hidden rounded-[4px] bg-black/5">
                      {a.featured_photo_url && (
                        <Image
                          src={a.featured_photo_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block max-w-[200px] truncate font-medium text-black/85 sm:max-w-[420px]">{a.title}</span>
                      <span className="hidden max-w-[420px] truncate text-[11px] text-black/40 sm:block">/{a.slug}/</span>
                    </span>
                  </Link>
                </td>
                <td className="hidden px-4 py-3 text-black/60 sm:table-cell">
                  {(a.category as unknown as { name: string } | null)?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      a.published
                        ? "inline-flex rounded-full bg-black px-3 py-1 text-[11px] text-white"
                        : "inline-flex rounded-full bg-black/8 px-3 py-1 text-[11px] text-black/50"
                    }
                  >
                    {a.published ? "公開中" : "下書き"}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-[12px] tabular-nums text-black/45 sm:table-cell">
                  {new Date(a.updated_at).toLocaleDateString("ja-JP")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DragScroll>
    </div>
  )
}
