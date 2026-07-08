import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import { SCROLL_PAGE_PT } from "@/components/top/top-page-nav"
import { JournalHero } from "@/components/articles/journal-hero"
import { JournalFilter } from "@/components/articles/journal-filter"
import { JournalGrid } from "@/components/articles/journal-grid"
import { JournalCta } from "@/components/articles/journal-cta"
import type { ArticleCardData } from "@/components/articles/article-card"
import { Pagination } from "@/components/ui/pagination"

export const metadata: Metadata = {
  title: "ブログ",
  description: "南伊豆の暮らし、移住、不動産に関する記事・お知らせ。",
}

type SearchParams = Promise<{ category?: string; page?: string }>

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { category, page } = await searchParams
  const currentPage = Number(page ?? 1)
  const PAGE_SIZE = 8

  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("article_categories")
    .select("id, name")
    .order("name")

  let query = supabase
    .from("articles")
    .select("id, slug, title, featured_photo_url, created_at, category:article_categories(name)", {
      count: "exact",
    })
    .eq("published", true)

  if (category) {
    const cat = categories?.find((c) => c.name === category)
    if (cat) query = query.eq("category_id", cat.id)
  }

  const { data: articles, count } = await query
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const tabs = [
    { href: "/articles/", label: "すべて", active: !category },
    ...(categories?.map((cat) => ({
      href: `/articles/?category=${encodeURIComponent(cat.name)}`,
      label: cat.name,
      active: category === cat.name,
    })) ?? []),
  ]

  const cardData: ArticleCardData[] =
    articles?.map((a) => {
      const raw = a as {
        id: string
        slug: string
        title: string
        featured_photo_url: string | null
        created_at: string
        category?: { name: string } | { name: string }[] | null
      }
      const cat = raw.category
      const category =
        cat == null ? null : Array.isArray(cat) ? (cat[0] ?? null) : cat
      return {
        id: raw.id,
        slug: raw.slug,
        title: raw.title,
        featured_photo_url: raw.featured_photo_url,
        created_at: raw.created_at,
        category,
      }
    }) ?? []

  const featuredLayout = currentPage === 1 && !category

  return (
    <div
      className="min-h-screen bg-[#f2efea]"
      style={{ paddingTop: SCROLL_PAGE_PT }}
    >
      <JournalHero activeCategory={category} />

      <div className="mx-auto max-w-[1200px] px-6 pb-24 lg:px-10">
        <JournalFilter tabs={tabs} />

        <div className="mt-14 lg:mt-20">
          <p
            className="mb-8 text-[13px] tracking-[0.08em] text-black/40"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Latest Articles ↓
          </p>
          <JournalGrid articles={cardData} featuredLayout={featuredLayout} />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={(p) =>
            `?page=${p}${category ? `&category=${encodeURIComponent(category)}` : ""}`
          }
        />

        {!category && currentPage === 1 && <JournalCta />}
      </div>
    </div>
  )
}
