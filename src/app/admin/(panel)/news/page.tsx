import { createClient } from "@/lib/supabase/server"
import { NewsManager } from "@/components/admin/news-manager"

export const metadata = { title: "お知らせ管理" }

export default async function AdminNewsPage() {
  const supabase = await createClient()
  const [{ data: news }, { data: tags }] = await Promise.all([
    supabase
      .from("news")
      .select("id, title, tag_id, created_at, tag:news_tags(name)")
      .order("created_at", { ascending: false }),
    supabase.from("news_tags").select("id, name").order("name"),
  ])

  return (
    <div>
      <h1 className="mb-8 font-serif text-[24px] font-light text-black">お知らせ管理</h1>
      <NewsManager
        news={(news ?? []).map((n) => ({
          id: n.id,
          title: n.title,
          tag_id: n.tag_id,
          created_at: n.created_at,
          tag_name: (n.tag as unknown as { name: string } | null)?.name ?? null,
        }))}
        tags={tags ?? []}
      />
    </div>
  )
}
