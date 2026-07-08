import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f5f4f1]">{children}</div>
}
