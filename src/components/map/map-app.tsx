"use client"

import dynamic from "next/dynamic"
import { useMediaQuery } from "usehooks-ts"
import type { MapData } from "@/types/map"
const SearchInMapDesktop = dynamic(
  () => import("@/components/map/search-in-map-desktop").then((m) => m.SearchInMapDesktop),
  { ssr: false }
)

const SearchInMapSp = dynamic(
  () => import("@/components/map/search-in-map-sp").then((m) => m.SearchInMapSp),
  { ssr: false }
)

export function MapApp({ data }: { data: MapData }) {
  const isDesktop = useMediaQuery("(min-width: 1280px)")
  if (isDesktop) return <SearchInMapDesktop data={data} />
  return <SearchInMapSp data={data} />
}
