import L from "leaflet"

export const RedIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/location.png",
  iconRetinaUrl: "/map-icons/location.png",
  iconSize: new L.Point(40, 40),
}) : null
