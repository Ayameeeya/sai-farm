"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Pencil, X, Check } from "lucide-react"
import {
  saveTag,
  deleteTag,
  saveArticleCategory,
  deleteArticleCategory,
} from "@/app/admin/actions"

export type TaxonomyItem = {
  id: string
  name: string
  /** 使用件数（記事数・物件数など） */
  usage: string | null
}

const INPUT =
  "rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"

type PanelProps = {
  title: string
  description: string
  items: TaxonomyItem[]
  placeholder: string
  deleteConfirm: string
  onSave: (id: string | null, name: string) => Promise<{ error?: string }>
  onRemove: (id: string) => Promise<{ error?: string }>
}

function TaxonomyPanel({
  title,
  description,
  items,
  placeholder,
  deleteConfirm,
  onSave,
  onRemove,
}: PanelProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const run = async (fn: () => Promise<{ error?: string }>) => {
    setBusy(true)
    setError(null)
    const result = await fn()
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return false
    }
    router.refresh()
    return true
  }

  const onAdd = async () => {
    if (!newName.trim()) return
    const ok = await run(() => onSave(null, newName.trim()))
    if (ok) setNewName("")
  }

  const onUpdate = async (id: string) => {
    if (!editName.trim()) return
    const ok = await run(() => onSave(id, editName.trim()))
    if (ok) setEditingId(null)
  }

  const onDelete = async (id: string) => {
    if (!window.confirm(deleteConfirm)) return
    await run(() => onRemove(id))
  }

  return (
    <div className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
      <p className="text-[13px] font-medium text-black/70">{title}</p>
      <p className="mt-1 mb-4 text-[11px] leading-relaxed text-black/40">{description}</p>

      <div className="mb-4 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              onAdd()
            }
          }}
          placeholder={placeholder}
          className={`${INPUT} min-w-0 flex-1`}
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={busy || !newName.trim()}
          className="inline-flex h-[37px] shrink-0 items-center rounded-[6px] bg-black px-3.5 text-white transition-colors hover:bg-black/85 disabled:opacity-40"
          aria-label={`${title}を追加`}
        >
          <Plus size={14} />
        </button>
      </div>

      {error && <p className="mb-3 text-[12px] text-red-500">{error}</p>}

      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 hover:bg-black/[0.03]"
          >
            {editingId === item.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      onUpdate(item.id)
                    }
                  }}
                  className={`${INPUT} min-w-0 flex-1 px-2 py-1`}
                />
                <button
                  type="button"
                  onClick={() => onUpdate(item.id)}
                  disabled={busy}
                  className="p-1 text-black/50 hover:text-black"
                  aria-label="保存"
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="p-1 text-black/40 hover:text-black"
                  aria-label="キャンセル"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <span className="min-w-0 flex-1 truncate text-[13px] text-black/75">
                  {item.name}
                </span>
                {item.usage && (
                  <span className="shrink-0 text-[11px] tabular-nums text-black/35">
                    {item.usage}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item.id)
                    setEditName(item.name)
                  }}
                  className="p-1 text-black/40 hover:text-black"
                  aria-label="編集"
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="p-1 text-black/40 hover:text-red-500"
                  aria-label="削除"
                >
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="py-3 text-center text-[12px] text-black/40">まだありません</p>
        )}
      </div>
    </div>
  )
}

export function TaxonomyManager({
  tags,
  categories,
}: {
  tags: TaxonomyItem[]
  categories: TaxonomyItem[]
}) {
  return (
    <>
      <TaxonomyPanel
        title="タグ"
        description="記事と物件の両方で使う共通タグです。記事・物件の編集画面で選択できます。"
        items={tags}
        placeholder="新しいタグ名"
        deleteConfirm="このタグを削除しますか？使用中の記事・物件からも外れます。"
        onSave={saveTag}
        onRemove={deleteTag}
      />
      <TaxonomyPanel
        title="記事カテゴリ"
        description="ブログ記事の分類です。記事の編集画面で選択できます。"
        items={categories}
        placeholder="新しいカテゴリ名"
        deleteConfirm="このカテゴリを削除しますか？使用中の記事は「未設定」になります。"
        onSave={saveArticleCategory}
        onRemove={deleteArticleCategory}
      />
    </>
  )
}
