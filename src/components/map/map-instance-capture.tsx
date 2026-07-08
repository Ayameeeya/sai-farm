"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"
import type { Map as LeafletMap } from "leaflet"

export function MapInstanceCapture({ onMap }: { onMap: (map: LeafletMap) => void }) {
  const map = useMap()
  useEffect(() => {
    onMap(map)
  }, [map, onMap])
  return null
}
