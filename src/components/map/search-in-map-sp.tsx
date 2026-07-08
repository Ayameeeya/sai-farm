"use client"

import { useMemo, useState } from "react"
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import { useForm } from "react-hook-form"
import { normalize } from "@geolonia/normalize-japanese-addresses"
import { Search } from "lucide-react"
import type { Map as LeafletMap } from "leaflet"
import "leaflet/dist/leaflet.css"
import "@/styles/map.css"

import { MapInstanceCapture } from "@/components/map/map-instance-capture"
import { BAR_H } from "@/components/top/top-page-nav"
import { createPricePin } from "@/components/map/icons/price-pin"
import { getIconByCategory } from "@/components/map/icons/get-icon-by-category"
import {
  AreaJumpButton,
  CategoryBox,
  CurrentLocationButton,
  DraggableContainer,
} from "@/components/map/sp-map-ui"
import { FavoritesModal } from "@/components/map/favorites-modal"
import { PropertyDetailSheet, FacilityDetailSheet } from "@/components/map/sp-detail-sheets"
import type { MapData, MapFacility, MapProperty } from "@/types/map"

const CENTER: [number, number] = [34.6944445, 138.7469657]
const ZOOM = 15

type SelectedPlace =
  | ({ kind: "property" } & MapProperty)
  | ({ kind: "facility" } & MapFacility)
  | null

function SpSearchBox({ map }: { map: LeafletMap | null }) {
  const { register, handleSubmit } = useForm<{ address: string }>()
  const onSubmit = async (data: { address: string }) => {
    if (!map || !data.address) return
    const res = await normalize(data.address)
    if (res.point?.lat && res.point?.lng) map.flyTo([res.point.lat, res.point.lng], map.getZoom())
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-11 items-center overflow-hidden rounded-full bg-white/95 shadow-[0_14px_40px_-10px_rgba(13,12,10,0.35)] ring-1 ring-black/5 backdrop-blur-md"
    >
      <Search size={15} strokeWidth={1.5} className="ml-4 shrink-0 text-black/40" />
      <input
        {...register("address")}
        placeholder="住所・地名で移動"
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-[13px] outline-none placeholder:text-black/35"
      />
      <button
        type="submit"
        className="m-1 flex h-9 shrink-0 items-center rounded-full bg-[#141311] px-4 text-[12px] text-white"
      >
        検索
      </button>
    </form>
  )
}

export function SearchInMapSp({ data }: { data: MapData }) {
  const { areas, facilityTypes, facilities, properties } = data
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace>(null)

  const filteredFacilities = useMemo(
    () =>
      selectedCategory
        ? facilities.filter((f) => f.facilityTypeSlug === selectedCategory)
        : facilities,
    [facilities, selectedCategory],
  )

  const displayMap = useMemo(
    () => (
      <MapContainer center={CENTER} zoom={ZOOM} zoomControl={false} style={{ height: "100dvh" }}>
        <MapInstanceCapture onMap={setMap} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {properties.map((property) => (
          <Marker
            key={`${property.id}-${selectedPlace?.kind === "property" && selectedPlace.id === property.id ? "on" : "off"}`}
            position={[property.lat, property.lng]}
            icon={createPricePin(
              property,
              selectedPlace?.kind === "property" && selectedPlace.id === property.id,
            )}
            zIndexOffset={500}
            eventHandlers={{
              click: () => {
                setSelectedPlace({ kind: "property", ...property })
                map?.setView([property.lat, property.lng], ZOOM)
              },
            }}
          />
        ))}
        {filteredFacilities.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.lat, facility.lng]}
            icon={getIconByCategory(facility.facilityTypeSlug)!}
            eventHandlers={{
              click: () => {
                setSelectedPlace({ kind: "facility", ...facility })
                map?.setView([facility.lat, facility.lng], ZOOM)
              },
            }}
          />
        ))}
      </MapContainer>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [properties, filteredFacilities, map, selectedPlace],
  )

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#eae7e0]">
      <div className="absolute inset-0 z-0">{displayMap}</div>

      <div className="pointer-events-none absolute inset-x-0 z-[30] space-y-2.5 p-4" style={{ top: BAR_H }}>
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="min-w-0 flex-1">{map && <SpSearchBox map={map} />}</div>
          <FavoritesModal properties={properties} compact />
        </div>

        <div className="pointer-events-auto">
          <DraggableContainer>
            {areas.map((area) => (
              <AreaJumpButton key={area.id} area={area} map={map} />
            ))}
          </DraggableContainer>
        </div>

        <div className="pointer-events-auto">
          <DraggableContainer>
            {facilityTypes.map((ft) => (
              <CategoryBox
                key={ft.id}
                text={ft.name}
                slug={ft.slug}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            ))}
          </DraggableContainer>
        </div>
      </div>

      {map && <CurrentLocationButton map={map} />}

      {selectedPlace?.kind === "property" && <PropertyDetailSheet property={selectedPlace} />}
      {selectedPlace?.kind === "facility" && <FacilityDetailSheet facility={selectedPlace} />}
    </div>
  )
}
