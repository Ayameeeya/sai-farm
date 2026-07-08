import { createClient } from "@/lib/supabase/server"
import { CompanyForm } from "@/components/admin/company-form"

export const metadata = { title: "会社情報" }

export default async function AdminCompanyPage() {
  const supabase = await createClient()
  const { data: profile } = await supabase.from("company_profile").select("*").single()

  return (
    <div>
      <h1 className="mb-8 font-serif text-[24px] font-light text-black">会社情報</h1>
      {profile ? (
        <CompanyForm profile={profile} />
      ) : (
        <p className="text-[13px] text-black/50">会社情報が登録されていません。</p>
      )}
    </div>
  )
}
