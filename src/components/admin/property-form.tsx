"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  Trash2,
  MapPin,
  LoaderCircle,
  Copy,
  Check,
} from "lucide-react"
import {
  saveProperty,
  deleteProperty,
  geocodeAddress,
  type PropertyInput,
} from "@/app/admin/actions"
import { ImageUploadField } from "@/components/admin/image-upload-field"

type Option = { id: string; name: string }
type FacilityOption = { id: string; name: string; typeName: string | null }

type Props = {
  propertyId: string | null
  defaults: Partial<PropertyInput>
  categories: Option[]
  areas: Option[]
  tags: Option[]
  facilities: FacilityOption[]
}

const STATUS_OPTIONS = [
  { value: 1, label: "公開中" },
  { value: 2, label: "新着物件" },
  { value: 3, label: "価格変更" },
  { value: 7, label: "商談中" },
  { value: 8, label: "ご成約" },
  { value: 9, label: "非公開" },
]

const LABEL = "block text-[12px] tracking-[0.1em] text-black/50"
const INPUT =
  "mt-1.5 w-full rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"
const INPUT_DISABLED = `${INPUT} disabled:cursor-not-allowed disabled:border-black/5 disabled:bg-black/[0.04] disabled:text-black/30`

const cnLabel = (disabled: boolean) =>
  disabled ? `${LABEL} text-black/25` : LABEL

type FormData = Omit<PropertyInput, "images" | "tag_ids" | "facility_ids">

