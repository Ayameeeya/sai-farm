import type { ArticleCardData } from "@/components/articles/article-card"

export type TitleTier = "sm" | "md" | "lg"

/** 横長サムネの表示比率（16:10） */
export const LANDSCAPE_IMAGE_RATIO = 10 / 16
const LANDSCAPE_IMAGE_RATIO_MOBILE = 1 / 2

export function landscapeImageHeight(columnWidth: number): number {
  const ratio = isMobileColumn(columnWidth) ? LANDSCAPE_IMAGE_RATIO_MOBILE : LANDSCAPE_IMAGE_RATIO
  return columnWidth * ratio
}

/** 16px 明朝・列幅から1行に収まる文字数 */
function charsPerLine(columnWidth: number): number {
  const innerWidth = Math.max(columnWidth - 32, 120)
  return Math.max(14, Math.floor(innerWidth / 16))
}

function isMobileColumn(columnWidth: number): boolean {
  return columnWidth < 640
}

/**
 * タイトル行数 — 実際の折り返しに近い判定
 * スマホ（1列）は最大2行で高さを抑える
 */
export function getTitleLineCount(title: string, columnWidth: number): number {
  const cpl = charsPerLine(columnWidth)
  let lines = 1
  if (title.length > cpl) lines = title.length > 30 ? 3 : 2
  if (isMobileColumn(columnWidth)) return Math.min(lines, 2)
  return lines
}

export function getTitleTier(title: string, columnWidth: number): TitleTier {
  const lines = getTitleLineCount(title, columnWidth)
  if (lines <= 1) return "sm"
  if (lines === 2) return "md"
  return "lg"
}

/** スマホ用タイトル領域の高さ（px） */
function titleBlockHeightMobile(lineCount: number): number {
  const lines = Math.min(lineCount, 2)
  switch (lines) {
    case 1:
      return 24
    case 2:
      return 48
    default:
      return 48
  }
}

/** デスクトップ用 — マソンリーのリズム用に余白を多めに確保 */
function titleBlockHeightDesktop(lineCount: number): number {
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
const TEXT_CHROME_MOBILE = 10 + 8 + 28

function textSectionHeight(lineCount: number, categoryH: number, columnWidth: number): number {
  if (isMobileColumn(columnWidth)) {
    return TEXT_CHROME_MOBILE + categoryH + titleBlockHeightMobile(lineCount)
  }

  const chrome = lineCount <= 1 ? TEXT_CHROME_COMPACT : TEXT_CHROME
  const base = chrome + categoryH + titleBlockHeightDesktop(lineCount)
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
  return landscapeImageHeight(columnWidth) + textSectionHeight(lines, categoryH, columnWidth)
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

  return `${size} ${minHMap[lines] ?? minHMap[4]} leading-[1.55] line-clamp-2 sm:line-clamp-none`
}
