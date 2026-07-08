import type { Metadata } from "next"
import { SubPageShell } from "@/components/layout/sub-page-shell"
import { SalesPageContent } from "@/components/sales/sales-page-content"
import { MEDIA } from "@/lib/media"

export const metadata: Metadata = {
  title: "売る",
  description: "伊豆エリアの不動産売却・査定のご相談はサイファーム南伊豆へ。",
}

export default function SalesPage() {
  return (
    <SubPageShell>
      <SalesPageContent
        heroImage={MEDIA.SALES_ILLUSTRATION}
        sideImage={MEDIA.SALES_SIDE}
        illustrationImage={MEDIA.SALES_ILLUSTRATION}
      />
    </SubPageShell>
  )
}
