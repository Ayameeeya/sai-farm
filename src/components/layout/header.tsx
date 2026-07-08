"use client"

import { usePathname } from "next/navigation"
import { SubPageNav } from "@/components/layout/sub-page-nav"
import { TopPageNav } from "@/components/top/top-page-nav"
import { isPillOnlyNavPath } from "@/lib/nav-paths"

export function Header() {
  const pathname = usePathname()
  if (pathname === "/" || pathname.startsWith("/admin")) return null
  if (isPillOnlyNavPath(pathname)) return <SubPageNav />
  return <TopPageNav />
}
