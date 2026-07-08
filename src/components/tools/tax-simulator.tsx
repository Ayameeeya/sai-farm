"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info } from "lucide-react"
import { STICKY_TOP } from "@/components/top/top-page-nav"
import { LetterSwapButton } from "@/components/ui/letter-swap-button"

type OwnershipPeriod = "short" | "long" | "extraLong"

const PERIOD_OPTIONS: { value: OwnershipPeriod; label: string; note: string }[] = [
  { value: "short", label: "5年以下", note: "短期譲渡" },
  { value: "long", label: "5年超", note: "長期譲渡" },
  { value: "extraLong", label: "10年超", note: "軽減税率" },
]

// 譲渡所得税率（所得税 / 復興特別所得税 / 住民税）
const TAX_RATES: Record<
  OwnershipPeriod,
  { incomeTax: number; specialTax: number; residentTax: number }
> = {
  short: { incomeTax: 0.3, specialTax: 0.0063, residentTax: 0.09 },
  long: { incomeTax: 0.15, specialTax: 0.00315, residentTax: 0.05 },
  extraLong: { incomeTax: 0.1, specialTax: 0.0021, residentTax: 0.04 },
}

const MYHOME_DEDUCTION = 3000 // 万円
// 10年超軽減税率が適用される課税譲渡所得の上限（超過分は長期税率）
const EXTRA_LONG_CAP = 6000 // 万円

function formatMan(value: number): string {
  return value.toLocaleString("ja-JP", { maximumFractionDigits: 1 })
}

function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[12px] tracking-[0.14em] text-black/50">
        {label}
      </label>
      <div className="mt-2.5 flex items-baseline gap-3 border-b border-black/20 transition-colors duration-300 focus-within:border-black">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={value}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d]/g, "")
            onChange(raw ? Number(raw).toLocaleString("ja-JP") : "")
          }}
          className="w-full bg-transparent pb-2.5 text-right text-[18px] tabular-nums text-black outline-none placeholder:text-black/25"
          style={{ fontFamily: "var(--font-barlow)" }}
        />
        <span className="shrink-0 pb-2.5 text-[12px] text-black/45">万円</span>
      </div>
      {hint && <p className="mt-1.5 text-[11px] leading-relaxed text-black/40">{hint}</p>}
    </div>
  )
}

function ResultRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3.5">
      <span className="text-[12px] tracking-[0.08em] text-white/55">{label}</span>
      <span
        className="text-[16px] tabular-nums text-white/90"
        style={{ fontFamily: "var(--font-barlow)" }}
      >
        {formatMan(amount)}
        <span className="ml-1 text-[11px] text-white/50">万円</span>
      </span>
    </div>
  )
}

