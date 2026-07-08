/**
 * Contentful 風リッチテキスト JSON と Markdown の相互変換。
 * 管理画面での記事編集（textarea）用。
 */

type RichNode = {
  nodeType?: string
  value?: string
  marks?: { type: string }[]
  data?: { uri?: string; target?: { fields?: { file?: { url?: string } } } }
  content?: RichNode[]
}

// ── Markdown → リッチテキスト ────────────────────────

const textNode = (value: string, marks: { type: string }[] = []) => ({
  data: {},
  marks,
  value,
  nodeType: "text",
})

/** **bold**・[link](url) をパースしてインラインノード列に */
function parseInline(text: string): RichNode[] {
  const nodes: RichNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
  const parts = text.split(pattern)
  for (const part of parts) {
    if (!part) continue
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(textNode(part.slice(2, -2), [{ type: "bold" }]))
      continue
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      nodes.push({
        data: { uri: link[2] },
        nodeType: "hyperlink",
        content: [textNode(link[1])],
      })
      continue
    }
    nodes.push(textNode(part))
  }
  return nodes.length ? nodes : [textNode("")]
}

export function markdownToRichText(md: string): Record<string, unknown> {
  const lines = md.replace(/\r\n/g, "\n").split("\n")
  const content: RichNode[] = []
  let listItems: string[] | null = null
  let listType: "unordered-list" | "ordered-list" | null = null

  const flushList = () => {
    if (!listItems || !listType) return
    content.push({
      data: {},
      nodeType: listType,
      content: listItems.map((item) => ({
        data: {},
        nodeType: "list-item",
        content: [{ data: {}, nodeType: "paragraph", content: parseInline(item) }],
      })),
    })
    listItems = null
    listType = null
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      flushList()
      continue
    }

    const ul = line.match(/^[-*]\s+(.+)/)
    const ol = line.match(/^\d+\.\s+(.+)/)
    if (ul || ol) {
      const type = ul ? "unordered-list" : "ordered-list"
      if (listType !== type) flushList()
      listType = type
      listItems = listItems ?? []
      listItems.push((ul ?? ol)![1])
      continue
    }
    flushList()

    const h = line.match(/^(#{1,3})\s+(.+)/)
    if (h) {
      content.push({
        data: {},
        nodeType: `heading-${h[1].length}`,
        content: parseInline(h[2]),
      })
      continue
    }

    if (line === "---") {
      content.push({ data: {}, nodeType: "hr", content: [] })
      continue
    }

    // 画像: ![alt](url) → embedded-asset-block
    const img = line.match(/^!\[[^\]]*\]\(([^)]+)\)$/)
    if (img) {
      content.push({
        data: { target: { fields: { file: { url: img[1] } } } },
        nodeType: "embedded-asset-block",
        content: [],
      })
      continue
    }

    // 生 HTML（Google マップ等の iframe）→ code マーク付きテキスト
    if (line.startsWith("<iframe")) {
      content.push({
        data: {},
        nodeType: "paragraph",
        content: [textNode(line, [{ type: "code" }])],
      })
      continue
    }

    content.push({ data: {}, nodeType: "paragraph", content: parseInline(line) })
  }
  flushList()

  return { data: {}, nodeType: "document", content: content as Record<string, unknown>[] }
}

// ── リッチテキスト → Markdown ────────────────────────

function inlineToMd(nodes: RichNode[] | undefined): string {
  if (!nodes) return ""
  return nodes
    .map((node) => {
      if (node.nodeType === "text") {
        const value = node.value ?? ""
        if (node.marks?.some((m) => m.type === "code")) return value
        if (node.marks?.some((m) => m.type === "bold") && value.trim()) return `**${value}**`
        return value
      }
      if (node.nodeType === "hyperlink") {
        return `[${inlineToMd(node.content)}](${node.data?.uri ?? "#"})`
      }
      return inlineToMd(node.content)
    })
    .join("")
}

export function richTextToMarkdown(doc: Record<string, unknown> | null): string {
  if (!doc) return ""
  const root = doc as RichNode
  const blocks: string[] = []

  for (const node of root.content ?? []) {
    switch (node.nodeType) {
      case "heading-1":
        blocks.push(`# ${inlineToMd(node.content)}`)
        break
      case "heading-2":
        blocks.push(`## ${inlineToMd(node.content)}`)
        break
      case "heading-3":
        blocks.push(`### ${inlineToMd(node.content)}`)
        break
      case "paragraph": {
        const text = inlineToMd(node.content)
        if (text.trim()) blocks.push(text)
        break
      }
      case "unordered-list":
      case "ordered-list": {
        const items = (node.content ?? []).map((li, i) => {
          const text = inlineToMd(li.content?.[0]?.content)
          return node.nodeType === "ordered-list" ? `${i + 1}. ${text}` : `- ${text}`
        })
        blocks.push(items.join("\n"))
        break
      }
      case "embedded-asset-block": {
        const url = node.data?.target?.fields?.file?.url
        if (url) blocks.push(`![](${url})`)
        break
      }
      case "hr":
        blocks.push("---")
        break
      default: {
        const text = inlineToMd(node.content)
        if (text.trim()) blocks.push(text)
      }
    }
  }

  return blocks.join("\n\n")
}
