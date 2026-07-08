"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Pencil, X, Check } from "lucide-react"
import {
  saveNews,
  deleteNews,
  saveNewsTag,
  deleteNewsTag,
} from "@/app/admin/actions"

type NewsItem = {
  id: string
  title: string
  tag_id: string | null
  created_at: string
  tag_name: string | null
}

type Tag = { id: string; name: string }

const LABEL = "block text-[12px] tracking-[0.1em] text-black/50"
const INPUT =
  "rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"

export function NewsManager({ news, tags }: { news: NewsItem[]; tags: Tag[] }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // お知らせ追加
  const [newTitle, setNewTitle] = useState("")
  const [newTagId, setNewTagId] = useState("")

  // お知らせ編集
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editTagId, setEditTagId] = useState("")

  // タグ
  const [newTagName, setNewTagName] = useState("")
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editTagName, setEditTagName] = useState("")

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
    if (!newTitle.trim()) return
    const ok = await run(() => saveNews(null, newTitle.trim(), newTagId || null))
    if (ok) {
      setNewTitle("")
      setNewTagId("")
    }
  }

  const onUpdate = async (id: string) => {
    if (!editTitle.trim()) return
    const ok = await run(() => saveNews(id, editTitle.trim(), editTagId || null))
    if (ok) setEditingId(null)
  }

  const onDelete = async (id: string) => {
    if (!window.confirm("このお知らせを削除しますか？")) return
    await run(() => deleteNews(id))
  }

  const onAddTag = async () => {
    if (!newTagName.trim()) return
    const ok = await run(() => saveNewsTag(null, newTagName.trim()))
    if (ok) setNewTagName("")
  }

  const onUpdateTag = async (id: string) => {
    if (!editTagName.trim()) return
    const ok = await run(() => saveNewsTag(id, editTagName.trim()))
    if (ok) setEditingTagId(null)
  }

  const onDeleteTag = async (id: string) => {
    if (!window.confirm("このタグを削除しますか？使用中のお知らせからも外れます。")) return
    await run(() => deleteNewsTag(id))
  }

  return (
    <div className="grid max-w-[1000px] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-6">
        {/* 新規追加 */}
        <div className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
          <p className="mb-4 text-[13px] font-medium text-black/70">お知らせを追加</p>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>タイトル</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="お知らせのタイトルを入力"
                className={`${INPUT} mt-1.5 w-full`}
              />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className={LABEL}>タグ</label>
                <select
                  value={newTagId}
                  onChange={(e) => setNewTagId(e.target.value)}
                  className={`${INPUT} mt-1.5 w-full`}
                >
                  <option value="">タグなし</option>
                  {tags.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={onAdd}
                disabled={busy || !newTitle.trim()}
                className="inline-flex h-[37px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] bg-black px-5 text-[13px] text-white transition-colors hover:bg-black/85 disabled:opacity-40"
              >
                <Plus size={14} />
                追加する
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        {/* 一覧 */}
        <div className="overflow-hidden rounded-[12px] bg-white ring-1 ring-black/5">
          {news.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-black/5 px-4 py-3 last:border-0 sm:px-5 sm:py-3.5"
            >
              {editingId === item.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={`${INPUT} order-1 w-full min-w-0 sm:w-auto sm:flex-1`}
                  />
                  <select
                    value={editTagId}
                    onChange={(e) => setEditTagId(e.target.value)}
                    className={`${INPUT} order-2 min-w-0 flex-1 sm:w-[130px] sm:flex-none`}
                  >
                    <option value="">タグなし</option>
                    {tags.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <span className="order-3 flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => onUpdate(item.id)}
                      disabled={busy}
                      className="p-1.5 text-black/50 hover:text-black"
                      aria-label="保存"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-black/40 hover:text-black"
                      aria-label="キャンセル"
                    >
                      <X size={15} />
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <span className="order-1 shrink-0 text-[11px] tabular-nums text-black/40 sm:w-[84px]">
                    {new Date(item.created_at).toLocaleDateString("ja-JP")}
                  </span>
                  {item.tag_name && (
                    <span className="order-2 shrink-0 rounded-full bg-black/6 px-2.5 py-0.5 text-[10.5px] text-black/55">
                      {item.tag_name}
                    </span>
                  )}
                  <span className="order-4 w-full min-w-0 truncate text-[13px] text-black/80 sm:order-3 sm:w-auto sm:flex-1">
                    {item.title}
                  </span>
                  <span className="order-3 ml-auto flex shrink-0 items-center sm:order-4 sm:ml-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(item.id)
                        setEditTitle(item.title)
                        setEditTagId(item.tag_id ?? "")
                      }}
                      className="p-1.5 text-black/40 hover:text-black"
                      aria-label="編集"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 text-black/40 hover:text-red-500"
                      aria-label="削除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                </>
              )}
            </div>
          ))}
          {news.length === 0 && (
            <p className="px-5 py-8 text-center text-[13px] text-black/40">
              お知らせはまだありません
            </p>
          )}
        </div>
      </div>

      {/* タグ管理 */}
      <div className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <p className="mb-4 text-[13px] font-medium text-black/70">タグ管理</p>
        <div className="mb-4 flex gap-2">
          <input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="新しいタグ名"
            className={`${INPUT} min-w-0 flex-1`}
          />
          <button
            type="button"
            onClick={onAddTag}
            disabled={busy || !newTagName.trim()}
            className="inline-flex h-[37px] shrink-0 items-center rounded-[6px] bg-black px-3.5 text-white transition-colors hover:bg-black/85 disabled:opacity-40"
            aria-label="タグを追加"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-1">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 hover:bg-black/[0.03]"
            >
              {editingTagId === tag.id ? (
                <>
                  <input
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                    className={`${INPUT} min-w-0 flex-1 px-2 py-1`}
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateTag(tag.id)}
                    disabled={busy}
                    className="p-1 text-black/50 hover:text-black"
                    aria-label="保存"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTagId(null)}
                    className="p-1 text-black/40 hover:text-black"
                    aria-label="キャンセル"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-black/75">
                    {tag.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTagId(tag.id)
                      setEditTagName(tag.name)
                    }}
                    className="p-1 text-black/40 hover:text-black"
                    aria-label="タグを編集"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTag(tag.id)}
                    className="p-1 text-black/40 hover:text-red-500"
                    aria-label="タグを削除"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          ))}
          {tags.length === 0 && (
            <p className="py-3 text-center text-[12px] text-black/40">タグはまだありません</p>
          )}
        </div>
      </div>
    </div>
  )
}
