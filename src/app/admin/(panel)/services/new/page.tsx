import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ServiceForm } from "@/components/admin/service-form"

export const metadata = { title: "サービスを追加" }

export default function AdminServiceNewPage() {
  return (
    <div>
      <Link
        href="/admin/services"
        className="mb-4 inline-flex items-center gap-1 text-[12px] text-black/45 transition-colors hover:text-black"
      >
        <ChevronLeft size={13} />
        サービス一覧
      </Link>
      <h1 className="mb-8 font-serif text-[24px] font-light text-black">サービスを追加</h1>
      <ServiceForm serviceId={null} defaults={{}} />
    </div>
  )
}
