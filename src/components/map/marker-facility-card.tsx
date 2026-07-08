"use client"

import Image from "next/image"
import type { MapFacility } from "@/types/map"

export function MarkerFacilityCard({ facility }: { facility: MapFacility }) {
  return (
    <div className="w-[250px] bg-white">
      {facility.imageUrl ? (
        <Image
          src={facility.imageUrl}
          alt={facility.name}
          width={250}
          height={150}
          className="h-[150px] w-[250px] object-cover"
        />
      ) : (
        <div className="h-[150px] w-[250px] bg-black/[0.06]" />
      )}
      <div className="px-4 pb-4 pt-3">
        <h3 className="text-[13px] leading-snug text-black/80">{facility.name}</h3>
        {facility.description && (
          <p className="mt-1 line-clamp-3 text-[11.5px] leading-relaxed text-black/50">
            {facility.description}
          </p>
        )}
      </div>
    </div>
  )
}
