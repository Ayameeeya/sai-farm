import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/layout/page-header"
import { SubPageShell } from "@/components/layout/sub-page-shell"
import { RichTextContent } from "@/components/ui/rich-text-content"
import type { Article } from "@/types"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("articles")
    .select("title, meta_description, featured_photo_url")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle()

  if (!data) return { title: "ブログ" }
  return {
    title: data.title,
    description: data.meta_description ?? undefined,
    openGraph: {
      type: "article",
      title: data.title,
      description: data.meta_description ?? undefined,
      images: data.featured_photo_url ? [data.featured_photo_url] : undefined,
    },
    twitter: data.featured_photo_url
      ? { images: [data.featured_photo_url] }
      : undefined,
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from("articles")
    .select(
      "*, author:authors(name, avatar_url, description), category:article_categories(name), article_tags(tag:tags(name))",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle()

  if (!article) notFound()

  const typed = article as Article & {
    author?: { name: string; avatar_url: string | null; description: string | null }
    category?: { name: string }
    article_tags?: { tag?: { name: string } | null }[]
  }

  const tags = (typed.article_tags ?? [])
    .map((at) => at.tag?.name)
    .filter((name): name is string => Boolean(name))

  return (
    <SubPageShell>
      <PageHeader label="BLOG" title={typed.title} />

      <article className="mx-auto max-w-[800px] px-6 py-12 lg:py-16">
        <Link
          href="/articles/"
          className="group mb-8 inline-flex items-center gap-3 text-[12px] tracking-[0.15em] text-black/45 transition-colors duration-300 hover:text-black"
        >
          <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
          ブログ一覧
        </Link>

        <div className="mb-8 flex flex-wrap items-center gap-3 text-[12px] text-black/45">
          <time className="tabular-nums">
            {format(new Date(typed.created_at), "yyyy.MM.dd", { locale: ja })}
          </time>
          {typed.category?.name && (
            <>
              <span className="text-black/20">|</span>
              <span>{typed.category.name}</span>
            </>
          )}
          {typed.author?.name && (
            <>
              <span className="text-black/20">|</span>
              <span>{typed.author.name}</span>
            </>
          )}
        </div>

        {typed.featured_photo_url && (
          <div className="relative mb-10 aspect-[16/10] overflow-hidden rounded-[6px]">
            <Image
              src={typed.featured_photo_url}
              alt={typed.title}
              fill
              className="object-cover"
              sizes="(max-width: 800px) 100vw, 800px"
              priority
            />
          </div>
        )}

        <RichTextContent content={typed.content} />

        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-x-4 gap-y-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[12px] tracking-[0.08em] text-black/50"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {typed.author && (
          <aside className="mt-12 rounded-[6px] border border-black/8 bg-black/[0.02] p-6">
            <p
              className="mb-4 text-[11px] tracking-[0.25em] text-black/40 uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Author
            </p>
            <div className="flex items-start gap-4">
              {typed.author.avatar_url && (
                <Image
                  src={typed.author.avatar_url}
                  alt={typed.author.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium text-black/85">{typed.author.name}</p>
                {typed.author.description && (
                  <p className="mt-2 text-[13px] leading-[1.9] text-black/60">
                    {typed.author.description}
                  </p>
                )}
              </div>
            </div>
          </aside>
        )}

        <div className="mt-12 border-t border-black/8 pt-10">
          <Link
            href="/articles/"
            className="group inline-flex items-center gap-3 text-[12px] tracking-[0.15em] text-black/45 transition-colors duration-300 hover:text-black"
          >
            <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
            ブログ一覧に戻る
          </Link>
        </div>
      </article>
    </SubPageShell>
  )
}
