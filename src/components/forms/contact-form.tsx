"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LetterSwapSubmitButton } from "@/components/ui/letter-swap-button"

type FormData = {
  name: string
  tel: string
  email?: string
  message: string
}

const FORMSPREE_URL = "https://formspree.io/f/mzbkvjwn"

const LABEL = "block text-[12px] tracking-[0.14em] text-black/50"
const INPUT =
  "mt-2.5 w-full border-b border-black/20 bg-transparent pb-2.5 text-[14px] text-black outline-none transition-colors duration-300 placeholder:text-black/25 focus:border-black"

function FieldLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string
  label: string
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className={LABEL}>
      {label}
      <span
        className={`ml-2.5 inline-block text-[10px] tracking-[0.1em] ${
          required ? "text-red-400" : "text-black/35"
        }`}
      >
        {required ? "必須" : "任意"}
      </span>
    </label>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-[12px] text-red-500">{message}</p>
}

export function ContactForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const onSubmit = async (values: FormData) => {
    setSubmitError(null)
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (data.ok) {
        router.push("/thanks/")
        return
      }
      setSubmitError("送信に失敗しました。時間をおいて再度お試しください。")
    } catch {
      setSubmitError("送信に失敗しました。時間をおいて再度お試しください。")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-9">
      <div className="grid gap-9 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="name" label="お名前" required />
          <input
            id="name"
            placeholder="例）伊豆太郎"
            className={INPUT}
            {...register("name", { required: "必須入力です" })}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <FieldLabel htmlFor="tel" label="電話番号" required />
          <input
            id="tel"
            placeholder="例）09012345678"
            className={INPUT}
            {...register("tel", { required: "必須入力です" })}
          />
          <FieldError message={errors.tel?.message} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="email" label="メールアドレス" />
        <input
          id="email"
          type="email"
          placeholder="例）saifarm@example.com"
          className={INPUT}
          {...register("email", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "不正なメールフォーマットです",
            },
          })}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <FieldLabel htmlFor="message" label="お問い合わせ内容" required />
        <textarea
          id="message"
          rows={7}
          placeholder="こちらにお問い合わせ内容をご入力ください"
          className={`${INPUT} resize-none`}
          {...register("message", { required: "必須入力です" })}
        />
        <FieldError message={errors.message?.message} />
      </div>

      {submitError && <p className="text-[13px] text-red-500">{submitError}</p>}

      <div className="pt-2">
        <LetterSwapSubmitButton
          label="送信する"
          isSubmitting={isSubmitting}
          className="w-full px-10 py-3.5 tracking-[0.15em] sm:w-auto"
        />
      </div>
    </form>
  )
}
