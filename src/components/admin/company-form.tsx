"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { saveCompanyProfile } from "@/app/admin/actions"

const FIELDS: { key: string; label: string; textarea?: boolean }[] = [
  { key: "name", label: "会社名" },
  { key: "representative_name", label: "代表者名" },
  { key: "address", label: "住所" },
  { key: "transportation", label: "交通" },
  { key: "tel", label: "電話番号" },
  { key: "fax", label: "FAX" },
  { key: "email", label: "メールアドレス" },
  { key: "capital", label: "資本金" },
  { key: "established_on", label: "設立" },
  { key: "license", label: "免許番号" },
  { key: "community", label: "所属団体", textarea: true },
  { key: "working_hour", label: "営業時間" },
  { key: "holidays", label: "定休日" },
]

const LABEL = "block text-[12px] tracking-[0.1em] text-black/50"
const INPUT =
  "mt-1.5 w-full rounded-[6px] border border-black/12 bg-white px-3 py-2 text-[13px] text-black outline-none transition-colors focus:border-black"

type Profile = Record<string, string | null> & { id: string }

export function CompanyForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Record<string, string>>({
    defaultValues: Object.fromEntries(
      FIELDS.map((f) => [f.key, profile[f.key] ?? ""]),
    ),
  })

  const onSubmit = async (values: Record<string, string>) => {
    setError(null)
    setSaved(false)
    const fields = Object.fromEntries(
      FIELDS.map((f) => [f.key, values[f.key] || null]),
    )
    const result = await saveCompanyProfile(profile.id, fields)
    if (result.error) {
      setError(result.error)
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[680px]">
      <div className="rounded-[12px] bg-white p-6 ring-1 ring-black/5">
        <div className="grid gap-4 lg:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.key} className={field.textarea ? "lg:col-span-2" : ""}>
              <label className={LABEL}>{field.label}</label>
              {field.textarea ? (
                <textarea rows={3} className={`${INPUT} resize-y`} {...register(field.key)} />
              ) : (
                <input className={INPUT} {...register(field.key)} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-[13px] text-red-500">{error}</p>}
      {saved && <p className="mt-4 text-[13px] text-black/60">保存しました。</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-[6px] bg-black px-8 py-3 text-[13px] font-medium text-white transition-colors hover:bg-black/85 disabled:opacity-50"
      >
        {isSubmitting ? "保存中…" : "保存する"}
      </button>
    </form>
  )
}
