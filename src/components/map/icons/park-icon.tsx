import L from "leaflet"

export const ParkIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/forest.png",
  iconRetinaUrl: "/map-icons/forest.png",
  iconSize: new L.Point(25, 25),
}) : null
