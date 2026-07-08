import L from "leaflet"
import {
  LOCATION_PIN_HEIGHT,
  LOCATION_PIN_WIDTH,
  PROPERTY_PIN_TOTAL_HEIGHT,
  locationPinSvg,
} from "./location-pin-shape"

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

type LocationPinOptions = {
  badge?: string
  selected?: boolean
}

/** モノトーン涙型ロケーションピン（バッジ任意） */
export function createLocationPin({ badge, selected = false }: LocationPinOptions = {}): L.DivIcon {
  const hasBadge = Boolean(badge)
  const height = hasBadge ? PROPERTY_PIN_TOTAL_HEIGHT : LOCATION_PIN_HEIGHT
  const anchor: [number, number] = [LOCATION_PIN_WIDTH / 2, height]
  const badgeHtml = hasBadge
    ? `<span class="map-location-pin__badge">${badge}</span>`
    : ""

  return L.divIcon({
    className: "map-location-pin-anchor",
    html: `<span class="map-location-pin ${hasBadge ? "map-location-pin--property" : "map-location-pin--solo"}${selected ? " is-selected" : ""}" aria-hidden="true">${badgeHtml}${locationPinSvg()}</span>`,
    iconSize: [LOCATION_PIN_WIDTH, height],
    iconAnchor: anchor,
    popupAnchor: [0, -height - 4],
  })
}

export { escapeHtml }
