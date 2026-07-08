import { AdminNav } from "@/components/admin/admin-nav"

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminNav />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">{children}</main>
    </div>
  )
}
