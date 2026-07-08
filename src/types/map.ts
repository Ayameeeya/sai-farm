export type MapFacility = {
  id: string
  name: string
  lat: number
  lng: number
  imageUrl: string | null
  description: string | null
  facilityTypeSlug: string
}

export type MapProperty = {
  id: string
  slug: string
  propertyName: string
  lat: number
  lng: number
  categoryName: string
  images: string[]
  layout: string | null
  address: string | null
  transportation: string | null
  price: number | null
  structure: string | null
  buildingSpaceSqm: number | null
  facilities: MapFacility[]
}

export type MapArea = {
  id: string
  name: string
  lat: number | null
  lng: number | null
}

export type MapFacilityType = {
  id: string
  name: string
  slug: string
}

export type MapData = {
  areas: MapArea[]
  facilityTypes: MapFacilityType[]
  facilities: MapFacility[]
  properties: MapProperty[]
}
