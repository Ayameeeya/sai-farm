import type { Metadata } from "next"
import { SubPageShell } from "@/components/layout/sub-page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { TaxSimulator } from "@/components/tools/tax-simulator"

export const metadata: Metadata = {
  title: "不動産売却 税金シミュレーター",
  description:
    "不動産売却時にかかる譲渡所得税（所得税・復興特別所得税・住民税）の概算を簡単に計算できる無料ツールです。マイホーム特別控除にも対応。",
}

export default function PropertiesTaxSimulatorPage() {
  return (
    <SubPageShell>
      <PageHeader
        label="SIMULATOR"
        title="不動産売却 税金シミュレーター"
        description="売却額などを入力すると、譲渡所得税の概算がその場でわかります。"
      />
      <TaxSimulator />
    </SubPageShell>
  )
}
