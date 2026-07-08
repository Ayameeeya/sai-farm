import { SCROLL_PAGE_PT } from "@/components/top/top-page-nav"

type Props = {
  children: React.ReactNode
  className?: string
}

export function SubPageShell({ children, className = "" }: Props) {
  return (
    <div
      className={`min-h-screen bg-white ${className}`}
      style={{ paddingTop: SCROLL_PAGE_PT }}
    >
      {children}
    </div>
  )
}
