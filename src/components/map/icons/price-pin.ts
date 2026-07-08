import L from "leaflet"
import type { MapProperty } from "@/types/map"

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

/** 価格入りの物件ピン (divIcon) */
export function createPricePin(property: MapProperty, selected: boolean): L.DivIcon {
  const label = property.price
    ? `${property.price}<span style="font-size:10.5px;margin-left:1px">万円</span>`
    : escapeHtml(property.categoryName || "物件")
  return L.divIcon({
    className: "price-pin-anchor",
    html: `<span class="price-pin${selected ? " is-selected" : ""}">${label}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 6],
    popupAnchor: [0, -34],
  })
}
