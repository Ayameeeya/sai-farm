"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type GeneratedArticle = {
  title: string
  slug: string
  meta_description: string
  body_markdown: string
}

async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")
}

const SYSTEM_PROMPT = `あなたは静岡県南伊豆エリアの不動産会社「サイファーム南伊豆」のブログライターです。
移住・別荘・田舎暮らし・地域情報に関する記事を、地元目線の親しみやすい文体で書きます。

出力は必ず次の JSON 形式のみ（コードブロックなし）:
{
  "title": "記事タイトル（30字前後）",
  "slug": "url-friendly-slug（英小文字とハイフン）",
  "meta_description": "検索結果に表示される説明文（100字前後）",
  "body_markdown": "本文。## 見出し・### 小見出し・- 箇条書き・**強調** を使った Markdown。1500〜2500字程度"
}`

/**
 * AI で記事ドラフトを生成する。
 * OPENAI_API_KEY が設定されていれば OpenAI API を使用、
 * 未設定の場合はテーマを反映した下書きテンプレートを返す。
 */
export async function generateArticle(
  theme: string,
  keywords: string,
): Promise<GeneratedArticle | { error: string }> {
  await requireAuth()

  const apiKey = process.env.OPENAI_API_KEY
  if (apiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `テーマ: ${theme}\nキーワード: ${keywords || "指定なし"}`,
            },
          ],
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        return { error: `AI 生成に失敗しました: ${text.slice(0, 200)}` }
      }
      const json = await res.json()
      const parsed = JSON.parse(json.choices[0].message.content)
      return {
        title: parsed.title ?? theme,
        slug: parsed.slug ?? slugify(theme),
        meta_description: parsed.meta_description ?? "",
        body_markdown: parsed.body_markdown ?? "",
      }
    } catch (e) {
      return { error: `AI 生成に失敗しました: ${String(e).slice(0, 200)}` }
    }
  }

  // API キー未設定時: 構成済みドラフトを返す
  return {
    title: theme,
    slug: slugify(theme),
    meta_description: `${theme}について、南伊豆の不動産会社サイファームが地元目線でご紹介します。`,
    body_markdown: draftTemplate(theme, keywords),
  }
}

function slugify(text: string): string {
  const ascii = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
  return ascii || `article-${Date.now()}`
}

function draftTemplate(theme: string, keywords: string): string {
  const kw = keywords
    ? keywords.split(/[、,\s]+/).filter(Boolean)
    : ["南伊豆", "移住", "暮らし"]
  return `## はじめに

${theme}について、南伊豆で暮らす私たちの目線でご紹介します。

## ${kw[0] ?? "南伊豆"}の魅力

ここに本文を書きます。**強調したい部分**は太字にできます。

- ポイント1
- ポイント2
- ポイント3

## ${kw[1] ?? "暮らし"}について

ここに本文を書きます。

### 詳しく知りたい方へ

ここに本文を書きます。

## まとめ

${theme}についてのまとめを書きます。物件や移住のご相談はサイファーム南伊豆までお気軽にどうぞ。

※ この下書きはテンプレートです。OPENAI_API_KEY を設定すると AI が本文まで自動生成します。`
}
