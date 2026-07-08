"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, MapPin, Phone, ChevronLeft, ChevronRight, BedDouble, Bath, Maximize2, Home, X } from "lucide-react"
import { LetterSwapButton } from "@/components/ui/letter-swap-button"
import { PropertyStatusBadge } from "@/components/ui/property-status-badge"
import { SCROLL_PAGE_PT, STICKY_TOP } from "@/components/top/top-page-nav"
import { useFavoritesStore } from "@/store/favorites"
import { PropertyCard } from "@/components/properties/property-card"
import { formatPropertyPrice } from "@/lib/format-price"
import { type Property } from "@/types"
import { cn } from "@/lib/utils"
import type { PropertyFacility } from "@/components/properties/property-facilities"

const PropertyFacilities = dynamic(
  () =>
    import("@/components/properties/property-facilities").then(
      (m) => m.PropertyFacilities,
    ),
  { ssr: false },
)

/** ㎡ → 坪（小数第2位） */
function sqmToTsubo(sqm: number): number {
  return Math.round((sqm / 3.306) * 100) / 100
}

/** 表示行。値は properties の直下カラム → details jsonb の順で解決する */
const DETAIL_ROWS = [
  { key: "property_code", label: "物件番号" },
  { key: "address", label: "所在地" },
  { key: "nearest_station", label: "最寄り駅" },
  { key: "transportation", label: "交通" },
  { key: "layout", label: "間取り" },
  { key: "layout_detail", label: "間取り詳細" },
  { key: "land_space_sqm", label: "土地面積", unit: "㎡" },
  { key: "building_space_sqm", label: "建物面積", unit: "㎡" },
  { key: "structure", label: "構造" },
  { key: "completion", label: "築年月" },
  { key: "land_ownership", label: "土地権利" },
  { key: "land_category", label: "地目" },
  { key: "city_planning_area", label: "都市計画区域" },
  { key: "use_zoning", label: "用途地域" },
  { key: "building_coverage_ratio", label: "建蔽率", unit: "%" },
  { key: "floor_area_ratio", label: "容積率", unit: "%" },
  { key: "terrain", label: "地勢" },
  { key: "adjacent_road", label: "接道状況" },
  { key: "parking", label: "駐車場" },
  { key: "utilities", label: "設備" },
  { key: "occupancy", label: "現況" },
  { key: "handover", label: "引渡し" },
  { key: "conditions_transactions", label: "取引条件" },
  { key: "other_legal_restriction", label: "その他法令" },
  { key: "pic", label: "担当者" },
]

const SLIDER_BTN =
  "absolute top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 lg:flex h-10 w-10"

type Props = {
  property: Property
  related: Property[]
  companyName?: string | null
  tel?: string
}

