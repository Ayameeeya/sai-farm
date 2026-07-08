/**
 * Contentful Rich Text JSON からプレーンテキストを抽出するユーティリティ
 */
export function richTextToPlainText(json: unknown): string {
  if (!json || typeof json !== "object") return ""
  const node = json as { value?: string; content?: unknown[] }
  let text = ""
  if (node.value) text += node.value
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      text += richTextToPlainText(child)
    }
  }
  return text.trim()
}

/**
 * Rich Text の最初の段落だけ返す（短い説明文用）
 */
export function richTextToFirstParagraph(json: unknown): string {
  if (!json || typeof json !== "object") return ""
  const root = json as { content?: { content?: { value?: string }[] }[] }
  const firstBlock = root.content?.[0]
  if (!firstBlock) return ""
  const text = firstBlock.content
    ?.map((n) => n.value ?? "")
    .join("") ?? ""
  return text.trim()
}
