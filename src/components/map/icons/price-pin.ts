import type { MapProperty } from "@/types/map"
import { createLocationPin, escapeHtml } from "./location-pin"

/** 価格入りの物件ピン — モノトーン涙型ロケーションピン */
export function createPricePin(property: MapProperty, selected: boolean) {
  const badge = property.price
    ? `${property.price}<span class="map-location-pin__unit">万円</span>`
    : escapeHtml(property.categoryName || "物件")

  return createLocationPin({ badge, selected })
}
