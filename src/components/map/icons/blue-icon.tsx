import L from "leaflet"

export const BlueIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconRetinaUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: new L.Point(25, 35),
}) : null
