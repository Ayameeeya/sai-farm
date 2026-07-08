import { createClient } from "@/lib/supabase/server"
import { TaxonomyManager, type TaxonomyItem } from "@/components/admin/taxonomy-manager"
import { AuthorsManager, type AuthorRow } from "@/components/admin/authors-manager"

export const metadata = { title: "タグ・カテゴリ" }

export default async function AdminTaxonomyPage() {
  const supabase = await createClient()

  const [
    { data: tags },
    { data: categories },
    { data: articleTags },
    { data: propertyTags },
    { data: articles },
    { data: authors },
  ] = await Promise.all([
    supabase.from("tags").select("id, name").order("name"),
    supabase.from("article_categories").select("id, name").order("name"),
    supabase.from("article_tags").select("tag_id"),
    supabase.from("property_tags").select("tag_id"),
    supabase.from("articles").select("category_id, author_id"),
    supabase.from("authors").select("id, name, description, avatar_url").order("name"),
  ])

  const countBy = (rows: { [key: string]: string | null }[] | null, key: string) => {
    const map = new Map<string, number>()
    for (const row of rows ?? []) {
      const id = row[key]
      if (id) map.set(id, (map.get(id) ?? 0) + 1)
    }
    return map
  }

  const articleTagCount = countBy(articleTags, "tag_id")
  const propertyTagCount = countBy(propertyTags, "tag_id")
  const categoryCount = countBy(articles, "category_id")
  const authorCount = countBy(articles, "author_id")

  const tagItems: TaxonomyItem[] = (tags ?? []).map((t) => {
    const usage = [
      articleTagCount.get(t.id) ? `記事${articleTagCount.get(t.id)}` : null,
      propertyTagCount.get(t.id) ? `物件${propertyTagCount.get(t.id)}` : null,
    ]
      .filter(Boolean)
      .join(" / ")
    return { id: t.id, name: t.name, usage: usage || null }
  })

  const categoryItems: TaxonomyItem[] = (categories ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    usage: categoryCount.get(c.id) ? `記事${categoryCount.get(c.id)}` : null,
  }))

  const authorRows: AuthorRow[] = (authors ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    avatar_url: a.avatar_url,
    articleCount: authorCount.get(a.id) ?? 0,
  }))

  return (
    <div>
      <h1 className="mb-2 font-serif text-[24px] font-light text-black">タグ・カテゴリ</h1>
      <p className="mb-8 text-[12px] text-black/45">
        記事・物件で使うタグ、ブログ記事のカテゴリ・著者を管理します。
      </p>
      <div className="grid max-w-[1200px] items-start gap-6 lg:grid-cols-3">
        <TaxonomyManager tags={tagItems} categories={categoryItems} />
        <AuthorsManager authors={authorRows} />
      </div>
    </div>
  )
}
