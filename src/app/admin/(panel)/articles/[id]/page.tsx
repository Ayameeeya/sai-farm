import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ArticleForm } from "@/components/admin/article-form"
import { richTextToMarkdown } from "@/lib/rich-text-markdown"

export const metadata = { title: "記事を編集" }

export default async function AdminArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: article }, { data: categories }, { data: authors }, { data: tags }] =
    await Promise.all([
      supabase.from("articles").select("*, article_tags(tag_id)").eq("id", id).single(),
      supabase.from("article_categories").select("id, name").order("name"),
      supabase.from("authors").select("id, name").order("name"),
      supabase.from("tags").select("id, name").order("name"),
    ])

  if (!article) notFound()

  const tagIds = (article.article_tags as { tag_id: string }[] | null)?.map(
    (at) => at.tag_id,
  ) ?? []

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1 text-[12px] text-black/45 transition-colors hover:text-black"
        >
          <ChevronLeft size={13} />
          記事一覧
        </Link>
        {article.published && (
          <Link
            href={`/articles/${article.slug}/`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-[12px] text-black/45 transition-colors hover:text-black"
          >
            公開ページを表示
            <ExternalLink size={12} />
          </Link>
        )}
      </div>
      <h1 className="mb-8 font-serif text-[24px] font-light text-black">記事を編集</h1>
      <ArticleForm
        articleId={id}
        defaults={{
          ...article,
          tag_ids: tagIds,
          body_markdown: richTextToMarkdown(article.content),
        }}
        categories={categories ?? []}
        authors={authors ?? []}
        tags={tags ?? []}
      />
    </div>
  )
}
