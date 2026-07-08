import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { SubPageShell } from "@/components/layout/sub-page-shell"
import { LetterSwapButton } from "@/components/ui/letter-swap-button"

export default function NotFound() {
  return (
    <SubPageShell>
      <PageHeader label="404" title="ページが見つかりません" />

      <div className="mx-auto max-w-[560px] px-6 py-16 text-center lg:py-24">
        <p className="mb-8 text-[14px] leading-[2] text-black/60">
          お探しのページは移動または削除された可能性があります。
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <LetterSwapButton href="/" label="トップへ" variant="dark" />
          <Link
            href="/contact/"
            className="text-[13px] tracking-[0.15em] text-black/60 underline underline-offset-4 hover:text-black"
          >
            お問い合わせ
          </Link>
        </div>
      </div>
    </SubPageShell>
  )
}
