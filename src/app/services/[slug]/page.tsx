import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SCROLL_PAGE_PT, STICKY_TOP } from "@/components/top/top-page-nav"
import { RichTextContent } from "@/components/ui/rich-text-content"
import { LetterSwapButton } from "@/components/ui/letter-swap-button"
import type { Service } from "@/types"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("services")
    .select("name, meta_description, featured_photo_url")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle()

  if (!data) return { title: "サービス" }
  return {
    title: data.name,
    description: data.meta_description ?? undefined,
    openGraph: {
      type: "article",
      title: data.name,
      description: data.meta_description ?? undefined,
      images: data.featured_photo_url ? [data.featured_photo_url] : undefined,
    },
    twitter: data.featured_photo_url
      ? { images: [data.featured_photo_url] }
      : undefined,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const [{ data: service }, { data: profile }, { data: others }] =
    await Promise.all([
      supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle(),
      supabase.from("company_profile").select("name, tel").limit(1).maybeSingle(),
      supabase
        .from("services")
        .select("id, slug, name, featured_photo_url")
        .eq("published", true)
        .neq("slug", slug)
        .order("created_at", { ascending: false })
        .limit(3),
    ])

  if (!service) notFound()

  const typed = service as Service
  const tel = profile?.tel ?? "0558-64-8880"
  const otherServices = (others ?? []) as Pick<
    Service,
    "id" | "slug" | "name" | "featured_photo_url"
  >[]

  return (
    <article className="min-h-screen bg-white" style={{ paddingTop: SCROLL_PAGE_PT }}>
      {/* パンくず */}
      <div className="mx-auto max-w-screen-xl px-6 pt-2 lg:px-12">
        <nav className="flex items-center gap-2 text-[12px] text-black/40">
          <Link href="/" className="transition-colors hover:text-black">
            トップ
          </Link>
          <span>/</span>
          <Link href="/services/" className="transition-colors hover:text-black">
            サービス
          </Link>
          <span>/</span>
          <span className="text-black/65">{typed.name}</span>
        </nav>
      </div>

      {/* エディトリアルヘッダー */}
      <header className="mx-auto max-w-screen-xl px-6 pt-8 pb-10 lg:px-12 lg:pt-12 lg:pb-14">
        <p
          className="mb-4 text-black/45"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            letterSpacing: "0.35em",
          }}
        >
          SERVICE
        </p>
        <h1 className="max-w-[900px] font-serif text-[clamp(28px,4.5vw,52px)] font-light leading-[1.3] text-black">
          {typed.name}
        </h1>
        {typed.description && (
          <p className="mt-6 max-w-[640px] text-[14px] leading-[2.2] text-black/60">
            {typed.description}
          </p>
        )}
      </header>

      {/* ヒーロー画像 — ワイド */}
      {typed.featured_photo_url && (
        <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[6px] lg:aspect-[21/9]">
            <Image
              src={typed.featured_photo_url}
              alt={typed.name}
              fill
              className="object-cover saturate-[0.9]"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-screen-xl px-6 pt-14 pb-20 lg:px-12 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-3">
          {/* 本文 */}
          <div className="lg:col-span-2">
            <RichTextContent content={typed.content} />
          </div>

          {/* サイドバー */}
          <aside>
            <div className="lg:sticky" style={{ top: STICKY_TOP + 24 }}>
              <div className="rounded-[6px] border border-black/12 p-7 lg:p-8">
                <p
                  className="mb-6 text-black/45"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "12px",
                    letterSpacing: "0.35em",
                  }}
                >
                  CONTACT
                </p>
                <p className="text-[13px] leading-[2] text-black/60">
                  本サービスに関するご相談・ご質問は
                  <br />
                  お気軽にお問い合わせください。
                </p>

                <a
                  href={`tel:${tel.replace(/-/g, "")}`}
                  className="mt-6 flex items-baseline gap-2.5 text-black/85 transition-colors hover:text-black"
                >
                  <Phone size={15} strokeWidth={1.5} className="translate-y-0.5" />
                  <span
                    className="text-[24px] font-light tracking-[0.06em] tabular-nums"
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    {tel}
                  </span>
                </a>
                {profile?.name && (
                  <p className="mt-1.5 text-[11px] text-black/40">{profile.name}</p>
                )}

                <div className="mt-7 border-t border-black/10 pt-7">
                  <LetterSwapButton
                    href="/contact/"
                    label="お問い合わせフォーム"
                    variant="dark"
                    icon="send"
                    fullWidth
                  />
                </div>
              </div>

              <Link
                href="/services/"
                className="group mt-6 inline-flex items-center gap-3 text-[12px] tracking-[0.18em] text-black/50 transition-colors hover:text-black"
              >
                <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-14" />
                サービス一覧に戻る
              </Link>
            </div>
          </aside>
        </div>

        {/* 他のサービス */}
        {otherServices.length > 0 && (
          <section className="mt-24 border-t border-black/10 pt-14 lg:mt-32 lg:pt-16">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p
                  className="mb-3 text-black/45"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    letterSpacing: "0.35em",
                  }}
                >
                  OTHER SERVICES
                </p>
                <h2 className="font-serif text-[clamp(24px,3vw,34px)] font-light text-black">
                  その他のサービス
                </h2>
              </div>
              <Link
                href="/services/"
                className="group hidden items-center gap-3 text-[12px] tracking-[0.18em] text-black/50 transition-colors hover:text-black sm:inline-flex"
              >
                一覧を見る
                <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-14" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
              {otherServices.map((s) => (
                <Link key={s.id} href={`/services/${s.slug}/`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-black/5">
                    {s.featured_photo_url ? (
                      <Image
                        src={s.featured_photo_url}
                        alt={s.name}
                        fill
                        className="object-cover saturate-[0.9] transition-transform duration-[8000ms] ease-out group-hover:scale-[1.08]"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[12px] text-black/30">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 font-serif text-[16px] font-light leading-snug text-black/85 transition-colors duration-300 group-hover:text-black lg:text-[17px]">
                    {s.name}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-3 text-[11px] tracking-[0.18em] text-black/45 transition-colors duration-300 group-hover:text-black">
                    詳しく見る
                    <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
