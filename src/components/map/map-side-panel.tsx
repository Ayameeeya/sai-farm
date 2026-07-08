"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, MapPin } from "lucide-react"
import type { Map as LeafletMap } from "leaflet"
import type { MapArea, MapFacility, MapFacilityType, MapProperty } from "@/types/map"
import { FacilityCategoryIcon } from "@/components/map/sp-map-ui"

function SectionLabel({ en, ja }: { en: string; ja: string }) {
  return (
    <p className="flex items-baseline gap-3">
      <span
        className="text-[11px] tracking-[0.35em] text-black/40 uppercase"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {en}
      </span>
      <span className="text-[11px] text-black/45">{ja}</span>
    </p>
  )
}

export function MapSidePanel({
  areas,
  facilityTypes,
  facilityFilter,
  setFacilityFilter,
  selectedProperty,
  map,
}: {
  areas: MapArea[]
  facilityTypes: MapFacilityType[]
  facilityFilter: string | null
  setFacilityFilter: (slug: string | null) => void
  selectedProperty: MapProperty | null
  map: LeafletMap | null
}) {
  const [open, setOpen] = useState(true)
  const [activeAreaId, setActiveAreaId] = useState<string | null>(null)

  const jumpIntoArea = (area: MapArea) => {
    if (!map || !area.lat || !area.lng) return
    setActiveAreaId(area.id)
    map.flyTo([area.lat, area.lng], 14)
  }

  const flyToFacility = (facility: MapFacility) => {
    if (!map) return
    map.flyTo([facility.lat, facility.lng], 16)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-5 left-5 top-[108px] z-[60] flex w-[320px] flex-col overflow-hidden rounded-[14px] bg-white/95 shadow-[0_24px_70px_-18px_rgba(13,12,10,0.4)] ring-1 ring-black/5 backdrop-blur-md"
          >
            <div className="border-b border-black/[0.07] px-6 pb-5 pt-6">
              <p
                className="text-[11px] tracking-[0.4em] text-black/40 uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Explore Minami-Izu
              </p>
              <h1 className="mt-2 font-serif text-[22px] font-light leading-snug text-black">
                エリアから探す
              </h1>
            </div>

            <div className="map-scrollbar flex-1 overflow-y-auto px-6 py-6">
              {/* エリア */}
              <SectionLabel en="Areas" ja="エリア" />
              <div className="mt-3 flex flex-wrap gap-2">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => jumpIntoArea(area)}
                    className={`rounded-full border px-3.5 py-1.5 text-[12px] transition-colors ${
                      activeAreaId === area.id
                        ? "border-black bg-black text-white"
                        : "border-black/15 bg-white text-black/70 hover:border-black/40 hover:text-black"
                    }`}
                  >
                    {area.name}
                  </button>
                ))}
              </div>

              {/* 周辺施設 */}
              <div className="mt-8">
                <SectionLabel en="Facilities" ja="周辺施設" />

                {selectedProperty ? (
                  <>
                    <p className="mt-3 rounded-[8px] bg-black/[0.04] px-3 py-2 text-[11.5px] leading-relaxed text-black/55">
                      「{selectedProperty.propertyName}」の周辺施設を表示中
                    </p>
                    <div className="mt-3 space-y-2">
                      {selectedProperty.facilities.length ? (
                        selectedProperty.facilities.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => flyToFacility(f)}
                            className="group flex w-full items-center gap-3 overflow-hidden rounded-[10px] border border-black/[0.07] bg-white text-left transition-colors hover:border-black/25"
                          >
                            {f.imageUrl ? (
                              <div className="relative h-14 w-[76px] shrink-0">
                                <Image
                                  src={f.imageUrl}
                                  alt={f.name}
                                  fill
                                  className="object-cover"
                                  sizes="76px"
                                />
                              </div>
                            ) : (
                              <div className="flex h-14 w-[76px] shrink-0 items-center justify-center bg-black/[0.04] text-black/30">
                                <MapPin size={16} strokeWidth={1.5} />
                              </div>
                            )}
                            <span className="flex-1 pr-3 text-[12.5px] leading-snug text-black/75 group-hover:text-black">
                              {f.name}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="text-[12px] text-black/45">周辺施設の登録がありません</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {facilityTypes.map((ft) => {
                      const active = facilityFilter === ft.slug
                      return (
                        <button
                          key={ft.id}
                          type="button"
                          onClick={() => setFacilityFilter(active ? null : ft.slug)}
                          className={`flex items-center gap-2 rounded-[8px] border px-3 py-2.5 text-left text-[11.5px] leading-tight transition-colors ${
                            active
                              ? "border-black bg-black text-white"
                              : "border-black/[0.1] bg-white text-black/65 hover:border-black/35 hover:text-black"
                          }`}
                        >
                          <span className={active ? "text-white" : "text-black/45"}>
                            <FacilityCategoryIcon slug={ft.slug} size={16} />
                          </span>
                          {ft.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 開閉タブ */}
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        animate={{ x: open ? 320 + 20 + 8 : 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-[108px] z-[60] flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/95 text-black/60 shadow-lg ring-1 ring-black/5 backdrop-blur-md transition-colors hover:text-black"
        aria-label={open ? "パネルを閉じる" : "パネルを開く"}
      >
        <motion.span animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronLeft size={18} strokeWidth={1.5} />
        </motion.span>
      </motion.button>
    </>
  )
}
