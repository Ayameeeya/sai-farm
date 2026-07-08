"use client"

import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { normalize } from "@geolonia/normalize-japanese-addresses"
import type { Map as LeafletMap } from "leaflet"

type FormData = { address: string }

export function MapSearchBox({ map }: { map: LeafletMap | null }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (!map || !data.address) return
    const res = await normalize(data.address)
    if (res.point?.lat && res.point?.lng) {
      map.flyTo([res.point.lat, res.point.lng], map.getZoom())
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.15 } }}
      onSubmit={handleSubmit(onSubmit)}
      className="pointer-events-auto flex h-11 w-[min(400px,38vw)] items-center overflow-hidden rounded-full bg-white/95 shadow-[0_14px_40px_-10px_rgba(13,12,10,0.35)] ring-1 ring-black/5 backdrop-blur-md"
    >
      <Search size={16} strokeWidth={1.5} className="ml-4 shrink-0 text-black/40" />
      <input
        {...register("address")}
        placeholder="住所・地名で移動"
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-[13px] text-black outline-none placeholder:text-black/35"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="m-1 flex h-9 shrink-0 items-center rounded-full bg-[#141311] px-4 text-[12px] tracking-[0.1em] text-white transition-colors hover:bg-black disabled:opacity-50"
      >
        {isSubmitting ? "…" : "検索"}
      </button>
    </motion.form>
  )
}
