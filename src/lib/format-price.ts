/** 万円単位の価格を表示用文字列に（10000万円以上は億表記） */
export function formatPropertyPrice(price: number | null): string {
  if (!price) return "価格応談"
  if (price >= 10000) {
    const oku = Math.floor(price / 10000)
    const man = price % 10000
    return man > 0 ? `${oku}億${man.toLocaleString()}万円` : `${oku}億円`
  }
  return `${price.toLocaleString()}万円`
}
