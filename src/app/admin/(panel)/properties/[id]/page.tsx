import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PropertyForm } from "@/components/admin/property-form"

export const metadata = { title: "物件を編集" }

export default async function AdminPropertyEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: property },
    { data: categories },
    { data: areas },
    { data: tags },
    { data: facilities },
  ] = await Promise.all([
    supabase
      .from("properties")
      .select(
        "*, property_images(image_url, sort_order), property_tags(tag_id), property_facilities(facility_id)",
      )
      .eq("id", id)
      .single(),
    supabase.from("property_categories").select("id, name").order("name"),
    supabase.from("areas").select("id, name").order("name"),
    supabase.from("tags").select("id, name").order("name"),
    supabase
      .from("facilities")
      .select("id, name, facility_type:facility_types(name)")
      .order("name"),
  ])

  if (!property) notFound()

  const images = [...(property.property_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.image_url)

  const tagIds = (property.property_tags as { tag_id: string }[] | null)?.map(
    (pt) => pt.tag_id,
  ) ?? []
  const facilityIds = (
    property.property_facilities as { facility_id: string }[] | null
  )?.map((pf) => pf.facility_id) ?? []

  const facilityOptions = (facilities ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    typeName: (f.facility_type as unknown as { name: string } | null)?.name ?? null,
  }))

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1 text-[12px] text-black/45 transition-colors hover:text-black"
        >
          <ChevronLeft size={13} />
          物件一覧
        </Link>
        <Link
          href={`/properties/${property.slug}/`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-[12px] text-black/45 transition-colors hover:text-black"
        >
          公開ページを表示
          <ExternalLink size={12} />
        </Link>
      </div>
      <h1 className="mb-8 font-serif text-[24px] font-light text-black">
        {property.property_name}
      </h1>
      <PropertyForm
        propertyId={id}
        defaults={{ ...property, images, tag_ids: tagIds, facility_ids: facilityIds }}
        categories={categories ?? []}
        areas={areas ?? []}
        tags={tags ?? []}
        facilities={facilityOptions}
      />
    </div>
  )
}