export function PropertyForm({
  propertyId,
  defaults,
  categories,
  areas,
  tags,
  facilities,
}: Props) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>(defaults.images ?? [])
  const [tagIds, setTagIds] = useState<string[]>(defaults.tag_ids ?? [])
  const [facilityIds, setFacilityIds] = useState<string[]>(defaults.facility_ids ?? [])
  const [facilityQuery, setFacilityQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      property_name: defaults.property_name ?? "",
      slug: defaults.slug ?? "",
      status: defaults.status ?? 1,
      price: defaults.price ?? null,
      address: defaults.address ?? "",
      property_category_id: defaults.property_category_id ?? "",
      area_id: defaults.area_id ?? "",
      layout: defaults.layout ?? "",
      land_space_sqm: defaults.land_space_sqm ?? null,
      building_space_sqm: defaults.building_space_sqm ?? null,
      bedroom: defaults.bedroom ?? null,
      bathroom: defaults.bathroom ?? null,
      transportation: defaults.transportation ?? "",
      comment: defaults.comment ?? "",
      one_point: defaults.one_point ?? "",
      lat: defaults.lat ?? null,
      lng: defaults.lng ?? null,
    },
  })

  // 土地カテゴリ選択時は建物系の項目を無効化
  const selectedCategoryId = watch("property_category_id")
  const isLand =
    categories.find((c) => c.id === selectedCategoryId)?.name.includes("土地") ?? false

  const onSubmit = async (values: FormData) => {
    setError(null)
    const numOrNull = (v: unknown) =>
      v === "" || v == null || Number.isNaN(Number(v)) ? null : Number(v)

    const result = await saveProperty(propertyId, {
      ...values,
      status: Number(values.status),
      price: numOrNull(values.price),
      land_space_sqm: numOrNull(values.land_space_sqm),
      building_space_sqm: isLand ? null : numOrNull(values.building_space_sqm),
      bedroom: isLand ? null : numOrNull(values.bedroom),
      bathroom: isLand ? null : numOrNull(values.bathroom),
      lat: numOrNull(values.lat),
      lng: numOrNull(values.lng),
      property_category_id: values.property_category_id || null,
      area_id: values.area_id || null,
      address: values.address || null,
      layout: isLand ? null : values.layout || null,
      transportation: values.transportation || null,
      comment: values.comment || null,
      one_point: values.one_point || null,
      images,
      tag_ids: tagIds,
      facility_ids: facilityIds,
    })

    if ("error" in result && result.error) {
      setError(result.error)
      return
    }
    router.push("/admin/properties")
    router.refresh()
  }

  const onDelete = async () => {
    if (!propertyId) return
    if (!window.confirm("この物件を削除しますか？この操作は取り消せません。")) return
    const result = await deleteProperty(propertyId)
    if (result.error) {
      setError(result.error)
      return
    }
    router.push("/admin/properties")
    router.refresh()
  }

  const onGeocode = async () => {
    const address = getValues("address")
    if (!address?.trim()) {
      setError("先に住所を入力してください。")
      return
    }
    setError(null)
    setGeocoding(true)
    const result = await geocodeAddress(address.trim())
    setGeocoding(false)
    if ("error" in result && result.error) {
      setError(result.error)
      return
    }
    if ("lat" in result && result.lat != null && result.lng != null) {
      setValue("lat", result.lat)
      setValue("lng", result.lng)
    }
  }

  /** Yahoo!不動産・アットホーム等への転載用テキストをクリップボードにコピー */
  const onCopyForPortal = async () => {
    const v = getValues()
    const categoryName = categories.find((c) => c.id === v.property_category_id)?.name ?? ""
    const areaName = areas.find((a) => a.id === v.area_id)?.name ?? ""
    const line = (label: string, value: unknown) =>
      value != null && String(value).trim() !== "" ? `■${label}：${value}` : null

    const text = [
      line("物件名", v.property_name),
      line("種別", categoryName),
      line("価格", v.price ? `${Number(v.price).toLocaleString()}万円` : "価格応談"),
      line("所在地", v.address),
      line("エリア", areaName),
      line("交通", v.transportation),
      line("間取り", v.layout),
      line("土地面積", v.land_space_sqm ? `${v.land_space_sqm}㎡` : null),
      line("建物面積", v.building_space_sqm ? `${v.building_space_sqm}㎡` : null),
      line("緯度経度", v.lat && v.lng ? `${v.lat}, ${v.lng}` : null),
      "",
      v.comment ? `【物件コメント】\n${v.comment}` : null,
      v.one_point ? `【アピールポイント】\n${v.one_point}` : null,
      images.length ? `【画像】${images.length}枚（管理画面からダウンロード可）` : null,
    ]
      .filter((s) => s !== null)
      .join("\n")

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e) => {
        // Enter キーでの誤送信を防ぐ（textarea 内の改行は除く）
        if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
          e.preventDefault()
        }
      }}
      className="max-w-[860px] space-y-6"
    >
      {/* 基本情報 */}
      <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <p className="mb-5 text-[13px] font-medium text-black/70">基本情報</p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className={LABEL}>物件名 *</label>
            <input className={INPUT} {...register("property_name", { required: true })} />
          </div>
          <div className="lg:col-span-2">
            <label className={LABEL}>スラッグ（URL・空欄なら自動生成）</label>
            <input className={INPUT} {...register("slug")} />
          </div>
          <div>
            <label className={LABEL}>ステータス</label>
            <select className={INPUT} {...register("status")}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>カテゴリ</label>
            <select className={INPUT} {...register("property_category_id")}>
              <option value="">未設定</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>エリア</label>
            <select className={INPUT} {...register("area_id")}>
              <option value="">未設定</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>価格（万円）</label>
            <input type="number" className={INPUT} {...register("price")} />
          </div>
          <div>
            <label className={cnLabel(isLand)}>間取り</label>
            <input className={INPUT_DISABLED} disabled={isLand} {...register("layout")} />
          </div>
          <div className="lg:col-span-2">
            <label className={LABEL}>住所</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input className={`${INPUT} flex-1`} {...register("address")} />
              <button
                type="button"
                onClick={onGeocode}
                disabled={geocoding}
                className="mt-0 inline-flex shrink-0 items-center gap-1.5 self-start whitespace-nowrap rounded-[6px] border border-black/15 px-4 py-2.5 text-[12px] text-black/70 transition-colors hover:border-black/40 hover:text-black disabled:opacity-50 sm:mt-1.5 sm:self-stretch sm:py-0"
              >
                {geocoding ? (
                  <LoaderCircle size={13} className="animate-spin" />
                ) : (
                  <MapPin size={13} strokeWidth={1.5} />
                )}
                緯度経度を取得
              </button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <label className={LABEL}>交通</label>
            <input className={INPUT} {...register("transportation")} />
          </div>
        </div>
      </section>

      {/* 面積・設備 */}
      <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <p className="mb-5 text-[13px] font-medium text-black/70">面積・設備</p>
        <div className="grid gap-4 lg:grid-cols-4">
          <div>
            <label className={LABEL}>土地面積（㎡）</label>
            <input type="number" step="0.01" className={INPUT} {...register("land_space_sqm")} />
          </div>
          <div>
            <label className={cnLabel(isLand)}>建物面積（㎡）</label>
            <input
              type="number"
              step="0.01"
              className={INPUT_DISABLED}
              disabled={isLand}
              {...register("building_space_sqm")}
            />
          </div>
          <div>
            <label className={cnLabel(isLand)}>ベッドルーム</label>
            <input type="number" className={INPUT_DISABLED} disabled={isLand} {...register("bedroom")} />
          </div>
          <div>
            <label className={cnLabel(isLand)}>バスルーム</label>
            <input type="number" className={INPUT_DISABLED} disabled={isLand} {...register("bathroom")} />
          </div>
        </div>
      </section>

      {/* 位置情報 */}
      <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <p className="mb-5 text-[13px] font-medium text-black/70">位置情報（地図表示用）</p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className={LABEL}>緯度</label>
            <input type="number" step="any" className={INPUT} {...register("lat")} />
          </div>
          <div>
            <label className={LABEL}>経度</label>
            <input type="number" step="any" className={INPUT} {...register("lng")} />
          </div>
        </div>
      </section>

      {/* 紹介文 */}
      <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <p className="mb-5 text-[13px] font-medium text-black/70">紹介文</p>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>コメント</label>
            <textarea rows={4} className={`${INPUT} resize-y`} {...register("comment")} />
          </div>
          <div>
            <label className={LABEL}>ワンポイント</label>
            <textarea rows={8} className={`${INPUT} resize-y`} {...register("one_point")} />
          </div>
        </div>
      </section>

      {/* タグ */}
      <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <p className="mb-1 text-[13px] font-medium text-black/70">タグ</p>
        <p className="mb-4 text-[11px] text-black/40">
          物件詳細ページに #タグ として表示されます。タグの追加は「タグ・カテゴリ」から。
        </p>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const selected = tagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() =>
                    setTagIds((prev) =>
                      selected ? prev.filter((id) => id !== tag.id) : [...prev, tag.id],
                    )
                  }
                  className={
                    selected
                      ? "rounded-full bg-black px-3 py-1 text-[12px] text-white"
                      : "rounded-full border border-black/15 px-3 py-1 text-[12px] text-black/55 transition-colors hover:border-black/40 hover:text-black"
                  }
                >
                  #{tag.name}
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-[12px] text-black/40">タグはまだ登録されていません</p>
        )}
      </section>

      {/* 周辺施設 */}
      <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <p className="mb-1 text-[13px] font-medium text-black/70">
          周辺施設（{facilityIds.length}件選択中）
        </p>
        <p className="mb-4 text-[11px] text-black/40">
          物件詳細ページの地図に表示されます。施設の追加・編集は「周辺施設」から。
        </p>

        {facilityIds.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {facilityIds.map((id) => {
              const f = facilities.find((x) => x.id === id)
              if (!f) return null
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFacilityIds((prev) => prev.filter((x) => x !== id))}
                  title="クリックで外す"
                  className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1 text-[12px] text-white transition-opacity hover:opacity-75"
                >
                  {f.name}
                  <span className="text-white/60">×</span>
                </button>
              )
            })}
          </div>
        )}

        <input
          value={facilityQuery}
          onChange={(e) => setFacilityQuery(e.target.value)}
          placeholder="施設名で検索して追加（例：病院、海水浴場）"
          className={INPUT}
        />
        {facilityQuery.trim() && (
          <div className="mt-2 max-h-[240px] space-y-0.5 overflow-y-auto rounded-[6px] border border-black/8 p-1.5">
            {facilities
              .filter(
                (f) =>
                  !facilityIds.includes(f.id) &&
                  (f.name.includes(facilityQuery.trim()) ||
                    (f.typeName ?? "").includes(facilityQuery.trim())),
              )
              .slice(0, 30)
              .map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFacilityIds((prev) => [...prev, f.id])}
                  className="flex w-full items-center justify-between rounded-[4px] px-2.5 py-1.5 text-left text-[13px] text-black/75 transition-colors hover:bg-black/5"
                >
                  {f.name}
                  <span className="text-[11px] text-black/35">{f.typeName ?? ""}</span>
                </button>
              ))}
          </div>
        )}
      </section>

      {/* 画像 */}
      <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <ImageUploadField
          label={`画像（${images.length}枚 / 先頭がメイン画像）`}
          images={images}
          onChange={setImages}
        />
      </section>

      {error && <p className="text-[13px] text-red-500">{error}</p>}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="whitespace-nowrap rounded-[6px] bg-black px-8 py-3 text-[13px] font-medium text-white transition-colors hover:bg-black/85 disabled:opacity-50"
          >
            {isSubmitting ? "保存中…" : "保存する"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/properties")}
            className="whitespace-nowrap rounded-[6px] border border-black/15 px-6 py-3 text-[13px] text-black/70 transition-colors hover:border-black/40 hover:text-black"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onCopyForPortal}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-[6px] border border-black/15 px-5 py-3 text-[13px] text-black/70 transition-colors hover:border-black/40 hover:text-black"
          >
            {copied ? <Check size={14} /> : <Copy size={14} strokeWidth={1.5} />}
            {copied ? "コピーしました" : "掲載用テキストをコピー"}
          </button>
        </div>
        {propertyId && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 self-start whitespace-nowrap text-[12px] text-black/40 transition-colors hover:text-red-500 sm:self-auto"
          >
            <Trash2 size={13} />
            物件を削除
          </button>
        )}
      </div>
    </form>
  )
}
