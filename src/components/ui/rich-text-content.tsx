import Link from "next/link"
import Image from "next/image"

type RichNode = {
  nodeType?: string
  value?: string
  marks?: { type: string }[]
  data?: { uri?: string; target?: { fields?: { file?: { url?: string } } } }
  content?: RichNode[]
}

function renderMarks(text: string, marks?: { type: string }[]) {
  if (!marks?.length) return text
  return marks.reduce<React.ReactNode>((node, mark) => {
    switch (mark.type) {
      case "bold":
        return <strong>{node}</strong>
      case "italic":
        return <em>{node}</em>
      case "underline":
        return <span className="underline">{node}</span>
      default:
        return node
    }
  }, text)
}

/** code マーク付きテキストに埋め込まれた生 HTML（Google マップ等の iframe） */
function extractEmbedHtml(node: RichNode): string | null {
  const texts = node.content?.filter((c) => c.nodeType === "text") ?? []
  const embed = texts.find(
    (t) =>
      t.marks?.some((m) => m.type === "code") &&
      t.value?.includes("<iframe"),
  )
  return embed?.value ?? null
}

function renderNode(node: RichNode, key: number): React.ReactNode {
  const children = node.content?.map((child, i) => renderNode(child, i))

  switch (node.nodeType) {
    case "document":
      return <div className="space-y-5">{children}</div>
    case "paragraph": {
      const embedHtml = extractEmbedHtml(node)
      if (embedHtml) {
        return (
          <div
            key={key}
            className="my-8 aspect-[4/3] overflow-hidden rounded-[6px] [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0"
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        )
      }
      return (
        <p key={key} className="text-[14px] leading-[2] text-black/75">
          {children}
        </p>
      )
    }
    case "heading-1":
      return (
        <h2 key={key} className="font-serif text-[26px] font-light text-black/90">
          {children}
        </h2>
      )
    case "heading-2":
      return (
        <h3 key={key} className="font-serif text-[22px] font-light text-black/90">
          {children}
        </h3>
      )
    case "heading-3":
      return (
        <h4 key={key} className="font-serif text-[18px] font-light text-black/85">
          {children}
        </h4>
      )
    case "unordered-list":
      return (
        <ul key={key} className="list-disc space-y-2 pl-5 text-[14px] leading-[2] text-black/75">
          {children}
        </ul>
      )
    case "ordered-list":
      return (
        <ol key={key} className="list-decimal space-y-2 pl-5 text-[14px] leading-[2] text-black/75">
          {children}
        </ol>
      )
    case "list-item":
      return <li key={key}>{children}</li>
    case "hyperlink":
      return (
        <Link
          key={key}
          href={node.data?.uri ?? "#"}
          className="underline underline-offset-2 hover:text-black"
          target={node.data?.uri?.startsWith("http") ? "_blank" : undefined}
          rel={node.data?.uri?.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </Link>
      )
    case "embedded-asset-block": {
      const url = node.data?.target?.fields?.file?.url
      if (!url) return null
      const src = url.startsWith("//") ? `https:${url}` : url
      return (
        <div key={key} className="relative my-8 aspect-[16/10] overflow-hidden rounded-[6px]">
          <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 800px" />
        </div>
      )
    }
    case "text":
      return <span key={key}>{renderMarks(node.value ?? "", node.marks)}</span>
    case "hr":
      return <hr key={key} className="border-black/10" />
    default:
      return children ? <div key={key}>{children}</div> : null
  }
}

export function RichTextContent({ content }: { content: Record<string, unknown> | null }) {
  if (!content) return null
  return (
    <div className="rich-text-content">
      {renderNode(content as RichNode, 0)}
    </div>
  )
}
