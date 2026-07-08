import { MapApp } from "@/components/map/map-app"
import { getMapData } from "@/lib/map-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "エリアから探す",
  description: "地図から南伊豆エリアの物件・周辺施設を探す。",
}

export default async function MapPage() {
  const data = await getMapData()
  return <MapApp data={data} />
}
