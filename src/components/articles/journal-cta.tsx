import Link from "next/link"
import { ArrowUpRightFromSquare } from "lucide-react"

/** Floema Journal 風 — 一覧末尾の問い合わせ CTA */
export function JournalCta() {
  return (
    <section className="mx-auto mt-24 max-w-[520px] text-center lg:mt-32">
      <p
        className="mb-4 text-black/40"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "12px",
          letterSpacing: "0.3em",
        }}
      >
        STAY CONNECTED
      </p>
      <h2 className="font-serif text-[clamp(22px,3vw,32px)] font-light leading-snug text-black">
        移住・不動産のご相談は
        <br />
        お気軽にお問い合わせください
      </h2>
      <Link
        href="/contact/"
        className="group mt-8 inline-flex items-center gap-2 border-b border-black/30 pb-1 text-[14px] text-black/70 transition-colors hover:border-black hover:text-black"
      >
        お問い合わせはこちら
        <ArrowUpRightFromSquare
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </section>
  )
}
