"use client"

// 行頭に来てはいけない文字は前の文字とセットにする(禁則処理)
const KINSOKU = /^[、。”」』）｝〉》・ーぁぃぅぇぉっゃゅょ々〜]$/

function splitKinsoku(text: string): string[] {
  const segments: string[] = []
  for (const ch of text) {
    if (segments.length > 0 && KINSOKU.test(ch)) {
      segments[segments.length - 1] += ch
    } else {
      segments.push(ch)
    }
  }
  return segments
}

export function CharReveal({
  text,
  className = "",
  charClass = "story-char",
}: {
  text: string
  className?: string
  charClass?: string
}) {
  return (
    <p aria-label={text.replace(/\n/g, "")} className={className}>
      {text.split("\n").map((line, li) => (
        <span key={li} aria-hidden className="block">
          {splitKinsoku(line).map((seg, i) => (
            <span key={i} className={`${charClass} inline-block will-change-transform`}>
              {seg}
            </span>
          ))}
        </span>
      ))}
    </p>
  )
}
