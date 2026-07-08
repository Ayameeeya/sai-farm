import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { DragScroll } from "@/components/admin/drag-scroll"

export const metadata = { title: "サービス管理" }

export default async function AdminServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from("services")
    .select("id, name, slug, published, featured_photo_url, updated_at")
    .order("created_at")

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-[24px] font-light text-black">サービス管理</h1>
        <Link
          href="/admin/services/new"
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[6px] bg-black px-5 py-2.5 text-[13px] text-white transition-colors hover:bg-black/85"
        >
          <Plus size={14} strokeWidth={1.5} />
          サービスを追加
        </Link>
      </div>

      <DragScroll className="rounded-[12px] bg-white ring-1 ring-black/5">
        <table className="w-full whitespace-nowrap text-left text-[13px]">
          <thead>
            <tr className="border-b border-black/8 text-[11px] tracking-[0.1em] text-black/45">
              <th className="px-5 py-3.5 font-medium">サービス</th>
              <th className="px-4 py-3.5 font-medium">状態</th>
              <th className="hidden px-4 py-3.5 font-medium sm:table-cell">更新日</th>
            </tr>
          </thead>
          <tbody>
            {(services ?? []).map((s) => (
              <tr key={s.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                <td className="px-5 py-3">
                  <Link href={`/admin/services/${s.id}`} className="flex items-center gap-3">
                    <span className="relative block h-10 w-14 shrink-0 overflow-hidden rounded-[4px] bg-black/5">
                      {s.featured_photo_url && (
                        <Image
                          src={s.featured_photo_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block max-w-[200px] truncate font-medium text-black/85 sm:max-w-[420px]">{s.name}</span>
                      <span className="hidden max-w-[420px] truncate text-[11px] text-black/40 sm:block">/services/{s.slug}/</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      s.published
                        ? "inline-flex rounded-full bg-black px-3 py-1 text-[11px] text-white"
                        : "inline-flex rounded-full bg-black/8 px-3 py-1 text-[11px] text-black/50"
                    }
                  >
                    {s.published ? "公開中" : "非公開"}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-[12px] tabular-nums text-black/45 sm:table-cell">
                  {s.updated_at ? new Date(s.updated_at).toLocaleDateString("ja-JP") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(services ?? []).length === 0 && (
          <p className="px-5 py-10 text-center text-[13px] text-black/40">
            サービスはまだありません
          </p>
        )}
      </DragScroll>
    </div>
  )
}
