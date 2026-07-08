"use client"

import { useState } from "react"
import { Minus, Plus, LocateFixed } from "lucide-react"
import type { Map as LeafletMap } from "leaflet"

export function MapControls({ map }: { map: LeafletMap | null }) {
  const [locating, setLocating] = useState(false)
  if (!map) return null

  return (
    <div className="absolute bottom-8 right-5 z-[60] flex flex-col gap-2">
      <div className="flex flex-col overflow-hidden rounded-[10px] bg-white/95 shadow-[0_14px_40px_-10px_rgba(13,12,10,0.35)] ring-1 ring-black/5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => map.setZoom(map.getZoom() + 1)}
          className="flex h-10 w-10 items-center justify-center text-black/60 transition-colors hover:bg-black/[0.05] hover:text-black"
          aria-label="ズームイン"
        >
          <Plus size={17} strokeWidth={1.5} />
        </button>
        <span className="mx-2 h-px bg-black/[0.08]" />
        <button
          type="button"
          onClick={() => map.setZoom(map.getZoom() - 1)}
          className="flex h-10 w-10 items-center justify-center text-black/60 transition-colors hover:bg-black/[0.05] hover:text-black"
          aria-label="ズームアウト"
        >
          <Minus size={17} strokeWidth={1.5} />
        </button>
      </div>

      <button
        type="button"
        disabled={locating}
        onClick={() => {
          setLocating(true)
          map.locate().on("locationfound", (ev) => {
            map.flyTo(ev.latlng, 16).on("moveend", () => setLocating(false))
          })
        }}
        className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#141311] text-white shadow-[0_14px_40px_-10px_rgba(13,12,10,0.5)] transition-colors hover:bg-black disabled:opacity-60"
        aria-label="現在位置を表示"
      >
        <LocateFixed size={17} strokeWidth={1.5} className={locating ? "animate-pulse" : ""} />
      </button>
    </div>
  )
}
