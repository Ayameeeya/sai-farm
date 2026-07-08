import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { ArrowUpRightFromSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTitleClassName, type TitleTier } from "@/lib/article-card-height"

export type ArticleCardData = {
  id: string
  slug: string
  title: string
  featured_photo_url: string | null
  created_at: string
  category?: { name: string } | null
}

type Variant = "featured" | "compact" | "tall" | "wide" | "default" | "masonry"

const CARD_BG = "bg-[#ebe8e1]"

export function ArticleCard({
  article,
  variant = "default",
  titleTier = "md",
  titleLineCount = 2,
  className,
}: {
  article: ArticleCardData
  variant?: Variant
  titleTier?: TitleTier
  titleLineCount?: number
  className?: string
}) {
  if (variant === "masonry") {
    return (
      <Link
        href={`/articles/${article.slug}/`}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-[6px] transition-transform duration-500 hover:-translate-y-0.5",
          CARD_BG,
          className,
        )}
      >
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-b-[6px] bg-black/[0.04]">
          {article.featured_photo_url ? (
            <Image
              src={article.featured_photo_url}
              alt={article.title}
              fill
              className="object-cover object-center transition-transform duration-[7000ms] ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-black/[0.06]" />
          )}
        </div>

        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col px-4",
            titleTier === "sm" ? "pb-2 pt-3" : "pb-3 pt-4",
          )}
        >
          {article.category?.name && (
            <p className="mb-2 text-[11px] tracking-[0.12em] text-black/40 uppercase">
              {article.category.name}
            </p>
          )}

          <h2
            className={cn(
              "mb-auto font-serif font-light text-black transition-colors group-hover:text-black/75",
              getTitleClassName(titleTier, titleLineCount),
            )}
          >
            {article.title}
          </h2>

          <div className="mt-3 flex items-end justify-between gap-3">
            <time className="text-[13px] tabular-nums text-black/45">
              {format(new Date(article.created_at), "yyyy年M月d日", { locale: ja })}
            </time>
            <ArrowUpRightFromSquare
              size={15}
              strokeWidth={1.5}
              className="shrink-0 text-black/35 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black"
            />
          </div>
        </div>
      </Link>
    )
  }

  const imageClass = cn(
    "relative",
    variant === "featured"
      ? "aspect-[11/10] lg:aspect-[536/490]"
      : variant === "compact"
        ? "aspect-[4/5]"
        : variant === "tall"
          ? "aspect-[3/4]"
          : variant === "wide"
            ? "aspect-[16/10] lg:aspect-[2/1]"
            : "aspect-[4/3]",
  )

  return (
    <Link
      href={`/articles/${article.slug}/`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[6px] p-3 transition-transform duration-500 hover:-translate-y-0.5",
        CARD_BG,
        className,
      )}
    >
      <div className={cn("mb-4 overflow-hidden rounded-[6px] bg-black/5", imageClass)}>
        {article.featured_photo_url ? (
          <Image
            src={article.featured_photo_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-[7000ms] ease-out group-hover:scale-[1.05]"
            sizes={
              variant === "featured"
                ? "(max-width: 1024px) 100vw, 50vw"
                : variant === "wide"
                  ? "(max-width: 1024px) 100vw, 66vw"
                  : variant === "tall"
                    ? "(max-width: 1024px) 100vw, 33vw"
                    : variant === "compact"
                      ? "(max-width: 1024px) 50vw, 25vw"
                      : "(max-width: 640px) 100vw, 33vw"
            }
          />
        ) : (
          <div className="absolute inset-0 bg-black/[0.06]" />
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-2">
        {article.category?.name && (
          <p className="mb-2 text-[11px] tracking-[0.12em] text-black/40 uppercase">
            {article.category.name}
          </p>
        )}

        <h2
          className={cn(
            "mb-auto font-serif font-light leading-snug text-black transition-colors group-hover:text-black/75",
            variant === "featured" || variant === "wide"
              ? "text-[20px] lg:text-[24px]"
              : "text-[16px] lg:text-[18px]",
          )}
        >
          {article.title}
        </h2>

        <div className="mt-4 flex items-end justify-between gap-3">
          <time className="text-[13px] tabular-nums text-black/45">
            {format(new Date(article.created_at), "yyyy年M月d日", { locale: ja })}
          </time>
          <ArrowUpRightFromSquare
            size={15}
            strokeWidth={1.5}
            className="shrink-0 text-black/35 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black"
          />
        </div>
      </div>
    </Link>
  )
}
