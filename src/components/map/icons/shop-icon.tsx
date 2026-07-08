import L from "leaflet"

export const ShopIcon: L.Icon | null = typeof window !== "undefined" ? L.icon({
  iconUrl: "/map-icons/shop.png",
  iconRetinaUrl: "/map-icons/shop.png",
  iconSize: new L.Point(25, 25),
}) : null
