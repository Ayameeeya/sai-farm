"use client"

import { useMemo, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { AnimatePresence } from "framer-motion"
import type { Map as LeafletMap } from "leaflet"
import "leaflet/dist/leaflet.css"
import "@/styles/map.css"

import { MapInstanceCapture } from "@/components/map/map-instance-capture"
import { MapToolbar } from "@/components/map/map-header"
import { MapSearchBox } from "@/components/map/map-search-box"
import { MapSidePanel } from "@/components/map/map-side-panel"
import { PropertyPane } from "@/components/map/property-pane"
import { MarkerFacilityCard } from "@/components/map/marker-facility-card"
import { MapControls } from "@/components/map/map-controls"
import { createPricePin } from "@/components/map/icons/price-pin"
import { getIconByCategory } from "@/components/map/icons/get-icon-by-category"
import type { MapData, MapProperty } from "@/types/map"

const CENTER: [number, number] = [34.6944445, 138.7469657]
const ZOOM = 15

export function SearchInMapDesktop({ data }: { data: MapData }) {
  const { areas, facilityTypes, facilities, properties } = data
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [facilityFilter, setFacilityFilter] = useState<string | null>(null)
  const [map, setMap] = useState<LeafletMap | null>(null)

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) ?? null

  const filteredFacilities = useMemo(
    () =>
      facilityFilter
        ? facilities.filter((f) => f.facilityTypeSlug === facilityFilter)
        : facilities,
    [facilities, facilityFilter],
  )

  const clickPropertyMarker = (property: MapProperty) => {
    setSelectedPropertyId(property.id)
    map?.flyTo([property.lat, property.lng], ZOOM)
  }

  const displayMap = useMemo(() => {
    return (
      <MapContainer center={CENTER} zoom={ZOOM} zoomControl={false} style={{ height: "100dvh" }}>
        <MapInstanceCapture onMap={setMap} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* 物件: 価格ピン */}
        {properties.map((property) => (
          <Marker
            key={`${property.id}-${property.id === selectedPropertyId ? "on" : "off"}`}
            position={[property.lat, property.lng]}
            icon={createPricePin(property, property.id === selectedPropertyId)}
            zIndexOffset={property.id === selectedPropertyId ? 1000 : 500}
            eventHandlers={{ click: () => clickPropertyMarker(property) }}
          />
        ))}

        {/* 周辺施設 */}
        {(selectedProperty ? selectedProperty.facilities : filteredFacilities).map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.lat, facility.lng]}
            icon={getIconByCategory(facility.facilityTypeSlug)}
            eventHandlers={{
              click: () => map?.setView([facility.lat, facility.lng], ZOOM),
            }}
          >
            <Popup>
              <MarkerFacilityCard facility={facility} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPropertyId, map, properties, filteredFacilities, selectedProperty])

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#eae7e0]">
      <div className="absolute inset-0 z-0">{displayMap}</div>

      <MapToolbar>
        <MapSearchBox map={map} />
      </MapToolbar>

      <MapSidePanel
        areas={areas}
        facilityTypes={facilityTypes}
        facilityFilter={facilityFilter}
        setFacilityFilter={setFacilityFilter}
        selectedProperty={selectedProperty}
        map={map}
      />

      <MapControls map={map} />

      <AnimatePresence>
        {selectedProperty && (
          <PropertyPane
            property={selectedProperty}
            properties={properties}
            setSelectedProperty={(id) => setSelectedPropertyId(id || null)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
