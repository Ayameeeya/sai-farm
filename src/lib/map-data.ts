import { createClient } from "@/lib/supabase/server"
import type { MapArea, MapData, MapFacility, MapFacilityType, MapProperty } from "@/types/map"

function mapFacility(row: {
  id: string
  name: string
  lat: number
  lng: number
  image_url: string | null
  description: string | null
  facility_type?: { slug: string } | { slug: string }[] | null
}): MapFacility {
  const ft = row.facility_type
  const slug = Array.isArray(ft) ? ft[0]?.slug : ft?.slug
  return {
    id: row.id,
    name: row.name,
    lat: row.lat,
    lng: row.lng,
    imageUrl: row.image_url,
    description: row.description,
    facilityTypeSlug: slug ?? "default",
  }
}

export async function getMapData(): Promise<MapData> {
  const supabase = await createClient()

  const [areasRes, facilityTypesRes, facilitiesRes, propertiesRes] = await Promise.all([
    supabase.from("areas").select("id, name, lat, lng").order("name"),
    supabase.from("facility_types").select("id, name, slug").order("name"),
    supabase
      .from("facilities")
      .select("id, name, lat, lng, image_url, description, facility_type:facility_types(slug)"),
    supabase
      .from("properties")
      .select(
        `
        id, slug, property_name, lat, lng, layout, address, transportation, price, details, building_space_sqm, status,
        property_category:property_categories(name),
        property_images(image_url, sort_order),
        property_facilities(
          facility:facilities(
            id, name, lat, lng, image_url, description,
            facility_type:facility_types(slug)
          )
        )
      `,
      )
      .lt("status", 7)
      .not("lat", "is", null)
      .not("lng", "is", null),
  ])

  const areas: MapArea[] =
    areasRes.data?.map((a) => ({
      id: a.id,
      name: a.name,
      lat: a.lat,
      lng: a.lng,
    })) ?? []

  const facilityTypes: MapFacilityType[] = facilityTypesRes.data ?? []

  const facilities: MapFacility[] =
    facilitiesRes.data?.map((f) => mapFacility(f as Parameters<typeof mapFacility>[0])) ?? []

  const properties: MapProperty[] =
    propertiesRes.data?.map((p) => {
      const images =
        (p.property_images as { image_url: string; sort_order: number }[] | null)
          ?.sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => img.image_url) ?? []

      const linkedFacilities =
        (
          p.property_facilities as unknown as {
            facility: Parameters<typeof mapFacility>[0] | null
          }[] | null
        )
          ?.map((rel) => rel.facility)
          .filter(Boolean)
          .map((f) => mapFacility(f!)) ?? []

      return {
        id: p.id,
        slug: p.slug,
        propertyName: p.property_name,
        lat: p.lat as number,
        lng: p.lng as number,
        categoryName:
          (p.property_category as unknown as { name: string } | null)?.name ?? "",
        images,
        layout: p.layout,
        address: p.address,
        transportation: p.transportation,
        price: p.price,
        structure: (p.details as { structure?: string } | null)?.structure ?? null,
        buildingSpaceSqm: p.building_space_sqm,
        facilities: linkedFacilities,
      }
    }) ?? []

  return { areas, facilityTypes, facilities, properties }
}
