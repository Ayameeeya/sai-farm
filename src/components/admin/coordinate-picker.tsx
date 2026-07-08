"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet"
import { LoaderCircle, Search } from "lucide-react"
import "leaflet/dist/leaflet.css"
import "@/styles/map.css"

import { MapInstanceCapture } from "@/components/map/map-instance-capture"
import { createLocationPin } from "@/components/map/icons/location-pin"
import { geocodeAddress } from "@/app/admin/actions"

/** 南伊豆周辺のデフォルト中心 */
const DEFAULT_CENTER: [number, number] = [34.6944445, 138.7469657]
const DEFAULT_ZOOM = 13
const PIN_ZOOM = 16

function ClickToPlace({ onPlace }: { onPlace: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => onPlace(e.latlng.lat, e.latlng.lng),
  })
  return null
}

type Props = {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
  /** 施設管理など、住所フィールドを持たないフォーム向けの内蔵検索 */
  showAddressSearch?: boolean
}

export function CoordinatePicker({ lat, lng, onChange, showAddressSearch = false }: Props) {
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [address, setAddress] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const markerRef = useRef<LeafletMarker | null>(null)
  // 自分（ドラッグ/クリック）で更新した座標。外部変更との区別に使う
  const lastEmitted = useRef<{ lat: number; lng: number } | null>(null)

  const hasPin = lat != null && lng != null

  const emit = (nextLat: number, nextLng: number) => {
    const rounded = {
      lat: Number(nextLat.toFixed(7)),
      lng: Number(nextLng.toFixed(7)),
    }
    lastEmitted.current = rounded
    onChange(rounded.lat, rounded.lng)
  }

  // 外部（住所検索ボタン・数値入力）から座標が変わったら地図を追従させる
  useEffect(() => {
    if (!map || lat == null || lng == null) return
    const self = lastEmitted.current
    if (self && Math.abs(self.lat - lat) < 1e-9 && Math.abs(self.lng - lng) < 1e-9) return
    map.setView([lat, lng], Math.max(map.getZoom(), PIN_ZOOM))
  }, [map, lat, lng])

  const onSearch = async () => {
    if (!address.trim()) {
      setSearchError("住所を入力してください。")
      return
    }
    setSearchError(null)
    setSearching(true)
    const result = await geocodeAddress(address.trim())
    setSearching(false)
    if ("error" in result && result.error) {
      setSearchError(result.error)
      return
    }
    if ("lat" in result && result.lat != null && result.lng != null) {
      lastEmitted.current = null // 外部変更として地図を追従させる
      onChange(result.lat, result.lng)
    }
  }

  return (
    <div className="space-y-3">
      {showAddressSearch && (
        <div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  onSearch()
                }
              }}
              placeholder="住所を入力してピンを配置（例: 静岡県賀茂郡南伊豆町…）"
              className="w-full flex-1 rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"
            />
            <button
              type="button"
              onClick={onSearch}
              disabled={searching}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[6px] border border-black/15 px-4 py-2 text-[12px] text-black/70 transition-colors hover:border-black/40 hover:text-black disabled:opacity-50"
            >
              {searching ? (
                <LoaderCircle size={13} className="animate-spin" />
              ) : (
                <Search size={13} strokeWidth={1.5} />
              )}
              住所から検索
            </button>
          </div>
          {searchError && <p className="mt-1.5 text-[12px] text-[#c0392b]">{searchError}</p>}
        </div>
      )}

      <div className="relative z-0 h-[320px] overflow-hidden rounded-[8px] ring-1 ring-black/10">
        <MapContainer
          center={hasPin ? [lat, lng] : DEFAULT_CENTER}
          zoom={hasPin ? PIN_ZOOM : DEFAULT_ZOOM}
          style={{ height: "100%" }}
        >
          <MapInstanceCapture onMap={setMap} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ClickToPlace onPlace={emit} />
          {hasPin && (
            <Marker
              position={[lat, lng]}
              icon={createLocationPin({ selected: true })}
              draggable
              ref={markerRef}
              eventHandlers={{
                dragend: () => {
                  const pos = markerRef.current?.getLatLng()
                  if (pos) emit(pos.lat, pos.lng)
                },
              }}
            />
          )}
        </MapContainer>
        {!hasPin && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[1000] flex justify-center">
            <span className="rounded-full bg-[#141311]/80 px-4 py-1.5 text-[11.5px] text-white backdrop-blur-sm">
              {showAddressSearch
                ? "住所検索または地図クリックでピンを配置"
                : "住所から座標を取得するか、地図をクリックしてピンを配置"}
            </span>
          </div>
        )}
      </div>
      <p className="text-[11.5px] text-black/45">
        ピンはドラッグで微調整できます。地図クリックでも配置し直せます。
      </p>
    </div>
  )
}
