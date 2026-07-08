import type { Metadata } from "next"
import { PageHeader } from "@/components/layout/page-header"
import { SubPageShell } from "@/components/layout/sub-page-shell"
import { LetterSwapButton } from "@/components/ui/letter-swap-button"

export const metadata: Metadata = {
  title: "送信完了",
  robots: { index: false },
}

export default function ThanksPage() {
  return (
    <SubPageShell>
      <PageHeader label="THANK YOU" title="お問い合わせありがとうございます" />

      <div className="mx-auto max-w-[560px] px-6 py-16 text-center lg:py-24">
        <p className="mb-8 text-[14px] leading-[2.2] text-black/70">
          お問い合わせ内容を送信しました。
          <br />
          担当者より通常2〜3営業日以内にご連絡させていただきます。
        </p>
        <LetterSwapButton href="/" label="トップへ戻る" variant="dark" />
      </div>
    </SubPageShell>
  )
}
