import Link from "next/link"
import type { CompanyProfile } from "@/types"

type Row = { label: string; value: React.ReactNode }

export function CompanyInfoTable({ profile }: { profile: CompanyProfile }) {
  const rows: Row[] = [
    { label: "商号", value: profile.name },
    { label: "本店", value: profile.address },
    {
      label: "電話",
      value: profile.tel ? (
        <Link href="tel:+81-558-64-8880" className="transition-colors hover:text-black">
          {profile.tel}
        </Link>
      ) : null,
    },
    { label: "FAX", value: profile.fax },
    {
      label: "E-mail",
      value: profile.email ? (
        <Link href={`mailto:${profile.email}`} className="transition-colors hover:text-black">
          {profile.email}
        </Link>
      ) : null,
    },
    { label: "資本金", value: profile.capital },
    { label: "代表者", value: profile.representative_name },
    { label: "設立", value: profile.established_on },
    { label: "免許", value: profile.license },
    { label: "所属団体", value: profile.community },
    {
      label: "提携サービス",
      value: (
        <a
          href="https://iqrafudosan.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-black"
        >
          イクラ不動産
        </a>
      ),
    },
    { label: "営業時間", value: profile.working_hour },
    { label: "定休日", value: profile.holidays },
    { label: "交通", value: profile.transportation },
  ].filter((row) => row.value)

  return (
    <dl className="border-t border-black/10">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-6 border-b border-black/10 py-3.5"
        >
          <dt className="shrink-0 text-[12px] tracking-[0.12em] text-black/45">
            {row.label}
          </dt>
          <dd className="text-right text-[13px] leading-relaxed text-black/75">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
