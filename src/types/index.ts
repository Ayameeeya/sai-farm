/** 物件詳細スペック（properties.details jsonb・詳細ページの表でのみ使用） */
export type PropertyDetails = {
  property_code?: string
  nearest_station?: string
  layout_detail?: string
  structure?: string
  completion?: string
  land_ownership?: string
  land_category?: string
  city_planning_area?: string
  use_zoning?: string
  other_legal_restriction?: string
  building_coverage_ratio?: string
  floor_area_ratio?: string
  terrain?: string
  adjacent_road?: string
  parking?: string
  utilities?: string
  occupancy?: string
  handover?: string
  conditions_transactions?: string
  pic?: string
}

export type Property = {
  id: string
  property_name: string
  slug: string
  status: number
  price: number | null
  address: string | null
  transportation: string | null
  layout: string | null
  bedroom: number | null
  bathroom: number | null
  land_space_sqm: number | null
  building_space_sqm: number | null
  lat: number | null
  lng: number | null
  comment: string | null
  one_point: string | null
  details: PropertyDetails
  area_id: string | null
  property_category_id: string | null
  created_at: string
  updated_at: string
  area?: Area
  property_category?: PropertyCategory
  property_images?: PropertyImage[]
  facilities?: Facility[]
  tags?: Tag[]
}

export type PropertyImage = {
  id: string
  property_id: string
  image_url: string
  sort_order: number
}

export type Area = {
  id: string
  slug: string
  name: string
  lat: number | null
  lng: number | null
}

export type PropertyCategory = {
  id: string
  slug: string
  name: string
}

export type Facility = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  lat: number
  lng: number
  facility_type_id: string | null
  facility_type?: FacilityType
}

export type FacilityType = {
  id: string
  slug: string
  name: string
}

export type Tag = {
  id: string
  name: string
}

export type Service = {
  id: string
  slug: string
  name: string
  description: string | null
  content: Record<string, unknown> | null
  featured_photo_url: string | null
  published: boolean
  meta_description: string | null
  created_at: string
  updated_at: string
}

export type Article = {
  id: string
  slug: string
  title: string
  content: Record<string, unknown> | null
  featured_photo_url: string | null
  published: boolean
  meta_description: string | null
  author_id: string | null
  category_id: string | null
  created_at: string
  updated_at: string
  author?: Author
  category?: ArticleCategory
  tags?: Tag[]
}

export type Author = {
  id: string
  name: string
  avatar_url: string | null
  description: string | null
}

export type ArticleCategory = {
  id: string
  name: string
}

export type CompanyProfile = {
  id: string
  name: string | null
  address: string | null
  transportation: string | null
  tel: string | null
  fax: string | null
  email: string | null
  capital: string | null
  representative_name: string | null
  established_on: string | null
  license: string | null
  community: string | null
  working_hour: string | null
  holidays: string | null
}

export type News = {
  id: string
  title: string
  tag_id: string | null
  created_at: string
  tag?: NewsTag
}

export type NewsTag = {
  id: string
  name: string
}

export type PropertyStatus = 1 | 2 | 3 | 7 | 8 | 9

export const PROPERTY_STATUS_LABELS: Record<number, string> = {
  2: "新着物件",
  3: "価格変更",
  7: "商談中",
  8: "ご成約",
}
