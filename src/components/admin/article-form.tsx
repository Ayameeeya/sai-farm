"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Trash2, LoaderCircle } from "lucide-react"
import { saveArticle, deleteArticle, type ArticleInput } from "@/app/admin/actions"
import { generateArticle } from "@/app/admin/ai-actions"
import { ImageUploadField } from "@/components/admin/image-upload-field"

type Option = { id: string; name: string }

type Props = {
  articleId: string | null
  defaults: Partial<ArticleInput>
  categories: Option[]
  authors: Option[]
  tags: Option[]
}

const LABEL = "block text-[12px] tracking-[0.1em] text-black/50"
const INPUT =
  "mt-1.5 w-full rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"

export function ArticleForm({ articleId, defaults, categories, authors, tags }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: defaults.title ?? "",
    slug: defaults.slug ?? "",
    meta_description: defaults.meta_description ?? "",
    featured_photo_url: defaults.featured_photo_url ?? "",
    published: defaults.published ?? false,
    category_id: defaults.category_id ?? "",
    author_id: defaults.author_id ?? "",
    tag_ids: defaults.tag_ids ?? [],
    body_markdown: defaults.body_markdown ?? "",
  })
  const [theme, setTheme] = useState("")
  const [keywords, setKeywords] = useState("")
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onGenerate = async () => {
    if (!theme.trim()) {
      setError("生成テーマを入力してください。")
      return
    }
    setError(null)
    setGenerating(true)
    const result = await generateArticle(theme.trim(), keywords.trim())
    setGenerating(false)
    if ("error" in result) {
      setError(result.error)
      return
    }
    setForm((prev) => ({
      ...prev,
      title: result.title,
      slug: prev.slug || result.slug,
      meta_description: result.meta_description,
      body_markdown: result.body_markdown,
    }))
  }

  const onSave = async (publish?: boolean) => {
    if (!form.title.trim() || !form.slug.trim()) {
      setError("タイトルとスラッグは必須です。")
      return
    }
    setError(null)
    setSaving(true)
    const result = await saveArticle(articleId, {
      title: form.title.trim(),
      slug: form.slug.trim(),
      meta_description: form.meta_description || null,
      featured_photo_url: form.featured_photo_url || null,
      published: publish ?? form.published,
      category_id: form.category_id || null,
      author_id: form.author_id || null,
      tag_ids: form.tag_ids,
      body_markdown: form.body_markdown,
    })
    setSaving(false)
    if ("error" in result && result.error) {
      setError(result.error)
      return
    }
    router.push("/admin/articles")
    router.refresh()
  }

  const onDelete = async () => {
    if (!articleId) return
    if (!window.confirm("この記事を削除しますか？この操作は取り消せません。")) return
    const result = await deleteArticle(articleId)
    if (result.error) {
      setError(result.error)
      return
    }
    router.push("/admin/articles")
    router.refresh()
  }

  return (
    <div className="grid max-w-[1100px] gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {/* AI 生成 */}
        <section className="rounded-[12px] bg-[#141311] p-6 text-white">
          <p className="mb-1 flex items-center gap-2 text-[13px] font-medium">
            <Sparkles size={14} strokeWidth={1.5} />
            AI 記事生成
          </p>
          <p className="mb-5 text-[11px] leading-relaxed text-white/45">
            テーマとキーワードを入力すると、タイトル・本文・メタ情報のドラフトを自動生成します。生成後に自由に編集できます。
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] tracking-[0.1em] text-white/50">テーマ *</label>
              <input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="例）南伊豆への移住で知っておきたいこと"
                className="mt-1.5 w-full rounded-[6px] border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/50"
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.1em] text-white/50">
                キーワード（任意・読点区切り）
              </label>
              <input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="例）移住、古民家、海の近く"
                className="mt-1.5 w-full rounded-[6px] border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/50"
              />
            </div>
            <button
              type="button"
              onClick={onGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-[6px] bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-colors hover:bg-white/85 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <LoaderCircle size={14} className="animate-spin" />
                  生成中…
                </>
              ) : (
                <>
                  <Sparkles size={14} strokeWidth={1.5} />
                  記事を生成する
                </>
              )}
            </button>
          </div>
        </section>

        {/* 本文 */}
        <section className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
          <div className="space-y-4">
            <div>
              <label className={LABEL}>タイトル *</label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className={`${INPUT} text-[16px] font-medium`}
              />
            </div>
            <div>
              <label className={LABEL}>
                本文（Markdown — ## 見出し / - 箇条書き / **強調** / ![画像](URL)）
              </label>
              <textarea
                value={form.body_markdown}
                onChange={(e) => set("body_markdown", e.target.value)}
                rows={24}
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
                placeholder="minamiizu-life"
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>カテゴリ</label>
              <select
                value={form.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                className={INPUT}
              >
                <option value="">未設定</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>著者</label>
              <select
                value={form.author_id}
                onChange={(e) => set("author_id", e.target.value)}
                className={INPUT}
              >
                <option value="">未設定</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>タグ</label>
              {tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((tag) => {
                    const selected = form.tag_ids.includes(tag.id)
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() =>
                          set(
                            "tag_ids",
                            selected
                              ? form.tag_ids.filter((id) => id !== tag.id)
                              : [...form.tag_ids, tag.id],
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
                <p className="mt-2 text-[12px] text-black/40">
                  タグは「タグ・カテゴリ」から登録できます
                </p>
              )}
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
            下書きとして保存
          </button>
          {articleId && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex w-full items-center justify-center gap-2 py-2 text-[12px] text-black/40 transition-colors hover:text-red-500"
            >
              <Trash2 size={13} />
              記事を削除
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
