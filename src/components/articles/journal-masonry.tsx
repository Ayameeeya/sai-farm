"use client"

import { useMemo } from "react"
import { ArticleCard, type ArticleCardData } from "@/components/articles/article-card"
import { Masonry } from "@/components/ui/masonry"
import { estimateArticleCardHeight, getTitleClassName, getTitleLineCount, getTitleTier } from "@/lib/article-card-height"

type Props = {
  articles: ArticleCardData[]
  featuredLayout?: boolean
}

type MasonryArticle = ArticleCardData & {
  height: (columnWidth: number) => number
}

export function JournalMasonry({ articles }: Props) {
  const items = useMemo<MasonryArticle[]>(
    () =>
      articles.map((article) => ({
        ...article,
        height: (columnWidth: number) => estimateArticleCardHeight(article, columnWidth),
      })),
    [articles],
  )

  if (!articles.length) {
    return (
      <p className="py-20 text-center text-[14px] text-black/45">
        該当する記事がありません。
      </p>
    )
  }

  return (
    <Masonry
      items={items}
      gap={24}
      stagger={0.05}
      animateFrom="bottom"
      blurToFocus
      renderItem={(article, gridItem) => {
        const lineCount = getTitleLineCount(article.title, gridItem.w)
        return (
          <ArticleCard
            article={article}
            variant="masonry"
            titleTier={getTitleTier(article.title, gridItem.w)}
            titleLineCount={lineCount}
            className="h-full"
          />
        )
      }}
    />
  )
}
