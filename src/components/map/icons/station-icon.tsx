import L from "leaflet"

export const StationIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/metro-station.png",
  iconRetinaUrl: "/map-icons/metro-station.png",
  iconSize: new L.Point(25, 25),
}) : null
