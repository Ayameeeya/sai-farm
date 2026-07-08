import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PropertyForm } from "@/components/admin/property-form"

export const metadata = { title: "物件を登録" }

export default async function AdminPropertyNewPage() {
  const supabase = await createClient()
  const [{ data: categories }, { data: areas }, { data: tags }, { data: facilities }] =
    await Promise.all([
      supabase.from("property_categories").select("id, name").order("name"),
      supabase.from("areas").select("id, name").order("name"),
      supabase.from("tags").select("id, name").order("name"),
      supabase
        .from("facilities")
        .select("id, name, facility_type:facility_types(name)")
        .order("name"),
    ])

  const facilityOptions = (facilities ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    typeName: (f.facility_type as unknown as { name: string } | null)?.name ?? null,
  }))

  return (
    <div>
      <Link
        href="/admin/properties"
        className="mb-4 inline-flex items-center gap-1 text-[12px] text-black/45 transition-colors hover:text-black"
      >
        <ChevronLeft size={13} />
        物件一覧
      </Link>
      <h1 className="mb-8 font-serif text-[24px] font-light text-black">物件を登録</h1>
      <PropertyForm
        propertyId={null}
        defaults={{}}
        categories={categories ?? []}
        areas={areas ?? []}
        tags={tags ?? []}
        facilities={facilityOptions}
      />
    </div>
  )
}
