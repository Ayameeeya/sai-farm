/** 常に黒ピル固定ナビを使うパス（土地・住まい一覧） */
export const PILL_ONLY_PATHS = [
  "/properties/property-categories/land/",
  "/properties/property-categories/house/",
] as const

export function isPillOnlyNavPath(pathname: string): boolean {
  return (PILL_ONLY_PATHS as readonly string[]).includes(pathname)
}