export function PropertyDetail({ property, related, companyName, tel = "0558-64-8880" }: Props) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
  const fav = isFavorite(property.id)

  const images = (property.property_images ?? []).sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  const [currentImg, setCurrentImg] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchMoved = useRef(false)

  const prev = () => setCurrentImg((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setCurrentImg((i) => (i === images.length - 1 ? 0 : i + 1))

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchMoved.current = false
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && Math.abs(e.touches[0].clientX - touchStartX.current) > 8) {
      touchMoved.current = true
    }
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev()
    touchStartX.current = null
  }
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (touchMoved.current) { touchMoved.current = false; return }
    if (images.length <= 1) { setModalOpen(true); return }
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    if (ratio < 0.25) prev()
    else if (ratio > 0.75) next()
    else setModalOpen(true)
  }

  const tags = (property as Property & { property_tags?: { tag?: { name: string } }[] }).property_tags?.map((pt) => pt.tag?.name).filter(Boolean) ?? []
  const category = (property as Property & { property_category?: { name: string; slug: string } }).property_category
  const area = (property as Property & { area?: { name: string } }).area

  const facilities = (
    (property as Property & { property_facilities?: { facility?: PropertyFacility }[] })
      .property_facilities ?? []
  )
    .map((pf) => pf.facility)
    .filter((f): f is PropertyFacility => Boolean(f && f.lat != null && f.lng != null))

  const metaLine = [area?.name, category?.name].filter(Boolean).join(" / ")
  // 商談中・ご成約は価格非表示（旧サイト仕様）
  const priceText =
    property.status < 7
      ? formatPropertyPrice(property.price)
      : property.status === 7
        ? "商談中"
        : "ご成約"

  const specs = [
    property.land_space_sqm != null && {
      icon: Maximize2,
      label: "土地面積",
      value: `${property.land_space_sqm} ㎡`,
    },
    property.building_space_sqm != null && {
      icon: Home,
      label: "建物面積",
      value: `${property.building_space_sqm} ㎡`,
    },
    property.bedroom != null && {
      icon: BedDouble,
      label: "ベッドルーム",
      value: `${property.bedroom}`,
    },
    property.bathroom != null && {
      icon: Bath,
      label: "バスルーム",
      value: `${property.bathroom}`,
    },
  ].filter(Boolean) as { icon: typeof Maximize2; label: string; value: string }[]

  return (
    <article className="min-h-screen bg-white" style={{ paddingTop: SCROLL_PAGE_PT }}>
      {/* パンくず */}
      <div className="mx-auto max-w-screen-xl px-6 pt-2 lg:px-12">
        <nav className="flex items-center gap-2 text-[12px] text-black/40">
          <Link href="/" className="transition-colors hover:text-black">トップ</Link>
          <span>/</span>
          <Link
            href={`/properties/property-categories/${category?.slug ?? "all"}/`}
            className="transition-colors hover:text-black"
          >
            {category?.name ?? "物件一覧"}
          </Link>
          <span>/</span>
          <span className="text-black/65">{property.property_name}</span>
        </nav>
      </div>

      {/* エディトリアルヘッダー */}
      <header className="mx-auto max-w-screen-xl px-6 pt-8 pb-10 lg:px-12 lg:pt-12 lg:pb-14">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {metaLine && (
            <p
              className="text-[11px] tracking-[0.28em] text-black/45 uppercase"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              {metaLine}
            </p>
          )}
          <PropertyStatusBadge status={property.status} />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <h1 className="font-serif text-[clamp(30px,4.5vw,56px)] font-light leading-[1.15] text-black">
              {property.property_name}
            </h1>
            {property.address && (
              <p className="mt-4 flex items-center gap-1.5 text-[13px] text-black/50">
                <MapPin size={13} className="shrink-0" />
                {property.address}
              </p>
            )}
          </div>

          <p className="pb-1 text-right" style={{ fontFamily: "var(--font-barlow)" }}>
            <span className="block font-serif text-[clamp(26px,3vw,40px)] font-light leading-none text-black/90">
              {priceText}
            </span>
            <span className="mt-2 block text-[11px] tracking-[0.3em] text-black/40 uppercase">
              Price
            </span>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-screen-xl px-6 pb-20 lg:px-12 lg:pb-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-14">
          <div className="space-y-12 lg:col-span-2">
            {/* ギャラリー */}
            <div>
              <div
                className="group relative aspect-[16/10] overflow-hidden rounded-[6px] bg-black/5 cursor-pointer"
                onClick={images.length > 0 ? handleImageClick : undefined}
                onTouchStart={images.length > 1 ? handleTouchStart : undefined}
                onTouchMove={images.length > 1 ? handleTouchMove : undefined}
                onTouchEnd={images.length > 1 ? handleTouchEnd : undefined}
              >
                {images.length > 0 ? (
                  <>
                    <Image
                      src={images[currentImg].image_url}
                      alt={property.property_name}
                      fill
                      className="object-cover saturate-[0.9]"
                      priority
                      sizes="(max-width: 1024px) 100vw, 67vw"
                    />
                    {images.length > 1 && (
                      <>
                        <button type="button" onClick={prev} className={cn(SLIDER_BTN, "left-4")} aria-label="前の画像">
                          <ChevronLeft size={18} />
                        </button>
                        <button type="button" onClick={next} className={cn(SLIDER_BTN, "right-4")} aria-label="次の画像">
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-black/30">No Image</div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8">
                  {images.slice(0, 16).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentImg(i)}
                      className={cn(
                        "relative aspect-square overflow-hidden rounded-[4px] transition-opacity duration-300",
                        i === currentImg
                          ? "opacity-100 ring-1 ring-black"
                          : "opacity-55 hover:opacity-100",
                      )}
                    >
                      <Image src={img.image_url} alt="" fill className="object-cover" sizes="10vw" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* タグ */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2">
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

            {/* 紹介文 */}
            {property.comment && (
              <section>
                <p
                  className="mb-5 text-black/45"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    letterSpacing: "0.35em",
                  }}
                >
                  COMMENT
                </p>
                <p className="max-w-[640px] font-serif text-[15px] font-light leading-[2.4] text-black/75 lg:text-[16px]">
                  {property.comment}
                </p>
              </section>
            )}

            {/* ワンポイント */}
            {property.one_point && (
              <section className="rounded-[6px] bg-black px-7 py-8 text-white lg:px-9 lg:py-10">
                <p
                  className="mb-4 text-white/55"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "12px",
                    letterSpacing: "0.35em",
                  }}
                >
                  ONE POINT
                </p>
                <p className="whitespace-pre-wrap text-[14px] leading-[2] text-white/90">
                  {property.one_point}
                </p>
              </section>
            )}

            {/* 物件情報 — 図面風罫線リスト */}
            <section>
              <p
                className="mb-4 text-black/45"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "13px",
                  letterSpacing: "0.35em",
                }}
              >
                DETAILS
              </p>
              <h2 className="mb-8 font-serif text-[clamp(24px,3vw,34px)] font-light text-black">
                物件情報
              </h2>
              <dl className="grid grid-cols-1 gap-x-14 border-t border-black/10 sm:grid-cols-2">
                {DETAIL_ROWS.map((row) => {
                  const val =
                    (property as unknown as Record<string, unknown>)[row.key] ??
                    (property.details as Record<string, unknown> | null)?.[row.key]
                  if (!val) return null

                  const isSqm =
                    row.key === "land_space_sqm" || row.key === "building_space_sqm"

                  return (
                    <div
                      key={row.key}
                      className="flex items-baseline justify-between gap-6 border-b border-black/10 py-3.5"
                    >
                      <dt className="shrink-0 text-[12px] tracking-[0.12em] text-black/45">
                        {row.label}
                      </dt>
                      <dd className="text-right text-[13px] leading-relaxed text-black/75">
                        {String(val)}
                        {row.unit ?? ""}
                        {isSqm && (
                          <span className="ml-1.5 text-[12px] text-black/45">
                            / {sqmToTsubo(Number(val))}坪
                          </span>
                        )}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </section>

          </div>

          {/* サイドバー */}
          <div>
            <div
              className="sticky rounded-[6px] border border-black/10 p-7 lg:p-8"
              style={{ top: STICKY_TOP + 16 }}
            >
              {metaLine && (
                <p
                  className="mb-6 text-[11px] tracking-[0.28em] text-black/45 uppercase"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  {metaLine}
                </p>
              )}

              <p className="font-serif text-[30px] font-light leading-none text-black/90">
                {priceText}
              </p>

              {specs.length > 0 && (
                <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-black/10 pt-6">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-start gap-3">
                      <spec.icon size={20} strokeWidth={1.25} className="mt-0.5 shrink-0 text-black/40" />
                      <div>
                        <p className="text-[10px] tracking-[0.14em] text-black/40">
                          {spec.label}
                        </p>
                        <p className="mt-0.5 text-[14px] tabular-nums text-black/80">
                          {spec.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-7 border-t border-black/10 pt-6">
                <p className="text-[12px] leading-[1.9] text-black/55">
                  お電話でのお問い合わせ
                </p>
                <a
                  href={`tel:${tel.replace(/-/g, "")}`}
                  className="mt-1.5 flex items-baseline gap-2.5 text-black/85 transition-colors hover:text-black"
                >
                  <Phone size={14} strokeWidth={1.5} className="translate-y-0.5" />
                  <span
                    className="text-[22px] font-light tracking-[0.06em] tabular-nums"
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    {tel}
                  </span>
                </a>
                {companyName && (
                  <p className="mt-1 text-[11px] text-black/40">{companyName}</p>
                )}
              </div>

              <div className="my-7 border-t border-black/10" />

              <button
                type="button"
                onClick={() => (fav ? removeFavorite(property.id) : addFavorite(property.id))}
                className={cn(
                  "mb-3 flex w-full items-center justify-center gap-2 rounded-[6px] border py-3 text-[13px] transition-colors duration-300",
                  fav
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-black/15 text-black/65 hover:border-black/40 hover:text-black",
                )}
              >
                <Heart size={15} className={fav ? "fill-red-500 stroke-red-500" : ""} />
                {fav ? "お気に入り済み" : "お気に入りに追加"}
              </button>

              <LetterSwapButton
                href={`/contact/?property=${property.property_name}`}
                label="この物件を問い合わせる"
                icon="send"
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* 周辺施設 */}
        {(facilities.length > 0 || (property.lat != null && property.lng != null)) && (
          <section className="mt-24 lg:mt-32">
            <p
              className="mb-4 text-black/45"
              style={{ fontFamily: "var(--font-display)", fontSize: "14px", letterSpacing: "0.35em" }}
            >
              NEIGHBORHOOD
            </p>
            <h2 className="mb-10 font-serif text-[clamp(28px,4vw,40px)] font-light text-black">
              周辺施設
            </h2>
            <PropertyFacilities
              propertyName={property.property_name}
              propertyLat={property.lat}
              propertyLng={property.lng}
              facilities={facilities}
            />
          </section>
        )}

        {/* 関連物件 */}
        {related.length > 0 && (
          <div className="mt-24 lg:mt-32">
            <p
              className="mb-4 text-black/45"
              style={{ fontFamily: "var(--font-display)", fontSize: "14px", letterSpacing: "0.35em" }}
            >
              RELATED
            </p>
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-light text-black">
                関連物件
              </h2>
              <Link
                href={`/properties/property-categories/${category?.slug ?? "all"}/`}
                className="group inline-flex items-center gap-3 text-[12px] tracking-[0.15em] text-black/55 uppercase transition-colors duration-300 hover:text-black"
              >
                一覧を見る
                <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-16" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ライトボックスモーダル */}
      <AnimatePresence>
        {modalOpen && images[currentImg] && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setModalOpen(false)}
          >
            {/* バックドロップ */}
            <div className="absolute inset-0 bg-black/88 backdrop-blur-sm" />

            {/* 閉じるボタン */}
            <button
              type="button"
              aria-label="閉じる"
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
              onClick={() => setModalOpen(false)}
            >
              <X size={18} />
            </button>

            {/* 画像 */}
            <motion.div
              className="relative z-10 max-h-[88svh] w-full max-w-[92vw] lg:max-w-4xl"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px] lg:aspect-[16/10]">
                <Image
                  src={images[currentImg].image_url}
                  alt={property.property_name}
                  fill
                  className="object-contain"
                  sizes="92vw"
                />
              </div>
              {images.length > 1 && (
                <p
                  className="mt-3 text-center text-[11px] tabular-nums tracking-[0.15em] text-white/45"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  {currentImg + 1} / {images.length}
                </p>
              )}
            </motion.div>

            {/* モーダル内でも左右スワイプ・端タップ */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="前の画像"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25 lg:left-6"
                  onClick={(e) => { e.stopPropagation(); prev() }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="次の画像"
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25 lg:right-6"
                  onClick={(e) => { e.stopPropagation(); next() }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
