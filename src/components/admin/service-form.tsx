"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { saveService, deleteService, type ServiceInput } from "@/app/admin/actions"
import { ImageUploadField } from "@/components/admin/image-upload-field"

type Props = {
  serviceId: string | null
  defaults: Partial<ServiceInput>
}

const LABEL = "block text-[12px] tracking-[0.1em] text-black/50"
const INPUT =
  "mt-1.5 w-full rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"

export function ServiceForm({ serviceId, defaults }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: defaults.name ?? "",
    slug: defaults.slug ?? "",
    description: defaults.description ?? "",
    meta_description: defaults.meta_description ?? "",
    featured_photo_url: defaults.featured_photo_url ?? "",
    published: defaults.published ?? false,
    body_markdown: defaults.body_markdown ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onSave = async (publish?: boolean) => {
    if (!form.name.trim() || !form.slug.trim()) {
      setError("サービス名とスラッグは必須です。")
      return
    }
    setError(null)
    setSaving(true)
    const result = await saveService(serviceId, {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description || null,
      meta_description: form.meta_description || null,
      featured_photo_url: form.featured_photo_url || null,
      published: publish ?? form.published,
      body_markdown: form.body_markdown,
    })
    setSaving(false)
    if ("error" in result && result.error) {
      setError(result.error)
      return
    }
    router.push("/admin/services")
    router.refresh()
  }

  const onDelete = async () => {
    if (!serviceId) return
    if (!window.confirm("このサービスを削除しますか？この操作は取り消せません。")) return
    const result = await deleteService(serviceId)
    if (result.error) {
      setError(result.error)
      return
    }
    router.push("/admin/services")
    router.refresh()
  }

  return (
    <div className="grid max-w-[1100px] gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
          <div className="space-y-4">
            <div>
              <label className={LABEL}>サービス名 *</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={`${INPUT} text-[16px] font-medium`}
              />
            </div>
            <div>
              <label className={LABEL}>概要（一覧・トップに表示される短い説明）</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className={`${INPUT} resize-y`}
              />
            </div>
            <div>
              <label className={LABEL}>
                本文（Markdown — ## 見出し / - 箇条書き / **強調** / ![画像](URL)）
              </label>
              <textarea
                value={form.body_markdown}
                onChange={(e) => set("body_markdown", e.target.value)}
                rows={20}
                className={`${INPUT} resize-y font-mono text-[12.5px] leading-[1.9]`}
              />
            </div>
          </div>
        </section>
      </div>

      {/* サイド設定 */}
      <div className="space-y-6">
        <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
          <p className="mb-5 text-[13px] font-medium text-black/70">公開設定</p>
          <div className="space-y-4">
            <div>
              <label className={LABEL}>スラッグ（URL）*</label>
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="renovation"
                className={INPUT}
              />
            </div>
            <div>
              <ImageUploadField
                label="アイキャッチ画像"
                images={form.featured_photo_url ? [form.featured_photo_url] : []}
                onChange={(urls) => set("featured_photo_url", urls[0] ?? "")}
                single
              />
            </div>
            <div>
              <label className={LABEL}>メタディスクリプション</label>
              <textarea
                value={form.meta_description}
                onChange={(e) => set("meta_description", e.target.value)}
                rows={3}
                className={`${INPUT} resize-y`}
              />
            </div>
          </div>
        </section>

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => onSave(true)}
            disabled={saving}
            className="w-full rounded-[6px] bg-black px-6 py-3 text-[13px] font-medium text-white transition-colors hover:bg-black/85 disabled:opacity-50"
          >
            {saving ? "保存中…" : "公開して保存"}
          </button>
          <button
            type="button"
            onClick={() => onSave(false)}
            disabled={saving}
            className="w-full rounded-[6px] border border-black/15 px-6 py-3 text-[13px] text-black/70 transition-colors hover:border-black/40 hover:text-black disabled:opacity-50"
          >
            非公開で保存
          </button>
          {serviceId && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex w-full items-center justify-center gap-2 py-2 text-[12px] text-black/40 transition-colors hover:text-red-500"
            >
              <Trash2 size={13} />
              サービスを削除
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
