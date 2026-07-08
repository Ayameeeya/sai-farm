"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { X, MapPin, TramFront } from "lucide-react"
import { LetterSwapButton } from "@/components/ui/letter-swap-button"
import { FavoritesModal } from "@/components/map/favorites-modal"
import type { MapProperty } from "@/types/map"

function SpecRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-black/[0.07] py-2.5">
      <span className="shrink-0 text-[11px] tracking-[0.15em] text-black/45">{label}</span>
      <span className="text-right text-[13px] text-black/80">{value || "—"}</span>
    </div>
  )
}

export function PropertyPane({
  property,
  properties,
  setSelectedProperty,
}: {
  property: MapProperty
  properties: MapProperty[]
  setSelectedProperty: (id: string) => void
}) {
  const imageUrl = property.images[0]

  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-5 right-5 top-[108px] z-[70] flex w-[360px] flex-col overflow-hidden rounded-[14px] bg-white/95 shadow-[0_24px_70px_-18px_rgba(13,12,10,0.4)] ring-1 ring-black/5 backdrop-blur-md"
    >
      {/* 写真 */}
      <div className="relative h-[210px] shrink-0">
        {imageUrl ? (
          <Image src={imageUrl} alt={property.propertyName} fill className="object-cover" sizes="360px" />
        ) : (
          <div className="h-full w-full bg-black/[0.06]" />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(13,12,10,0.35) 0%, transparent 45%)" }}
        />
        <button
          type="button"
          onClick={() => setSelectedProperty("")}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#141311]/70 text-white backdrop-blur-sm transition-colors hover:bg-[#141311]"
          aria-label="閉じる"
        >
          <X size={15} strokeWidth={1.5} />
        </button>
        <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] tracking-[0.1em] text-black/75 backdrop-blur-sm">
          {property.categoryName}
        </span>
      </div>

      {/* 内容 */}
      <div className="map-scrollbar flex-1 overflow-y-auto px-6 pb-6 pt-5">
        <p
          className="text-[10px] tracking-[0.4em] text-black/40 uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Selected Property
        </p>
        <h2 className="mt-2 font-serif text-[19px] font-light leading-snug text-black">
          {property.propertyName}
        </h2>

        <p className="mt-4" style={{ fontFamily: "var(--font-barlow)" }}>
          <span className="align-baseline text-[30px] font-light leading-none tabular-nums text-black">
            {property.price ?? "—"}
          </span>
          <span className="ml-1 text-[13px] text-black/55">万円</span>
        </p>

        <div className="mt-5">
          <SpecRow label="間取り" value={property.layout} />
          <SpecRow
            label="面積"
            value={property.buildingSpaceSqm ? `${property.buildingSpaceSqm}㎡` : null}
          />
          <SpecRow label="構造" value={property.structure} />
        </div>

        <div className="mt-4 space-y-2 text-[12px] leading-relaxed text-black/60">
          {property.address && (
            <p className="flex gap-2">
              <MapPin size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-black/35" />
              {property.address}
            </p>
          )}
          {property.transportation && (
            <p className="flex gap-2">
              <TramFront size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-black/35" />
              {property.transportation}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <LetterSwapButton
            href={`/properties/${property.slug}/`}
            label="物件の詳細を見る"
            fullWidth
          />
          <FavoritesModal properties={properties} propertyId={property.id} />
        </div>
      </div>
    </motion.aside>
  )
}
