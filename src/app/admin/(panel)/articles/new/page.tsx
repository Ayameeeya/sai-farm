import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ArticleForm } from "@/components/admin/article-form"

export const metadata = { title: "記事を作成" }

export default async function AdminArticleNewPage() {
  const supabase = await createClient()
  const [{ data: categories }, { data: authors }, { data: tags }] = await Promise.all([
    supabase.from("article_categories").select("id, name").order("name"),
    supabase.from("authors").select("id, name").order("name"),
    supabase.from("tags").select("id, name").order("name"),
  ])

  return (
    <div>
      <Link
        href="/admin/articles"
        className="mb-4 inline-flex items-center gap-1 text-[12px] text-black/45 transition-colors hover:text-black"
      >
        <ChevronLeft size={13} />
        記事一覧
      </Link>
      <h1 className="mb-8 font-serif text-[24px] font-light text-black">記事を作成</h1>
      <ArticleForm
        articleId={null}
        defaults={{}}
        categories={categories ?? []}
        authors={authors ?? []}
        tags={tags ?? []}
      />
    </div>
  )
}
