import L from "leaflet"

export const SchoolIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/school.png",
  iconRetinaUrl: "/map-icons/school.png",
  iconSize: new L.Point(25, 25),
}) : null
