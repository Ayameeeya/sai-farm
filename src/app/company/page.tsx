import type { Metadata } from "next"
import { CompanyInfoTable } from "@/components/company/company-info-table"
import { SCROLL_PAGE_PT } from "@/components/top/top-page-nav"
import { createClient } from "@/lib/supabase/server"
import type { CompanyProfile } from "@/types"

export const metadata: Metadata = {
  title: "会社情報",
  description: "株式会社サイファーム南伊豆の会社概要・アクセス情報。",
}

const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d6560.288574218436!2d138.76684087765113!3d34.70154050000412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzTCsDQxJzU1LjkiTiAxMzjCsDQ2JzE1LjkiRQ!5e0!3m2!1sja!2sjp!4v1712303981140!5m2!1sja!2sjp"

export default async function CompanyPage() {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("company_profile")
    .select("*")
    .limit(1)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: SCROLL_PAGE_PT }}>
      {/* エディトリアルヘッダー */}
      <header className="mx-auto max-w-screen-xl px-6 pt-8 pb-10 lg:px-12 lg:pt-14 lg:pb-16">
        <p
          className="mb-4 text-black/45"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            letterSpacing: "0.35em",
          }}
        >
          COMPANY
        </p>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <h1 className="font-serif text-[clamp(40px,5.5vw,80px)] font-light leading-[1.05] text-black">
            会社情報
          </h1>
          <p className="pb-1.5 text-right" style={{ fontFamily: "var(--font-barlow)" }}>
            <span className="block text-[clamp(20px,2.2vw,30px)] font-light leading-none tracking-[0.06em] text-black/85">
              MINAMI-IZU
            </span>
            <span className="mt-1.5 block text-[11px] tracking-[0.3em] text-black/40 uppercase">
              Shizuoka, Japan
            </span>
          </p>
        </div>
        <p className="mt-4 max-w-[560px] text-[13px] leading-[2.1] text-black/50">
          株式会社サイファーム南伊豆の会社概要・アクセス情報
        </p>
      </header>

      <div className="mx-auto max-w-screen-xl px-6 pb-24 lg:px-12 lg:pb-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* 会社概要 */}
          <section className="lg:col-span-6">
            <p
              className="mb-6 text-black/45"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                letterSpacing: "0.35em",
              }}
            >
              PROFILE
            </p>
            {profile ? (
              <CompanyInfoTable profile={profile as CompanyProfile} />
            ) : (
              <p className="text-[14px] text-black/50">会社情報を読み込めませんでした。</p>
            )}
          </section>

          {/* アクセス */}
          <section className="lg:col-span-6">
            <p
              className="mb-6 text-black/45"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                letterSpacing: "0.35em",
              }}
            >
              ACCESS
            </p>
            <div className="overflow-hidden rounded-[6px] border border-black/10">
              <iframe
                src={MAP_EMBED}
                title="サイファーム南伊豆 地図"
                className="h-[320px] w-full border-0 saturate-[0.85] lg:h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {profile?.address && (
              <p className="mt-4 text-[13px] leading-[2] text-black/55">
                {profile.address}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
