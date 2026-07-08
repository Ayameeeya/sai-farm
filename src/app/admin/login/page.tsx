import type { Metadata } from "next"
import { LoginForm } from "@/components/admin/login-form"

export const metadata: Metadata = {
  title: "管理画面ログイン",
  robots: { index: false },
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f4f1] px-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-10 text-center">
          <p
            className="mb-3 text-black/40"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              letterSpacing: "0.35em",
            }}
          >
            SAIFARM ADMIN
          </p>
          <h1 className="font-serif text-[26px] font-light text-black">管理画面</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
