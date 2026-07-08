import L from "leaflet"

export const HospitalIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/hospital.png",
  iconRetinaUrl: "/map-icons/hospital.png",
  iconSize: new L.Point(25, 25),
}) : null
