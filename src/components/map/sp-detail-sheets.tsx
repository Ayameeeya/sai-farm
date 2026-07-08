"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, useMotionValue } from "framer-motion"
import { X, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import type { MapProperty, MapFacility } from "@/types/map"
import { DraggableContainer } from "@/components/map/sp-map-ui"

function SheetGrip() {
  return (
    <div className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-black/15" />
  )
}

export function PropertyDetailSheet({ property }: { property: MapProperty }) {
  const router = useRouter()
  const y = useMotionValue(0)
  const [onTop, setOnTop] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const json = localStorage.getItem("favorites")
    if (json) {
      const fav = JSON.parse(json) as { properties: string[] }
      setIsFavorited(fav.properties.includes(property.id))
    }
  }, [property.id])

  useEffect(() => {
    const unsubscribe = y.on("change", (latestY) => {
      setOnTop(latestY === -780)
    })
    return unsubscribe
  }, [y])

  const addFavorite = () => {
    const json = localStorage.getItem("favorites")
    const fav = json ? (JSON.parse(json) as { properties: string[] }) : { properties: [] as string[] }
    if (!fav.properties.includes(property.id)) {
      fav.properties.push(property.id)
      localStorage.setItem("favorites", JSON.stringify(fav))
      setIsFavorited(true)
    }
  }

  return (
    <motion.div
      drag={onTop ? false : "y"}
      dragConstraints={{ bottom: -780, top: 0 }}
      dragElastic={1}
      style={{ y }}
      className="absolute bottom-[-780px] z-[40] flex h-screen w-full flex-col gap-4 rounded-t-[16px] bg-white p-5 pt-9 shadow-[0_-18px_60px_-18px_rgba(13,12,10,0.4)]"
    >
      <SheetGrip />
      {onTop && (
        <button
          type="button"
          onClick={() => y.set(0)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] text-black/55"
          aria-label="閉じる"
        >
          <X size={15} strokeWidth={1.5} />
        </button>
      )}
      <button
        type="button"
        onClick={addFavorite}
        disabled={isFavorited}
        className={`absolute right-5 top-9 ${isFavorited ? "text-[#b3543f]" : "text-black/40"}`}
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
    </motion.div>
  )
}

export function FacilityDetailSheet({ facility }: { facility: MapFacility }) {
  const y = useMotionValue(0)
  const [onTop, setOnTop] = useState(false)

  useEffect(() => {
    const unsubscribe = y.on("change", (latestY) => {
      setOnTop(latestY === -780)
    })
    return unsubscribe
  }, [y])

  return (
    <motion.div
      drag={onTop ? false : "y"}
      dragConstraints={{ bottom: -780, top: 0 }}
      dragElastic={1}
      style={{ y }}
      className="absolute bottom-[-780px] z-[40] flex h-screen w-full flex-col gap-4 rounded-t-[16px] bg-white p-5 pt-9 shadow-[0_-18px_60px_-18px_rgba(13,12,10,0.4)]"
    >
      <SheetGrip />
      {onTop && (
        <button
          type="button"
          onClick={() => y.set(0)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] text-black/55"
          aria-label="閉じる"
        >
          <X size={15} strokeWidth={1.5} />
        </button>
      )}
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
    </motion.div>
  )
}
