import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatPropertyPrice } from "@/lib/format-price"
import { PropertyStatusSelect } from "@/components/admin/property-status-select"
import { SortTh } from "@/components/admin/sort-th"
import { DragScroll } from "@/components/admin/drag-scroll"

export const metadata = { title: "物件管理" }

type Row = {
  id: string
  property_name: string
  slug: string
  status: number
  price: number | null
  address: string | null
  updated_at: string
  property_category: { name: string } | null
  area: { name: string } | null
  property_images: { image_url: string; sort_order: number }[]
}

const SORTERS: Record<string, (a: Row, b: Row) => number> = {
  name: (a, b) => a.property_name.localeCompare(b.property_name, "ja"),
  category: (a, b) =>
    `${a.property_category?.name ?? ""} ${a.area?.name ?? ""}`.localeCompare(
      `${b.property_category?.name ?? ""} ${b.area?.name ?? ""}`,
      "ja",
    ),
  price: (a, b) => (a.price ?? -1) - (b.price ?? -1),
  status: (a, b) => a.status - b.status,
  updated: (a, b) => a.updated_at.localeCompare(b.updated_at),
}

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; dir?: string }>
}) {
  const params = await searchParams
  const sort = params.sort && params.sort in SORTERS ? params.sort : "updated"
  const dir: "asc" | "desc" = params.dir === "asc" ? "asc" : "desc"

  const supabase = await createClient()
  const { data } = await supabase
    .from("properties")
    .select(
      "id, property_name, slug, status, price, address, updated_at, property_category:property_categories(name), area:areas(name), property_images(image_url, sort_order)",
    )

  const properties = ((data ?? []) as unknown as Row[]).sort(
    (a, b) => SORTERS[sort](a, b) * (dir === "asc" ? 1 : -1),
  )

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-[24px] font-light text-black">物件管理</h1>
        <Link
          href="/admin/properties/new"
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[6px] bg-black px-5 py-2.5 text-[13px] text-white transition-colors hover:bg-black/85"
        >
          <Plus size={14} strokeWidth={2} />
          物件を登録
        </Link>
      </div>

      <DragScroll className="rounded-[12px] bg-white ring-1 ring-black/5">
        <table className="w-full whitespace-nowrap text-left text-[13px]">
          <thead>
            <tr className="border-b border-black/8 text-[11px] tracking-[0.1em] text-black/45">
              <SortTh label="物件" sortKey="name" currentSort={sort} currentDir={dir} basePath="/admin/properties" />
              <SortTh label="カテゴリ / エリア" sortKey="category" currentSort={sort} currentDir={dir} basePath="/admin/properties" className="hidden sm:table-cell" />
              <SortTh label="価格" sortKey="price" currentSort={sort} currentDir={dir} basePath="/admin/properties" defaultDir="desc" />
              <SortTh label="ステータス" sortKey="status" currentSort={sort} currentDir={dir} basePath="/admin/properties" />
              <SortTh label="更新日" sortKey="updated" currentSort={sort} currentDir={dir} basePath="/admin/properties" defaultDir="desc" className="hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody>
            {(properties ?? []).map((p) => {
              const image = [...(p.property_images ?? [])].sort(
                (a, b) => a.sort_order - b.sort_order,
              )[0]?.image_url
              const category = (p.property_category as unknown as { name: string } | null)?.name
              const area = (p.area as unknown as { name: string } | null)?.name
              return (
                <tr
                  key={p.id}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]"
                >
                  <td className="px-5 py-3">
                    <Link href={`/admin/properties/${p.id}`} className="flex items-center gap-3">
                      <span className="relative block h-10 w-14 shrink-0 overflow-hidden rounded-[4px] bg-black/5">
                        {image && (
                          <Image src={image} alt="" fill className="object-cover" sizes="56px" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block max-w-[180px] truncate font-medium text-black/85 sm:max-w-[420px]">{p.property_name}</span>
                        <span className="hidden max-w-[420px] truncate text-[11px] text-black/40 sm:block">{p.address}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-black/60 sm:table-cell">
                    {[category, area].filter(Boolean).join(" / ")}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-black/70">
                    {formatPropertyPrice(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <PropertyStatusSelect propertyId={p.id} status={p.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-[12px] tabular-nums text-black/45 sm:table-cell">
                    {new Date(p.updated_at).toLocaleDateString("ja-JP")}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </DragScroll>
    </div>
  )
}
