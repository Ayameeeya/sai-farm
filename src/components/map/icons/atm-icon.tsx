import L from "leaflet"

export const AtmIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/atm.png",
  iconRetinaUrl: "/map-icons/atm.png",
  iconSize: new L.Point(25, 25),
}) : null
