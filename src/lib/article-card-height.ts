import type { ArticleCardData } from "@/components/articles/article-card"

export type TitleTier = "sm" | "md" | "lg"

/** 横長サムネの表示比率（16:10） */
export const LANDSCAPE_IMAGE_RATIO = 10 / 16

export function landscapeImageHeight(columnWidth: number): number {
  return columnWidth * LANDSCAPE_IMAGE_RATIO
}

/** 16px 明朝・列幅から1行に収まる文字数 */
function charsPerLine(columnWidth: number): number {
  const innerWidth = Math.max(columnWidth - 32, 120)
  return Math.max(14, Math.floor(innerWidth / 16))
}

/**
 * タイトル行数 — 実際の折り返しに近い判定
 * ・cpl 以内 → 1行
 * ・31文字以上 → 3行以上
 * ・それ以外 → 2行
 */
export function getTitleLineCount(title: string, columnWidth: number): number {
  const cpl = charsPerLine(columnWidth)
  if (title.length <= cpl) return 1
  if (title.length > 30) return 3
  return 2
}

export function getTitleTier(title: string, columnWidth: number): TitleTier {
  const lines = getTitleLineCount(title, columnWidth)
  if (lines <= 1) return "sm"
  if (lines === 2) return "md"
  return "lg"
}

/** タイトル行数に応じたテキスト領域の高さ（px） */
function titleBlockHeight(lineCount: number): number {
  switch (Math.min(lineCount, 4)) {
    case 1:
      return 18
    case 2:
      return 64
    case 3:
      return 224
    default:
      return 264
  }
}

const TEXT_CHROME = 16 + 12 + 36 // pt-4 + pb-3 + meta row
const TEXT_CHROME_COMPACT = 12 + 8 + 32 // 1行用

function textSectionHeight(lineCount: number, categoryH: number): number {
  const chrome = lineCount <= 1 ? TEXT_CHROME_COMPACT : TEXT_CHROME
  const base = chrome + categoryH + titleBlockHeight(lineCount)
  if (lineCount >= 3) return base + 60
  return base
}

/** 横長画像（固定比率）+ テキスト可変 = カード全体 */
export function estimateArticleCardHeight(
  article: ArticleCardData,
  columnWidth: number,
): number {
  const lines = getTitleLineCount(article.title, columnWidth)
  const categoryH = article.category?.name ? 22 : 0
  return landscapeImageHeight(columnWidth) + textSectionHeight(lines, categoryH)
}

export function getTitleClassName(tier: TitleTier, lineCount: number): string {
  const size =
    tier === "sm"
      ? "text-[15px] lg:text-[16px]"
      : tier === "md"
        ? "text-[16px] lg:text-[17px]"
        : "text-[18px] lg:text-[19px]"

  const lines = tier === "sm" ? 1 : tier === "md" ? 2 : Math.min(lineCount, 4)

  const minHMap: Record<number, string> = {
    1: "min-h-[1.55em]",
    2: "min-h-[3.1em]",
    3: "min-h-[4.65em]",
    4: "min-h-[6.2em]",
  }

  return `${size} ${minHMap[lines] ?? minHMap[4]} leading-[1.55]`
}
