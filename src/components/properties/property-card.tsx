"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ArrowUpRightFromSquare } from "lucide-react"
import { useFavoritesStore } from "@/store/favorites"
import { PropertyStatusBadge } from "@/components/ui/property-status-badge"
import { formatPropertyPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import type { Property } from "@/types"

type Props = {
  property: Property
  /** 一覧での通し番号（01, 02…）。未指定なら非表示 */
  index?: number
  variant?: "default" | "featured"
}

function FavoriteButton({ id, className }: { id: string; className?: string }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
  const fav = isFavorite(id)

  return (
    <button
      type="button"
      onClick={() => (fav ? removeFavorite(id) : addFavorite(id))}
      className={cn(
        "z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/20 backdrop-blur-md transition-colors duration-300 hover:bg-black/40",
        className,
      )}
      aria-label="お気に入り"
    >
      <Heart
        size={15}
        className={fav ? "fill-red-500 stroke-red-500" : "stroke-white"}
      />
    </button>
  )
}

export function PropertyCard({ property, index, variant = "default" }: Props) {
  const images = (property.property_images ?? []).sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  const mainImage = images[0]?.image_url
  const isSold = property.status === 8
  // 商談中・ご成約は価格非表示（旧サイト仕様）
  const priceText =
    property.status < 7
      ? formatPropertyPrice(property.price)
      : property.status === 7
        ? "商談中"
        : "ご成約"
  const category = (property as Property & { property_category?: { name: string } })
    .property_category?.name
  const area = (property as Property & { area?: { name: string } }).area?.name

  const number = index != null ? String(index).padStart(2, "0") : null
  const metaLine = [area, category].filter(Boolean).join(" / ")

  if (variant === "featured") {
    return (
      <article className="group relative">
        <Link
          href={`/properties/${property.slug}/`}
          className="absolute inset-0 z-10"
          aria-label={property.property_name}
        />

        <div className="grid items-start gap-7 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-black/5">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={property.property_name}
                fill
                className="object-cover saturate-[0.9] transition-transform duration-[8000ms] ease-out group-hover:scale-[1.08]"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[13px] text-black/30">
                No Image
              </div>
            )}
            {isSold && <div className="pointer-events-none absolute inset-0 bg-black/45" />}
            <PropertyStatusBadge
              status={property.status}
              className="absolute top-4 left-4"
            />
            <FavoriteButton id={property.id} className="absolute top-4 right-4" />
            {number && (
              <span
                className="absolute bottom-4 left-4 text-[15px] font-semibold tabular-nums tracking-[0.1em] text-white mix-blend-difference"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                {number}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            {metaLine && (
              <p
                className="mb-3 text-[11px] tracking-[0.28em] text-black/45 uppercase"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                {metaLine}
              </p>
            )}
            <h3 className="font-serif text-[clamp(24px,2.8vw,36px)] font-light leading-[1.3] text-black">
              {property.property_name}
            </h3>
            {property.address && (
              <p className="mt-3 text-[13px] text-black/50">{property.address}</p>
            )}

            <dl className="mt-7 border-t border-black/10">
              <div className="flex items-baseline justify-between border-b border-black/10 py-3.5">
                <dt className="text-[11px] tracking-[0.3em] text-black/40 uppercase">
                  Price
                </dt>
                <dd className="font-serif text-[20px] text-black/90 lg:text-[24px]">
                  {priceText}
                </dd>
              </div>
              {property.land_space_sqm != null && (
                <div className="flex items-baseline justify-between border-b border-black/10 py-3.5">
                  <dt className="text-[11px] tracking-[0.3em] text-black/40 uppercase">
                    Land
                  </dt>
                  <dd className="text-[13px] tabular-nums text-black/65">
                    {property.land_space_sqm} ㎡
                  </dd>
                </div>
              )}
              {property.layout && (
                <div className="flex items-baseline justify-between border-b border-black/10 py-3.5">
                  <dt className="text-[11px] tracking-[0.3em] text-black/40 uppercase">
                    Layout
                  </dt>
                  <dd className="text-[13px] text-black/65">{property.layout}</dd>
                </div>
              )}
            </dl>

            <span className="group/link mt-7 inline-flex items-center gap-3 text-[12px] tracking-[0.15em] text-black/55 uppercase transition-colors duration-300 group-hover:text-black">
              物件を見る
              <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-16" />
            </span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group relative">
      <Link
        href={`/properties/${property.slug}/`}
        className="absolute inset-0 z-10"
        aria-label={property.property_name}
      />

      <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-black/5">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={property.property_name}
            fill
            className="object-cover saturate-[0.9] transition-transform duration-[8000ms] ease-out group-hover:scale-[1.08]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[13px] text-black/30">
            No Image
          </div>
        )}
        {isSold && <div className="pointer-events-none absolute inset-0 bg-black/45" />}
        <PropertyStatusBadge
          status={property.status}
          className="absolute top-3 left-3"
        />
        <FavoriteButton id={property.id} className="absolute top-3 right-3" />
      </div>

      <div className="pt-5">
        <p
          className="mb-2 flex items-baseline gap-3 text-[11px] tracking-[0.24em] text-black/40 uppercase"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          {number && <span className="tabular-nums">{number}</span>}
          {metaLine && <span>{metaLine}</span>}
        </p>

        <h3 className="font-serif text-[19px] font-light leading-snug text-black lg:text-[21px]">
          {property.property_name}
        </h3>
        {property.address && (
          <p className="mt-1.5 truncate text-[13px] text-black/50">
            {property.address}
          </p>
        )}

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-black/10 pt-4">
          <p className="font-serif text-[19px] leading-none text-black/90 lg:text-[21px]">
            {priceText}
          </p>
          <div className="flex items-center gap-4 text-[12px] tabular-nums text-black/50">
            {property.land_space_sqm != null && <span>{property.land_space_sqm} ㎡</span>}
            {property.layout && <span>{property.layout}</span>}
            <ArrowUpRightFromSquare
              size={14}
              strokeWidth={1.5}
              className="text-black/35 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black"
            />
          </div>
        </div>
      </div>
    </article>
  )
}
