import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ServiceForm } from "@/components/admin/service-form"
import { richTextToMarkdown } from "@/lib/rich-text-markdown"

export const metadata = { title: "サービスを編集" }

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: service } = await supabase.from("services").select("*").eq("id", id).single()

  if (!service) notFound()

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1 text-[12px] text-black/45 transition-colors hover:text-black"
        >
          <ChevronLeft size={13} />
          サービス一覧
        </Link>
        {service.published && (
          <Link
            href={`/services/${service.slug}/`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-[12px] text-black/45 transition-colors hover:text-black"
          >
            公開ページを表示
            <ExternalLink size={12} />
          </Link>
        )}
      </div>
      <h1 className="mb-8 font-serif text-[24px] font-light text-black">サービスを編集</h1>
      <ServiceForm
        serviceId={id}
        defaults={{
          ...service,
          body_markdown: richTextToMarkdown(service.content),
        }}
      />
    </div>
  )
}
