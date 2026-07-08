"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trash2, Pencil, X } from "lucide-react"
import { saveFacility, deleteFacility, type FacilityInput } from "@/app/admin/actions"
import { ImageUploadField } from "@/components/admin/image-upload-field"

type Option = { id: string; name: string }

export type FacilityRow = {
  id: string
  name: string
  description: string | null
  facility_type_id: string | null
  image_url: string | null
  lat: number
  lng: number
  typeName: string | null
  /** 紐付いている物件数 */
  propertyCount: number
}

const LABEL = "block text-[12px] tracking-[0.1em] text-black/50"
const INPUT =
  "mt-1.5 w-full rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"

const EMPTY_FORM = {
  name: "",
  description: "",
  facility_type_id: "",
  image_url: "",
  lat: "",
  lng: "",
}

export function FacilitiesManager({
  facilities,
  facilityTypes,
}: {
  facilities: FacilityRow[]
  facilityTypes: Option[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<"name" | "type" | "usage">("name")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const filtered = useMemo(() => {
    const q = query.trim()
    const list = q
      ? facilities.filter((f) => f.name.includes(q) || (f.typeName ?? "").includes(q))
      : [...facilities]
    return list.sort((a, b) => {
      if (sort === "type") {
        // 種別未設定は末尾へ
        if (!a.typeName !== !b.typeName) return a.typeName ? -1 : 1
        return (
          (a.typeName ?? "").localeCompare(b.typeName ?? "", "ja") ||
          a.name.localeCompare(b.name, "ja")
        )
      }
      if (sort === "usage")
        return b.propertyCount - a.propertyCount || a.name.localeCompare(b.name, "ja")
      return a.name.localeCompare(b.name, "ja")
    })
  }, [facilities, query, sort])

  const startEdit = (f: FacilityRow) => {
    setEditingId(f.id)
    setForm({
      name: f.name,
      description: f.description ?? "",
      facility_type_id: f.facility_type_id ?? "",
      image_url: f.image_url ?? "",
      lat: String(f.lat),
      lng: String(f.lng),
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const reset = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError(null)
  }

  const onSave = async () => {
    const lat = Number(form.lat)
    const lng = Number(form.lng)
    if (!form.name.trim()) {
      setError("施設名を入力してください。")
      return
    }
    if (!form.lat || !form.lng || Number.isNaN(lat) || Number.isNaN(lng)) {
      setError("緯度・経度を入力してください（地図表示に必須です）。")
      return
    }
    setBusy(true)
    setError(null)
    const input: FacilityInput = {
      name: form.name.trim(),
      description: form.description || null,
      facility_type_id: form.facility_type_id || null,
      image_url: form.image_url || null,
      lat,
      lng,
    }
    const result = await saveFacility(editingId, input)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    reset()
    router.refresh()
  }

  const onDelete = async (f: FacilityRow) => {
    const warn =
      f.propertyCount > 0
        ? `「${f.name}」を削除しますか？${f.propertyCount}件の物件から紐付けが外れます。`
        : `「${f.name}」を削除しますか？`
    if (!window.confirm(warn)) return
    setBusy(true)
    const result = await deleteFacility(f.id)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (editingId === f.id) reset()
    router.refresh()
  }

  return (
    <div className="max-w-[1000px] space-y-6">
      {/* 追加・編集フォーム */}
      <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[13px] font-medium text-black/70">
            {editingId ? "施設を編集" : "施設を追加"}
          </p>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-[12px] text-black/45 hover:text-black"
            >
              <X size={13} />
              編集をやめる
            </button>
          )}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className={LABEL}>施設名 *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>種別</label>
            <select
              value={form.facility_type_id}
              onChange={(e) => set("facility_type_id", e.target.value)}
              className={INPUT}
            >
              <option value="">未設定</option>
              {facilityTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>緯度 *</label>
            <input
              type="number"
              step="any"
              value={form.lat}
              onChange={(e) => set("lat", e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>経度 *</label>
            <input
              type="number"
              step="any"
              value={form.lng}
              onChange={(e) => set("lng", e.target.value)}
              className={INPUT}
            />
          </div>
          <div className="lg:col-span-2">
            <label className={LABEL}>説明</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className={`${INPUT} resize-y`}
            />
          </div>
          <div className="lg:col-span-2">
            <ImageUploadField
              label="写真"
              images={form.image_url ? [form.image_url] : []}
              onChange={(urls) => set("image_url", urls[0] ?? "")}
              single
            />
          </div>
        </div>

        {error && <p className="mt-4 text-[13px] text-red-500">{error}</p>}

        <button
          type="button"
          onClick={onSave}
          disabled={busy}
          className="mt-5 rounded-[6px] bg-black px-8 py-3 text-[13px] font-medium text-white transition-colors hover:bg-black/85 disabled:opacity-50"
        >
          {busy ? "保存中…" : editingId ? "更新する" : "追加する"}
        </button>
      </section>

      {/* 一覧 */}
      <section className="rounded-[12px] bg-white ring-1 ring-black/5">
        <div className="flex gap-3 border-b border-black/8 p-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`施設名・種別で検索（全${facilities.length}件）`}
            className="w-full rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="shrink-0 rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"
            aria-label="並び順"
          >
            <option value="name">名前順</option>
            <option value="type">種別順</option>
            <option value="usage">使用数が多い順</option>
          </select>
        </div>
        <div className="max-h-[520px] overflow-y-auto">
          {filtered.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 border-b border-black/5 px-4 py-2.5 last:border-0 hover:bg-black/[0.02]"
            >
              <span className="relative block h-9 w-12 shrink-0 overflow-hidden rounded-[4px] bg-black/5">
                {f.image_url && (
                  <Image src={f.image_url} alt="" fill className="object-cover" sizes="48px" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-black/85">{f.name}</p>
                <p className="text-[11px] text-black/40">
                  {f.typeName ?? "種別未設定"}
                  {f.propertyCount > 0 && ` ・ 物件${f.propertyCount}件で使用中`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => startEdit(f)}
                className="p-1.5 text-black/40 hover:text-black"
                aria-label="編集"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(f)}
                className="p-1.5 text-black/40 hover:text-red-500"
                aria-label="削除"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-[13px] text-black/40">
              該当する施設がありません
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
