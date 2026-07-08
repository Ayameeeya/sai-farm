import type { Metadata } from "next"
import { Phone } from "lucide-react"
import { ContactForm } from "@/components/forms/contact-form"
import { SCROLL_PAGE_PT } from "@/components/top/top-page-nav"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "物件見学・売却相談・サービスに関するお問い合わせはこちら。",
}

const TOPICS = [
  { label: "VIEWING", title: "物件見学のご予約" },
  { label: "SELLING", title: "不動産売却のご相談" },
  { label: "SERVICE", title: "サービスに関するお問い合わせ" },
  { label: "OTHER", title: "その他のご相談" },
]

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("company_profile")
    .select("name, tel")
    .limit(1)
    .maybeSingle()

  const tel = profile?.tel ?? "0558-64-8880"

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
          CONTACT
        </p>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <h1 className="font-serif text-[clamp(40px,5.5vw,80px)] font-light leading-[1.05] text-black">
            お問い合わせ
          </h1>
          <p className="pb-1.5 text-right" style={{ fontFamily: "var(--font-barlow)" }}>
            <span className="block text-[clamp(26px,3vw,42px)] font-light leading-none tabular-nums text-black/85">
              9–18
            </span>
            <span className="mt-1.5 block text-[11px] tracking-[0.3em] text-black/40 uppercase">
              Open Hours
            </span>
          </p>
        </div>
        <p className="mt-4 max-w-[560px] text-[13px] leading-[2.1] text-black/50">
          送信完了後、担当者より通常2〜3営業日以内にご連絡させていただきます。
        </p>
      </header>

      <div className="mx-auto max-w-screen-xl px-6 pb-24 lg:px-12 lg:pb-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* 左カラム — ご相談内容と電話 */}
          <div className="lg:col-span-5">
            <p
              className="mb-4 text-black/45"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                letterSpacing: "0.35em",
              }}
            >
              TOPICS
            </p>
            <div className="border-t border-black/10">
              {TOPICS.map((topic, i) => (
                <div
                  key={topic.label}
                  className="flex items-baseline gap-6 border-b border-black/10 py-5"
                >
                  <span
                    className="w-8 shrink-0 text-[13px] tracking-[0.15em] text-black/30 tabular-nums"
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-[16px] font-light text-black/85 lg:text-[17px]">
                    {topic.title}
                  </span>
                  <span
                    className="ml-auto hidden text-[10px] tracking-[0.24em] text-black/30 uppercase sm:block"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {topic.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 電話 */}
            <div className="mt-12 rounded-[6px] border border-black/12 p-7 lg:p-8">
              <p
                className="mb-5 text-black/45"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "12px",
                  letterSpacing: "0.35em",
                }}
              >
                TEL
              </p>
              <p className="text-[13px] leading-[2] text-black/60">
                お問い合わせは、お電話でも承ります。
                <br />
                お気軽にご連絡ください。
              </p>
              <a
                href={`tel:${tel.replace(/-/g, "")}`}
                className="mt-5 flex items-baseline gap-2.5 text-black/85 transition-colors hover:text-black"
              >
                <Phone size={15} strokeWidth={1.5} className="translate-y-0.5" />
                <span
                  className="text-[26px] font-light tracking-[0.06em] tabular-nums"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  {tel}
                </span>
              </a>
              <p className="mt-2 text-[11px] text-black/40">
                受付時間 9:00–18:00（年末年始を除く）
                {profile?.name ? ` / ${profile.name}` : ""}
              </p>
            </div>
          </div>

          {/* 右カラム — フォーム */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
