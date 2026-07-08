"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, type PanInfo } from "framer-motion"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import type { MapProperty, MapFacility } from "@/types/map"
import { DraggableContainer } from "@/components/map/sp-map-ui"
import { readFavorites, writeFavorites } from "@/components/map/favorites-modal"

const SHEET_SPRING = { type: "spring" as const, damping: 34, stiffness: 380 }
const CLOSE_OFFSET = 80
const CLOSE_VELOCITY = 400

function SheetGrip() {
  return (
    <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-black/15" />
  )
}

function MapBottomSheet({
  onClose,
  children,
}: {
  onClose: () => void
  children: React.ReactNode
}) {
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > CLOSE_OFFSET || info.velocity.y > CLOSE_VELOCITY) onClose()
  }

  return (
    <>
      <motion.button
        type="button"
        aria-label="閉じる"
        className="fixed inset-0 z-[35] bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.32 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-[40] flex max-h-[78dvh] flex-col rounded-t-[16px] bg-white pb-[max(env(safe-area-inset-bottom),20px)] shadow-[0_-18px_60px_-18px_rgba(13,12,10,0.4)]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "110%" }}
        transition={SHEET_SPRING}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.04, bottom: 0.6 }}
        onDragEnd={handleDragEnd}
      >
        <SheetGrip />
        <div className="map-scrollbar relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-5 pb-1 pt-4">
          {children}
        </div>
      </motion.div>
    </>
  )
}

export function PropertyDetailSheet({
  property,
  onClose,
}: {
  property: MapProperty
  onClose: () => void
}) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    setIsFavorited(readFavorites().includes(property.id))
  }, [property.id])

  const addFavorite = () => {
    const ids = readFavorites()
    if (!ids.includes(property.id)) {
      writeFavorites([...ids, property.id])
      setIsFavorited(true)
    }
  }

  return (
    <MapBottomSheet onClose={onClose}>
      <button
        type="button"
        onClick={addFavorite}
        disabled={isFavorited}
        className={`absolute right-5 top-4 z-10 ${isFavorited ? "text-[#b3543f]" : "text-black/40"}`}
        aria-label="お気に入りに追加"
      >
        <Heart size={22} strokeWidth={1.5} fill={isFavorited ? "currentColor" : "none"} />
      </button>

      <div className="pr-12">
        <p
          className="text-[10px] tracking-[0.35em] text-black/40 uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Property
        </p>
        <h2 className="mt-1 font-serif text-[17px] font-light leading-snug text-black">
          {property.propertyName}
        </h2>
        <p className="mt-1 text-[11.5px] text-black/50">{property.address}</p>
        <p className="mt-2" style={{ fontFamily: "var(--font-barlow)" }}>
          <span className="text-[26px] font-light leading-none tabular-nums text-black">
            {property.price ?? "—"}
          </span>
          <span className="ml-1 text-[12px] text-black/55">万円</span>
        </p>
      </div>

      <DraggableContainer>
        {property.images.map((url, i) => (
          <div key={i} className="relative h-44 w-44 shrink-0 overflow-hidden rounded-[10px]">
            <Image src={url} alt="" fill className="object-cover" sizes="176px" />
          </div>
        ))}
      </DraggableContainer>

      <button
        type="button"
        onClick={() => router.push(`/properties/${property.slug}/`)}
        className="mx-auto w-full max-w-xs rounded-[6px] bg-[#141311] py-3.5 text-[13px] tracking-[0.1em] text-white"
      >
        物件の詳細を見る
      </button>
    </MapBottomSheet>
  )
}

export function FacilityDetailSheet({
  facility,
  onClose,
}: {
  facility: MapFacility
  onClose: () => void
}) {
  return (
    <MapBottomSheet onClose={onClose}>
      <div>
        <p
          className="text-[10px] tracking-[0.35em] text-black/40 uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Facility
        </p>
        <h2 className="mt-1 font-serif text-[17px] font-light leading-snug text-black">
          {facility.name}
        </h2>
        {facility.description && (
          <p className="mt-2 text-[12px] leading-relaxed text-black/60">{facility.description}</p>
        )}
      </div>
      {facility.imageUrl && (
        <DraggableContainer>
          <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-[10px]">
            <Image src={facility.imageUrl} alt="" fill className="object-cover" sizes="176px" />
          </div>
        </DraggableContainer>
      )}
    </MapBottomSheet>
  )
}
