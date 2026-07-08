import L from "leaflet"

export const SpaIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/garden.png",
  iconRetinaUrl: "/map-icons/garden.png",
  iconSize: new L.Point(25, 25),
}) : null
