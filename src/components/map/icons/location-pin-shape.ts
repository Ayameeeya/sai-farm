/** モノトーン涙型ロケーションピンの SVG パス（viewBox 0 0 28 40） */
export const LOCATION_PIN_PATH =
  "M14 0C6.268 0 0 6.268 0 14c0 9.8 14 26 14 26s14-16.2 14-26C28 6.268 21.732 0 14 0z"

export const LOCATION_PIN_VIEWBOX = "0 0 28 40"
export const LOCATION_PIN_WIDTH = 28
export const LOCATION_PIN_HEIGHT = 40
export const PROPERTY_BADGE_HEIGHT = 14
export const PROPERTY_PIN_TOTAL_HEIGHT = LOCATION_PIN_HEIGHT + PROPERTY_BADGE_HEIGHT
export const LOCATION_PIN_ANCHOR: [number, number] = [14, PROPERTY_PIN_TOTAL_HEIGHT]

export function locationPinSvg(): string {
  return `<svg class="map-location-pin__svg" viewBox="${LOCATION_PIN_VIEWBOX}" aria-hidden="true"><path class="map-location-pin__body" d="${LOCATION_PIN_PATH}"/><circle class="map-location-pin__hole" cx="14" cy="14" r="6.5"/></svg>`
}
