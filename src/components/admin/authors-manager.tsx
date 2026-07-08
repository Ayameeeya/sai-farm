"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trash2, Pencil, X } from "lucide-react"
import { saveAuthor, deleteAuthor } from "@/app/admin/actions"
import { ImageUploadField } from "@/components/admin/image-upload-field"

export type AuthorRow = {
  id: string
  name: string
  description: string | null
  avatar_url: string | null
  /** 執筆記事数 */
  articleCount: number
}

const LABEL = "block text-[12px] tracking-[0.1em] text-black/50"
const INPUT =
  "mt-1.5 w-full rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"

const EMPTY = { name: "", description: "", avatar_url: "" }

export function AuthorsManager({ authors }: { authors: AuthorRow[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const reset = () => {
    setEditingId(null)
    setForm(EMPTY)
    setShowForm(false)
    setError(null)
  }

  const startEdit = (a: AuthorRow) => {
    setEditingId(a.id)
    setForm({
      name: a.name,
      description: a.description ?? "",
      avatar_url: a.avatar_url ?? "",
    })
    setShowForm(true)
  }

  const onSave = async () => {
    if (!form.name.trim()) {
      setError("著者名を入力してください。")
      return
    }
    setBusy(true)
    setError(null)
    const result = await saveAuthor(editingId, {
      name: form.name.trim(),
      description: form.description || null,
      avatar_url: form.avatar_url || null,
    })
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    reset()
    router.refresh()
  }

  const onDelete = async (a: AuthorRow) => {
    const warn =
      a.articleCount > 0
        ? `「${a.name}」を削除しますか？${a.articleCount}件の記事は著者未設定になります。`
        : `「${a.name}」を削除しますか？`
    if (!window.confirm(warn)) return
    setBusy(true)
    const result = await deleteAuthor(a.id)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (editingId === a.id) reset()
    router.refresh()
  }

  return (
    <div className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-black/70">著者</p>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-[12px] text-black/45 hover:text-black"
          >
            + 追加
          </button>
        )}
      </div>
      <p className="mt-1 mb-4 text-[11px] leading-relaxed text-black/40">
        ブログ記事の署名・プロフィールに使います。
      </p>

      {showForm && (
        <div className="mb-5 space-y-3 rounded-[8px] bg-black/[0.03] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-black/60">
              {editingId ? "著者を編集" : "著者を追加"}
            </p>
            <button
              type="button"
              onClick={reset}
              className="p-1 text-black/40 hover:text-black"
              aria-label="閉じる"
            >
              <X size={13} />
            </button>
          </div>
          <div>
            <label className={LABEL}>名前 *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>プロフィール文</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={`${INPUT} resize-y`}
            />
          </div>
          <ImageUploadField
            label="アバター画像"
            images={form.avatar_url ? [form.avatar_url] : []}
            onChange={(urls) => set("avatar_url", urls[0] ?? "")}
            single
          />
          {error && <p className="text-[12px] text-red-500">{error}</p>}
          <button
            type="button"
            onClick={onSave}
            disabled={busy}
            className="rounded-[6px] bg-black px-5 py-2 text-[12px] font-medium text-white transition-colors hover:bg-black/85 disabled:opacity-50"
          >
            {busy ? "保存中…" : editingId ? "更新する" : "追加する"}
          </button>
        </div>
      )}

      <div className="space-y-1">
        {authors.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-[6px] px-2 py-1.5 hover:bg-black/[0.03]"
          >
            <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-full bg-black/5">
              {a.avatar_url && (
                <Image src={a.avatar_url} alt="" fill className="object-cover" sizes="32px" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] text-black/75">{a.name}</p>
              {a.articleCount > 0 && (
                <p className="text-[11px] text-black/35">記事{a.articleCount}件</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => startEdit(a)}
              className="p-1 text-black/40 hover:text-black"
              aria-label="編集"
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(a)}
              className="p-1 text-black/40 hover:text-red-500"
              aria-label="削除"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {authors.length === 0 && (
          <p className="py-3 text-center text-[12px] text-black/40">まだありません</p>
        )}
      </div>
    </div>
  )
}
