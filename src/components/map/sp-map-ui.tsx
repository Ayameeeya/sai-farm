"use client"

import { MapPin, AtSign, Building2, Trees, Waves, Bus, Dumbbell, Baby, Store, Mail, Landmark, Pill, Hospital, LocateFixed } from "lucide-react"

export function FacilityCategoryIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const props = { size, strokeWidth: 1.5 }
  switch (slug) {
    case "bank-atm":
      return <AtSign {...props} />
    case "hospital-clinic":
      return <Hospital {...props} />
    case "drugstore":
      return <Pill {...props} />
    case "park":
      return <Trees {...props} />
    case "beach":
      return <Waves {...props} />
    case "station-bus-stop":
      return <Bus {...props} />
    case "onsen-spa":
      return <Dumbbell {...props} />
    case "school-preschool-daycare":
      return <Baby {...props} />
    case "supermarket-convenience-store":
      return <Store {...props} />
    case "post-office":
      return <Mail {...props} />
    case "government-office":
      return <Landmark {...props} />
    default:
      return <Building2 {...props} />
  }
}

export function CategoryBox({
  text,
  slug,
  selectedCategory,
  setSelectedCategory,
}: {
  text: string
  slug: string
  selectedCategory: string | null
  setSelectedCategory: (slug: string | null) => void
}) {
  const active = selectedCategory === slug
  return (
    <button
      type="button"
      onClick={() => setSelectedCategory(active ? null : slug)}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] transition-colors ${
        active
          ? "border-black bg-black text-white"
          : "border-black/12 bg-white text-black/65"
      }`}
    >
      <span className={active ? "text-white" : "text-black/45"}>
        <FacilityCategoryIcon slug={slug} size={15} />
      </span>
      {text}
    </button>
  )
}

export function DraggableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex touch-pan-x gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  )
}

export function AreaJumpButton({
  area,
  map,
}: {
  area: { id: string; name: string; lat: number | null; lng: number | null }
  map: import("leaflet").Map | null
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (map && area.lat && area.lng) map.flyTo([area.lat, area.lng], 14)
      }}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/12 bg-white px-3.5 py-2 text-[12px] text-black/70"
    >
      <MapPin size={13} strokeWidth={1.5} className="text-black/40" />
      {area.name}
    </button>
  )
}

export function CurrentLocationButton({ map }: { map: import("leaflet").Map | null }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!map) return
        map.locate().on("locationfound", (ev) => map.flyTo(ev.latlng, 16))
      }}
      className="absolute bottom-8 right-4 z-[20] flex h-12 w-12 items-center justify-center rounded-full bg-[#141311] text-white shadow-[0_14px_36px_-8px_rgba(13,12,10,0.55)]"
      aria-label="現在位置を表示"
    >
      <LocateFixed size={19} strokeWidth={1.5} />
    </button>
  )
}