export function TaxSimulator() {
  const [salesPrice, setSalesPrice] = useState("")
  const [salesCost, setSalesCost] = useState("")
  const [buyingPrice, setBuyingPrice] = useState("")
  const [buyingCost, setBuyingCost] = useState("")
  const [period, setPeriod] = useState<OwnershipPeriod>("long")
  const [isMyHome, setIsMyHome] = useState(true)

  const toNumber = (v: string) => Number(v.replace(/,/g, "")) || 0

  // 10年超軽減税率はマイホームのみ適用可
  const effectivePeriod: OwnershipPeriod =
    period === "extraLong" && !isMyHome ? "long" : period

  const result = useMemo(() => {
    const deduction = isMyHome ? MYHOME_DEDUCTION : 0

    const rawProfit =
      toNumber(salesPrice) - toNumber(salesCost) - toNumber(buyingPrice) - toNumber(buyingCost)
    const taxable = Math.max(0, rawProfit - deduction)

    let incomeTax: number
    let specialTax: number
    let residentTax: number

    if (effectivePeriod === "extraLong") {
      // 6,000万円以下の部分は軽減税率、超過分は長期税率
      const reduced = Math.min(taxable, EXTRA_LONG_CAP)
      const excess = Math.max(0, taxable - EXTRA_LONG_CAP)
      const r = TAX_RATES.extraLong
      const l = TAX_RATES.long
      incomeTax = reduced * r.incomeTax + excess * l.incomeTax
      specialTax = reduced * r.specialTax + excess * l.specialTax
      residentTax = reduced * r.residentTax + excess * l.residentTax
    } else {
      const rates = TAX_RATES[effectivePeriod]
      incomeTax = taxable * rates.incomeTax
      specialTax = taxable * rates.specialTax
      residentTax = taxable * rates.residentTax
    }

    return {
      rawProfit,
      taxable,
      incomeTax,
      specialTax,
      residentTax,
      total: incomeTax + specialTax + residentTax,
      hasInput: toNumber(salesPrice) > 0,
      exceedsCap: effectivePeriod === "extraLong" && taxable > EXTRA_LONG_CAP,
    }
  }, [salesPrice, salesCost, buyingPrice, buyingCost, effectivePeriod, isMyHome])

  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-24 pt-12 lg:px-12 lg:pb-32 lg:pt-16">
      <div className="grid gap-14 lg:grid-cols-[1fr_420px] lg:gap-20">
        {/* ── 入力フォーム ── */}
        <div className="space-y-10">
          <div className="space-y-8">
            <p
              className="text-black/45"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                letterSpacing: "0.3em",
              }}
            >
              01 — 売却について
            </p>
            <NumberField
              id="sales-price"
              label="譲渡価格（売却額）"
              value={salesPrice}
              onChange={setSalesPrice}
            />
            <NumberField
              id="sales-cost"
              label="譲渡時にかかった諸経費"
              hint="仲介手数料・印紙税・測量費など"
              value={salesCost}
              onChange={setSalesCost}
            />
          </div>

          <div className="space-y-8 border-t border-black/8 pt-10">
            <p
              className="text-black/45"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                letterSpacing: "0.3em",
              }}
            >
              02 — 取得について
            </p>
            <NumberField
              id="buying-price"
              label="取得価格（購入時の価格）"
              hint="不明な場合は譲渡価格の5%で概算されます（本ツールでは入力値をそのまま使用）"
              value={buyingPrice}
              onChange={setBuyingPrice}
            />
            <NumberField
              id="buying-cost"
              label="取得時にかかった諸経費"
              hint="仲介手数料・登記費用・不動産取得税など"
              value={buyingCost}
              onChange={setBuyingCost}
            />
          </div>

          <div className="space-y-8 border-t border-black/8 pt-10">
            <p
              className="text-black/45"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                letterSpacing: "0.3em",
              }}
            >
              03 — 条件
            </p>

            <div>
              <p className="text-[12px] tracking-[0.14em] text-black/50">
                譲渡した年の1月1日時点での所有期間
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {PERIOD_OPTIONS.map((opt) => {
                  const disabled = opt.value === "extraLong" && !isMyHome
                  const active = period === opt.value && !disabled
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => setPeriod(opt.value)}
                      className={`rounded-[8px] border px-3 py-3.5 text-center transition-colors duration-300 ${
                        active
                          ? "border-black bg-black text-white"
                          : disabled
                            ? "cursor-not-allowed border-black/8 bg-black/[0.03] text-black/25"
                            : "border-black/15 bg-white text-black/60 hover:border-black/40"
                      }`}
                    >
                      <span className="block text-[13px] font-medium">{opt.label}</span>
                      <span
                        className={`mt-0.5 block text-[10px] tracking-[0.12em] ${
                          active ? "text-white/60" : disabled ? "text-black/20" : "text-black/35"
                        }`}
                      >
                        {opt.note}
                      </span>
                    </button>
                  )
                })}
              </div>
              {!isMyHome && (
                <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-black/45">
                  <Info size={12} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                  10年超の軽減税率はマイホーム（居住用財産）のみ適用されます。マイホーム以外は5年超と同じ長期税率で計算します。
                </p>
              )}
            </div>

            <div>
              <p className="text-[12px] tracking-[0.14em] text-black/50">マイホーム（居住用財産）ですか？</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { value: true, label: "マイホームです" },
                  { value: false, label: "マイホームではない" },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setIsMyHome(opt.value)}
                    className={`rounded-[8px] border px-3 py-3.5 text-[13px] font-medium transition-colors duration-300 ${
                      isMyHome === opt.value
                        ? "border-black bg-black text-white"
                        : "border-black/15 bg-white text-black/60 hover:border-black/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {isMyHome && (
                <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-black/45">
                  <Info size={12} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                  居住用財産の3,000万円特別控除を適用して計算します。
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── 結果パネル ── */}
        <div>
          <div className="lg:sticky" style={{ top: STICKY_TOP + 16 }}>
            <div className="overflow-hidden rounded-[14px] bg-[#0a0a0a] px-7 py-8 text-white lg:px-9 lg:py-10">
              <p
                className="text-white/40"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "12px",
                  letterSpacing: "0.35em",
                }}
              >
                ESTIMATED TAX
              </p>

              <div className="mt-5 flex items-baseline gap-2">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={Math.round(result.total * 10)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="text-[clamp(40px,4.5vw,56px)] font-light leading-none tabular-nums"
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    {formatMan(result.total)}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[14px] text-white/50">万円</span>
              </div>
              <p className="mt-2 text-[11px] tracking-[0.08em] text-white/40">
                税金総額（所得税 + 復興特別所得税 + 住民税）
              </p>

              <div className="mt-8">
                <ResultRow label="所得税" amount={result.incomeTax} />
                <ResultRow label="復興特別所得税" amount={result.specialTax} />
                <ResultRow label="住民税" amount={result.residentTax} />
                <div className="flex items-baseline justify-between gap-4 py-3.5">
                  <span className="text-[12px] tracking-[0.08em] text-white/55">課税譲渡所得</span>
                  <span
                    className="text-[16px] tabular-nums text-white/90"
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    {formatMan(result.taxable)}
                    <span className="ml-1 text-[11px] text-white/50">万円</span>
                  </span>
                </div>
              </div>

              {result.hasInput && result.taxable === 0 && (
                <div className="mt-4 rounded-[8px] bg-white/8 px-4 py-3.5 text-[12px] leading-relaxed text-white/75">
                  課税譲渡所得が0円のため、税金の支払いは発生しません。
                </div>
              )}
              {result.exceedsCap && (
                <div className="mt-4 rounded-[8px] bg-white/8 px-4 py-3.5 text-[12px] leading-relaxed text-white/75">
                  課税譲渡所得のうち6,000万円までは軽減税率（14.21%）、超過分は長期税率（20.315%）で計算しています。
                </div>
              )}
            </div>

            <div className="mt-6 rounded-[14px] border border-black/10 bg-[#faf9f7] px-6 py-6">
              <p className="text-[12px] font-medium tracking-[0.08em] text-black/70">
                売却をご検討中の方へ
              </p>
              <p className="mt-2 text-[12px] leading-[1.9] text-black/50">
                実際の税額は取得費の確認や各種特例の適用可否により変わります。南伊豆エリアの不動産売却は、地域の相場を熟知した私たちにご相談ください。
              </p>
              <LetterSwapButton
                href="/sales/"
                label="売却の相談をする"
                variant="dark"
                className="mt-5 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-black/8 pt-8 lg:mt-24">
        <p className="text-[11px] leading-[2] text-black/40">
          ※ 本シミュレーターの計算結果は概算です。建物の減価償却費相当額の控除、概算取得費（譲渡価額の5%）、買換え特例などその他の特例は考慮していません。実際の税額については税務署または税理士にご確認ください。
        </p>
      </div>
    </div>
  )
}
