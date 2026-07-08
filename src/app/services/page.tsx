import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SCROLL_PAGE_PT } from "@/components/top/top-page-nav"
import { richTextToFirstParagraph } from "@/lib/rich-text"
import { cn } from "@/lib/utils"
import type { Service } from "@/types"

export const metadata: Metadata = {
  title: "サービス",
  description: "移住・別荘・不動産に関するサイファーム南伊豆のサービス一覧。",
}

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  const services = (data as Service[] | null) ?? []

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
          SERVICES
        </p>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <h1 className="font-serif text-[clamp(40px,5.5vw,80px)] font-light leading-[1.05] text-black">
            サービス
          </h1>
          <p className="pb-1.5 text-right" style={{ fontFamily: "var(--font-barlow)" }}>
            <span className="block text-[clamp(26px,3vw,42px)] font-light leading-none tabular-nums text-black/85">
              {String(services.length).padStart(2, "0")}
            </span>
            <span className="mt-1.5 block text-[11px] tracking-[0.3em] text-black/40 uppercase">
              Services
            </span>
          </p>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-black/50">
          移住・別荘・不動産に関するサイファーム南伊豆のサービス
        </p>
      </header>

      {/* サービスリスト — 番号付きエディトリアル行 */}
      <div className="mx-auto max-w-screen-xl px-6 pb-24 lg:px-12 lg:pb-32">
        <div className="border-t border-black/10">
          {services.map((service, i) => {
            const excerpt =
              service.description ??
              richTextToFirstParagraph(service.content) ??
              ""
            const reverse = i % 2 === 1

            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}/`}
                className="group grid grid-cols-1 gap-6 border-b border-black/10 py-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-14"
              >
                {/* 画像 */}
                <div
                  className={cn(
                    "lg:col-span-5",
                    reverse ? "lg:order-2 lg:col-start-8" : "lg:order-1",
                  )}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-black/5">
                    {service.featured_photo_url ? (
                      <Image
                        src={service.featured_photo_url}
                        alt={service.name}
                        fill
                        className="object-cover saturate-[0.9] transition-transform duration-[8000ms] ease-out group-hover:scale-[1.08]"
                        sizes="(max-width: 1024px) 100vw, 42vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[12px] text-black/30">
                        No Image
                      </div>
                    )}
                  </div>
                </div>

                {/* テキスト */}
                <div
                  className={cn(
                    "lg:col-span-6",
                    reverse
                      ? "lg:order-1 lg:col-start-1"
                      : "lg:order-2 lg:col-start-7",
                  )}
                >
                  <p
                    className="mb-4 text-[13px] tracking-[0.2em] text-black/35 tabular-nums"
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="font-serif text-[clamp(22px,2.6vw,32px)] font-light leading-[1.4] text-black/90 transition-colors duration-300 group-hover:text-black">
                    {service.name}
                  </h2>
                  {excerpt && (
                    <p className="mt-4 line-clamp-3 max-w-[520px] text-[13px] leading-[2] text-black/55">
                      {excerpt}
                    </p>
                  )}
                  <span className="mt-6 inline-flex items-center gap-3 text-[12px] tracking-[0.18em] text-black/50 transition-colors duration-300 group-hover:text-black">
                    詳しく見る
                    <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-14" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
