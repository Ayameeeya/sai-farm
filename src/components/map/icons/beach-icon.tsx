import L from "leaflet"

export const BeachIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/resort.png",
  iconRetinaUrl: "/map-icons/resort.png",
  iconSize: new L.Point(25, 25),
}) : null
