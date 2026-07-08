import { createClient } from "@/lib/supabase/server"
import { FacilitiesManager, type FacilityRow } from "@/components/admin/facilities-manager"

export const metadata = { title: "周辺施設" }

export default async function AdminFacilitiesPage() {
  const supabase = await createClient()

  const [{ data: facilities }, { data: facilityTypes }, { data: links }] = await Promise.all([
    supabase
      .from("facilities")
      .select("id, name, description, facility_type_id, image_url, lat, lng, facility_type:facility_types(name)")
      .order("name"),
    supabase.from("facility_types").select("id, name").order("name"),
    supabase.from("property_facilities").select("facility_id"),
  ])

  const countMap = new Map<string, number>()
  for (const link of links ?? []) {
    countMap.set(link.facility_id, (countMap.get(link.facility_id) ?? 0) + 1)
  }

  const rows: FacilityRow[] = (facilities ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    description: f.description,
    facility_type_id: f.facility_type_id,
    image_url: f.image_url,
    lat: f.lat,
    lng: f.lng,
    typeName: (f.facility_type as unknown as { name: string } | null)?.name ?? null,
    propertyCount: countMap.get(f.id) ?? 0,
  }))

  return (
    <div>
      <h1 className="mb-2 font-serif text-[24px] font-light text-black">周辺施設</h1>
      <p className="mb-8 text-[12px] text-black/45">
        物件詳細ページの地図に表示する周辺施設（病院・スーパー・海水浴場など）を管理します。物件への紐付けは各物件の編集画面から。
      </p>
      <FacilitiesManager facilities={rows} facilityTypes={facilityTypes ?? []} />
    </div>
  )
}
