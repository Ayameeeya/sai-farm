import type { Icon } from "leaflet"
import { AtmIcon } from "./atm-icon"
import { BeachIcon } from "./beach-icon"
import { BlueIcon } from "./blue-icon"
import { HospitalIcon } from "./hospital-icon"
import { OfficeIcon } from "./office-icon"
import { ParkIcon } from "./park-icon"
import { PharmacyIcon } from "./pharmacy-icon"
import { PostOfficeIcon } from "./post-office-icon"
import { SchoolIcon } from "./school-icon"
import { ShopIcon } from "./shop-icon"
import { SpaIcon } from "./spa-icon"
import { StationIcon } from "./station-icon"

export function getIconByCategory(slug: string): Icon | null {
  switch (slug) {
    case "bank-atm":
      return AtmIcon
    case "hospital-clinic":
      return HospitalIcon
    case "drugstore":
      return PharmacyIcon
    case "park":
      return ParkIcon
    case "beach":
      return BeachIcon
    case "station-bus-stop":
      return StationIcon
    case "onsen-spa":
      return SpaIcon
    case "school-preschool-daycare":
      return SchoolIcon
    case "supermarket-convenience-store":
      return ShopIcon
    case "post-office":
      return PostOfficeIcon
    case "government-office":
      return OfficeIcon
    default:
      return BlueIcon
  }
}
