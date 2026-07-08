"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, Trash2, X } from "lucide-react"
import type { MapProperty } from "@/types/map"

type FavoritesStore = { properties: string[] }

export function readFavorites(): string[] {
  try {
    const json = localStorage.getItem("favorites")
    if (!json) return []
    return (JSON.parse(json) as FavoritesStore).properties ?? []
  } catch {
    return []
  }
}

export function writeFavorites(ids: string[]) {
  localStorage.setItem("favorites", JSON.stringify({ properties: ids }))
}

export function FavoritesModal({
  properties,
  propertyId,
  compact = false,
}: {
  properties: MapProperty[]
  /** 指定時: この物件のお気に入りトグルを一緒に表示 */
  propertyId?: string
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    setFavoriteIds(readFavorites())
  }, [propertyId])

  const isFavorited = propertyId ? favoriteIds.includes(propertyId) : false

  const toggleFavorite = () => {
    if (!propertyId) return
    const next = isFavorited
      ? favoriteIds.filter((id) => id !== propertyId)
      : [...favoriteIds, propertyId]
    writeFavorites(next)
    setFavoriteIds(next)
  }

  const removeProperty = (id: string) => {
    const next = favoriteIds.filter((pid) => pid !== id)
    writeFavorites(next)
    setFavoriteIds(next)
  }

  const favorites = properties.filter((p) => favoriteIds.includes(p.id))

  return (
    <>
      <div className={compact ? "" : "flex items-center gap-2.5"}>
        {propertyId && (
          <button
            type="button"
            onClick={toggleFavorite}
            className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[6px] border transition-colors ${
              isFavorited
                ? "border-[#b3543f] bg-[#b3543f]/[0.08] text-[#b3543f]"
                : "border-black/15 text-black/45 hover:border-black/40 hover:text-black"
            }`}
            aria-label={isFavorited ? "お気に入りから外す" : "お気に入りに追加"}
          >
            <Heart size={16} strokeWidth={1.5} fill={isFavorited ? "currentColor" : "none"} />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setFavoriteIds(readFavorites())
            setOpen(true)
          }}
          className={
            compact
              ? "flex items-center gap-1.5 rounded-full border border-black/12 bg-white px-3.5 py-2 text-[12px] text-black/70"
              : "flex h-[42px] flex-1 items-center justify-center gap-2 rounded-[6px] border border-black/15 px-4 text-[12.5px] tracking-[0.08em] text-black/70 transition-colors hover:border-black/40 hover:text-black"
          }
        >
          <Heart size={compact ? 13 : 14} strokeWidth={1.5} className="text-black/40" />
          お気に入り
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0c0a]/55 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-h-[min(680px,86vh)] w-full max-w-lg flex-col overflow-hidden rounded-[14px] bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-black/[0.07] px-6 py-4">
                <div>
                  <p
                    className="text-[10px] tracking-[0.4em] text-black/40 uppercase"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Favorites
                  </p>
                  <h3 className="mt-1 font-serif text-[17px] font-light">お気に入り物件</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] text-black/55 transition-colors hover:bg-black/10 hover:text-black"
                  aria-label="閉じる"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              </div>

              <div className="map-scrollbar flex-1 space-y-3 overflow-y-auto p-5">
                {favorites.length ? (
                  favorites.map((pr) => (
                    <div
                      key={pr.id}
                      className="flex gap-3 overflow-hidden rounded-[10px] border border-black/[0.07] bg-white"
                    >
                      {pr.images[0] ? (
                        <Link
                          href={`/properties/${pr.slug}/`}
                          className="relative h-[92px] w-[124px] shrink-0"
                        >
                          <Image
                            src={pr.images[0]}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="124px"
                          />
                        </Link>
                      ) : (
                        <div className="h-[92px] w-[124px] shrink-0 bg-black/[0.05]" />
                      )}
                      <div className="flex min-w-0 flex-1 flex-col justify-center py-2 pr-3">
                        <Link
                          href={`/properties/${pr.slug}/`}
                          className="truncate text-[13px] text-black/80 hover:text-black"
                        >
                          {pr.propertyName}
                        </Link>
                        <p className="mt-0.5 truncate text-[11px] text-black/45">{pr.address}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <p style={{ fontFamily: "var(--font-barlow)" }}>
                            <span className="text-[17px] font-medium tabular-nums text-black">
                              {pr.price ?? "—"}
                            </span>
                            <span className="ml-0.5 text-[11px] text-black/50">万円</span>
                          </p>
                          <button
                            type="button"
                            onClick={() => removeProperty(pr.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-black/35 transition-colors hover:bg-black/[0.06] hover:text-[#b3543f]"
                            aria-label="お気に入りから削除"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-14 text-center text-[13px] text-black/45">
                    お気に入り物件はまだありません
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
