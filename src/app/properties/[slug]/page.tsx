import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PropertyDetail } from "@/components/properties/property-detail"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("properties")
    .select(
      "property_name, address, price, layout, comment, property_images(image_url, sort_order), property_category:property_categories(name)",
    )
    .eq("slug", slug)
    .single()
  if (!data) return { title: "物件情報" }

  const image = [...(data.property_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )[0]?.image_url

  // メタディスクリプションは物件データから自動生成
  const category = (data.property_category as unknown as { name: string } | null)?.name
  const specs = [
    data.address,
    category && `【${category}】`,
    data.layout,
    data.price ? `${data.price.toLocaleString()}万円` : null,
  ]
    .filter(Boolean)
    .join(" ")
  const commentExcerpt = data.comment ? String(data.comment).slice(0, 60) : ""
  const description = `${data.property_name}（${specs}）。${commentExcerpt}南伊豆の不動産ならサイファーム南伊豆へ。`

  return {
    title: data.property_name,
    description,
    openGraph: {
      title: data.property_name,
      description,
      images: image ? [image] : undefined,
    },
    twitter: image ? { images: [image] } : undefined,
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from("properties")
    .select(`
      *,
      property_images(image_url, sort_order),
      area:areas(name, slug),
      property_category:property_categories(name, slug),
      property_facilities(facility:facilities(id, name, description, image_url, lat, lng, facility_type:facility_types(name))),
      property_tags(tag:tags(name))
    `)
    .eq("slug", slug)
    .neq("status", 9)
    .single()

  if (!property) notFound()

  // 関連物件（同カテゴリ）・会社情報
  const [{ data: related }, { data: profile }] = await Promise.all([
    supabase
      .from("properties")
      .select("*, property_images(image_url, sort_order), area:areas(name)")
      .eq("property_category_id", property.property_category_id ?? "")
      .neq("id", property.id)
      .lt("status", 7)
      .limit(3),
    supabase.from("company_profile").select("name, tel").limit(1).maybeSingle(),
  ])

  return (
    <PropertyDetail
      property={property}
      related={related ?? []}
      companyName={profile?.name ?? null}
      tel={profile?.tel ?? "0558-64-8880"}
    />
  )
}
