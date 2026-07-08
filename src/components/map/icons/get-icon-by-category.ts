import type { DivIcon } from "leaflet"
import { createFacilityPin } from "./facility-pin"

export function getIconByCategory(slug: string): DivIcon {
  return createFacilityPin(slug)
}
