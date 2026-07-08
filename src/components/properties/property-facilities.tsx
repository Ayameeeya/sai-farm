"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import type { Map as LeafletMap } from "leaflet"
import "leaflet/dist/leaflet.css"
import "@/styles/map.css"
import { MapPin } from "lucide-react"
import { MapInstanceCapture } from "@/components/map/map-instance-capture"
import { createLocationPin } from "@/components/map/icons/location-pin"
import { getIconByCategory } from "@/components/map/icons/get-icon-by-category"
import { MarkerFacilityCard } from "@/components/map/marker-facility-card"
import { STICKY_TOP } from "@/components/top/top-page-nav"

export type PropertyFacility = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  lat: number
  lng: number
  facility_type?: { name: string; slug: string } | null
}

type Props = {
  propertyName: string
  propertyLat: number | null
  propertyLng: number | null
  facilities: PropertyFacility[]
}

/** 2点間の距離（km）— ハーサイン */
function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function formatDistance(km: number): string {
  if (km >= 1) return `約${km.toFixed(1)}km`
  return `約${Math.round((km * 1000) / 10) * 10}m`
}

export function PropertyFacilities({
  propertyName,
  propertyLat,
  propertyLng,
  facilities,
}: Props) {
  const [map, setMap] = useState<LeafletMap | null>(null)
  const mapAnchor = useRef<HTMLDivElement>(null)

  const hasLocation = propertyLat != null && propertyLng != null
  const center: [number, number] = hasLocation
    ? [propertyLat, propertyLng]
    : [facilities[0].lat, facilities[0].lng]

  const flyTo = (lat: number, lng: number, zoom = 15) => {
    map?.setView([lat, lng], zoom)
    mapAnchor.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div>
      <div
        ref={mapAnchor}
        className="relative z-0 h-[420px] overflow-hidden rounded-[6px] lg:h-[500px]"
        style={{ scrollMarginTop: STICKY_TOP + 16 }}
      >
        <MapContainer key={`${center[0]}-${center[1]}`} center={center} zoom={14} style={{ height: "100%" }}>
          <MapInstanceCapture onMap={setMap} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hasLocation && (
            <Marker
              position={[propertyLat, propertyLng]}
              icon={createLocationPin({ selected: true })}
              zIndexOffset={1000}
              interactive={false}
            />
          )}
          {facilities.map((f) => (
            <Marker
              key={f.id}
              position={[f.lat, f.lng]}
              icon={getIconByCategory(f.facility_type?.slug ?? "default")}
            >
              <Popup>
                <MarkerFacilityCard
                  facility={{
                    id: f.id,
                    name: f.name,
                    lat: f.lat,
                    lng: f.lng,
                    imageUrl: f.image_url,
                    description: f.description,
                    facilityTypeSlug: f.facility_type?.slug ?? "default",
                  }}
                />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {hasLocation && (
        <button
          type="button"
          onClick={() => flyTo(propertyLat, propertyLng, 16)}
          className="group mt-5 inline-flex items-center gap-2 text-[12px] tracking-[0.15em] text-black/55 uppercase transition-colors duration-300 hover:text-black"
        >
          <MapPin size={14} strokeWidth={1.5} />
          物件の場所を確認
          <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-16" />
        </button>
      )}

      {facilities.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
          {facilities.map((f) => {
            const dist = hasLocation
              ? distanceKm(
                  { lat: propertyLat, lng: propertyLng },
                  { lat: f.lat, lng: f.lng },
                )
              : null

            return (
              <article key={f.id} className="group">
                <button
                  type="button"
                  onClick={() => flyTo(f.lat, f.lng)}
                  className="block w-full text-left"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-black/5">
                    {f.image_url ? (
                      <Image
                        src={f.image_url}
                        alt={f.name}
                        fill
                        className="object-cover saturate-[0.9] transition-transform duration-[8000ms] ease-out group-hover:scale-[1.08]"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[12px] text-black/30">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    {f.facility_type?.name && (
                      <p
                        className="mb-1.5 text-[10px] tracking-[0.24em] text-black/40 uppercase"
                        style={{ fontFamily: "var(--font-barlow)" }}
                      >
                        {f.facility_type.name}
                      </p>
                    )}
                    <h3 className="font-serif text-[16px] font-light leading-snug text-black lg:text-[17px]">
                      {f.name}
                    </h3>
                    {f.description && (
                      <p className="mt-2 text-[12px] leading-[1.9] text-black/55 line-clamp-2">
                        {f.description}
                      </p>
                    )}
                    <p className="mt-3 flex items-center gap-1.5 border-t border-black/10 pt-3 text-[12px] text-black/50 transition-colors duration-300 group-hover:text-black">
                      <MapPin size={12} strokeWidth={1.5} />
                      {dist != null ? `物件から${formatDistance(dist)}` : "地図で見る"}
                    </p>
                  </div>
                </button>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
