import L from "leaflet"

const ICON_ATTRS =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"'

/** カテゴリ別アイコン（Lucide 系・14px 表示） */
const CATEGORY_SVGS: Record<string, string> = {
  "bank-atm": `<svg ${ICON_ATTRS}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M12 9v6"/><path d="M9 12h6"/></svg>`,
  "hospital-clinic": `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="9"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
  drugstore: `<svg ${ICON_ATTRS}><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
  park: `<svg ${ICON_ATTRS}><path d="M12 22v-8"/><path d="M8 14l-2-6a6 6 0 0 1 12 0l-2 6"/><path d="M4 14h16"/></svg>`,
  beach: `<svg ${ICON_ATTRS}><path d="M2 18c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M12 2v4"/><path d="m8 6 4-2 4 2"/></svg>`,
  "station-bus-stop": `<svg ${ICON_ATTRS}><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M8 15h.01"/><path d="M16 15h.01"/><path d="M8 7h8"/></svg>`,
  "onsen-spa": `<svg ${ICON_ATTRS}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></svg>`,
  "school-preschool-daycare": `<svg ${ICON_ATTRS}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5"/></svg>`,
  "supermarket-convenience-store": `<svg ${ICON_ATTRS}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  "post-office": `<svg ${ICON_ATTRS}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  "government-office": `<svg ${ICON_ATTRS}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
}

const DEFAULT_SVG = `<svg ${ICON_ATTRS}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`

function svgForCategory(slug: string): string {
  return CATEGORY_SVGS[slug] ?? DEFAULT_SVG
}

/** 周辺施設ピン — 白丸＋カテゴリアイコン */
export function createFacilityPin(slug: string): L.DivIcon {
  return L.divIcon({
    className: "facility-pin-anchor",
    html: `<span class="facility-pin" aria-hidden="true"><span class="facility-pin__icon">${svgForCategory(slug)}</span></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  })
}
