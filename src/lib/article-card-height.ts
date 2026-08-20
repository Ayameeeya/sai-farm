import type { ArticleCardData } from "@/components/articles/article-card"

export type TitleTier = "sm" | "md" | "lg"

/** 横長サムネの表示比率（16:10） */
export const LANDSCAPE_IMAGE_RATIO = 10 / 16
const LANDSCAPE_IMAGE_RATIO_MOBILE = 1 / 2

export function landscapeImageHeight(
  columnWidth: number,
  isSingleColumn: boolean,
): number {
  const ratio = isSingleColumn
    ? LANDSCAPE_IMAGE_RATIO_MOBILE
    : LANDSCAPE_IMAGE_RATIO
  return columnWidth * ratio
}

/** 明朝体の表示幅を考慮した、1行に収まる概算文字数 */
function charsPerLine(columnWidth: number): number {
  const innerWidth = Math.max(columnWidth - 32, 120)
  return Math.max(12, Math.floor(innerWidth / 18))
}

/** タイトル行数 — カード内で全文を表示できるよう余裕を持って算出 */
export function getTitleLineCount(title: string, columnWidth: number): number {
  const cpl = charsPerLine(columnWidth)
  return Math.max(1, Math.ceil(Array.from(title).length / cpl))
}

export function getTitleTier(title: string, columnWidth: number): TitleTier {
  const lines = getTitleLineCount(title, columnWidth)
  if (lines <= 1) return "sm"
  if (lines === 2) return "md"
  return "lg"
}

/** スマホ用タイトル領域の高さ（px） */
function titleBlockHeightMobile(lineCount: number): number {
  if (lineCount === 1) return 24
  if (lineCount === 2) return 52
  return lineCount * 29
}

const TEXT_CHROME_MOBILE = 10 + 16 + 28

function textSectionHeight(
  lineCount: number,
  categoryH: number,
  isSingleColumn: boolean,
): number {
  const desktopLineHeightAdjustment = isSingleColumn ? 0 : 18
  return (
    TEXT_CHROME_MOBILE +
    categoryH +
    titleBlockHeightMobile(lineCount) +
    desktopLineHeightAdjustment
  )
}

/** 横長画像（固定比率）+ テキスト可変 = カード全体 */
export function estimateArticleCardHeight(
  article: ArticleCardData,
  columnWidth: number,
  columnCount: number,
): number {
  const lines = getTitleLineCount(article.title, columnWidth)
  const categoryH = article.category?.name ? 22 : 0
  const isSingleColumn = columnCount === 1

  return (
    landscapeImageHeight(columnWidth, isSingleColumn) +
    textSectionHeight(lines, categoryH, isSingleColumn)
  )
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
    3: "min-h-[4.65em] max-sm:min-h-[3.1em]",
    4: "min-h-[6.2em] max-sm:min-h-[3.1em]",
  }

  return `${size} ${minHMap[lines] ?? minHMap[4]} leading-[1.55]`
}
