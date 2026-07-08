"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { LogIn } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type FormData = {
  email: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>()

  const onSubmit = async ({ email, password }: FormData) => {
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません。")
      return
    }
    router.push("/admin")
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[14px] bg-white p-8 shadow-[0_20px_60px_-20px_rgba(13,12,10,0.15)] ring-1 ring-black/5"
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-[12px] tracking-[0.14em] text-black/50">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-2.5 w-full border-b border-black/20 bg-transparent pb-2.5 text-[14px] text-black outline-none transition-colors duration-300 focus:border-black"
            {...register("email", { required: true })}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-[12px] tracking-[0.14em] text-black/50">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-2.5 w-full border-b border-black/20 bg-transparent pb-2.5 text-[14px] text-black outline-none transition-colors duration-300 focus:border-black"
            {...register("password", { required: true })}
          />
        </div>

        {error && <p className="text-[12px] text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-[6px] bg-black px-6 py-3 text-[13px] font-medium tracking-[0.12em] text-white transition-colors duration-300 hover:bg-black/85 disabled:opacity-50"
        >
          {isSubmitting ? "ログイン中…" : "ログイン"}
          <LogIn size={14} strokeWidth={1.5} />
        </button>
      </div>
    </form>
  )
}
