import { createClient } from "@/lib/supabase/server"
import { PropertyCard } from "@/components/properties/property-card"
import { CategoryFilter } from "@/components/properties/category-filter"
import { SCROLL_PAGE_PT } from "@/components/top/top-page-nav"
import { SUB_PAGE_PT } from "@/components/layout/sub-page-nav"
import { Pagination } from "@/components/ui/pagination"
import { SUBPAGE_HERO_IMAGES } from "@/lib/subpage-hero-images"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ categorySlug: string }>
  searchParams: Promise<{ area?: string; min?: string; max?: string; page?: string }>
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  land: { title: "土地", description: "南伊豆エリアの土地情報一覧" },
  house: { title: "戸建・別荘", description: "南伊豆エリアの戸建・別荘情報一覧" },
  all: { title: "全物件", description: "南伊豆エリアの不動産情報一覧" },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params
  const meta = CATEGORY_META[categorySlug] ?? { title: "物件一覧", description: "" }
  return { title: meta.title }
}

const PAGE_SIZE = 12

export default async function PropertyListPage({ params, searchParams }: Props) {
  const { categorySlug } = await params
  const { area, min, max, page } = await searchParams
  const currentPage = Number(page ?? 1)

  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("property_categories")
    .select("id, slug, name")
    .order("name")

  const { data: areas } = await supabase
    .from("areas")
    .select("id, slug, name")
    .order("name")

  // 非公開 (9) 以外は商談中・ご成約も表示する（旧サイト仕様）
  let query = supabase
    .from("properties")
    .select(
      "*, property_images(image_url, sort_order), area:areas(name, slug), property_category:property_categories(name, slug)",
      { count: "exact" },
    )
    .neq("status", 9)

  if (categorySlug !== "all") {
    const category = categories?.find((c) => c.slug === categorySlug)
    if (!category) notFound()
    query = query.eq("property_category_id", category.id)
  }

  if (area) {
    const areaData = areas?.find((a) => a.slug === area)
    if (areaData) query = query.eq("area_id", areaData.id)
  }

  if (min) query = query.gte("price", Number(min))
  if (max) query = query.lte("price", Number(max))

  const { data: allProperties, count } = await query
    .order("updated_at", { ascending: false })

  // 新着 (2) を先頭に、次いでステータス昇順（公開中→価格変更→商談中→ご成約）
  const sorted = (allProperties ?? []).sort((a, b) => {
    if (a.status === 2 && b.status !== 2) return -1
    if (a.status !== 2 && b.status === 2) return 1
    return a.status - b.status
  })
  const properties = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const meta = CATEGORY_META[categorySlug] ?? { title: "物件一覧", description: "" }

  const featuredLayout = currentPage === 1 && (properties?.length ?? 0) >= 3
  const featured = featuredLayout ? properties![0] : null
  const gridProperties = featuredLayout ? properties!.slice(1) : (properties ?? [])
  const indexOffset = (currentPage - 1) * PAGE_SIZE

  const pagePt =
    categorySlug === "land" || categorySlug === "house" ? SUB_PAGE_PT : SCROLL_PAGE_PT

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: pagePt }}>
      {/* エディトリアルヘッダー */}
      <header className="mx-auto max-w-screen-xl px-6 pt-8 pb-10 lg:px-12 lg:pt-14 lg:pb-16">
        <p
          className="mb-4 text-black/45"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            letterSpacing: "0.35em",
          }}
        >
          PROPERTIES
        </p>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <h1 className="font-serif text-[clamp(40px,5.5vw,80px)] font-light leading-[1.05] text-black">
            {meta.title}
          </h1>
          <p className="pb-1.5 text-right" style={{ fontFamily: "var(--font-barlow)" }}>
            <span className="block text-[clamp(26px,3vw,42px)] font-light leading-none tabular-nums text-black/85">
              {String(count ?? 0).padStart(2, "0")}
            </span>
            <span className="mt-1.5 block text-[11px] tracking-[0.3em] text-black/40 uppercase">
              Listings
            </span>
          </p>
        </div>
        {meta.description && (
          <p className="mt-4 text-[13px] leading-relaxed text-black/50">
            {meta.description}
          </p>
        )}
      </header>

      <div className="mx-auto max-w-screen-xl px-6 pb-20 lg:px-12 lg:pb-28">
        <CategoryFilter
          categories={categories ?? []}
          areas={areas ?? []}
          currentCategory={categorySlug}
          currentArea={area}
          currentMin={min}
          currentMax={max}
        />

        {properties && properties.length > 0 ? (
          <>
            {featured && (
              <div className="mt-12 lg:mt-16">
                <PropertyCard property={featured} index={1} variant="featured" />
              </div>
            )}

            {gridProperties.length > 0 && (
              <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
                {gridProperties.map((property, i) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={indexOffset + (featured ? 2 : 1) + i}
                  />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              buildHref={(p) =>
                `?page=${p}${area ? `&area=${area}` : ""}${min ? `&min=${min}` : ""}${max ? `&max=${max}` : ""}`
              }
            />
          </>
        ) : (
          <div className="py-24 text-center text-black/45">
            <p className="font-serif text-[20px] font-light">該当する物件が見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  )
}
