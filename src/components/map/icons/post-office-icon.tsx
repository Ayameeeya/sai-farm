import L from "leaflet"

export const PostOfficeIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/post-office.png",
  iconRetinaUrl: "/map-icons/post-office.png",
  iconSize: new L.Point(25, 25),
}) : null
