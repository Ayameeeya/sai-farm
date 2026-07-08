import L from "leaflet"

export const OfficeIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/office.png",
  iconRetinaUrl: "/map-icons/office.png",
  iconSize: new L.Point(25, 25),
}) : null
