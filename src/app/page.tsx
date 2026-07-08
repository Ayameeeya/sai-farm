import { createClient } from "@/lib/supabase/server"
import { HeroSection } from "@/components/top/hero-section"
import { TopPageNav } from "@/components/top/top-page-nav"
import { IntroSection } from "@/components/top/intro-section"
import { PurposeSection } from "@/components/top/purpose-section"
import { PropertiesSection } from "@/components/top/properties-section"
import { ServicesSection } from "@/components/top/services-section"
import { NewsSection } from "@/components/top/news-section"
import type { Property, Service, News } from "@/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "サイファーム南伊豆 | 伊豆の不動産・移住・別荘",
}

export default async function TopPage() {
  const supabase = await createClient()

  const [
    { data: properties },
    { data: latestProperty },
    { data: services },
    { data: news },
  ] = await Promise.all([
    supabase
      .from("properties")
      .select("id, property_name, slug, status, comment, one_point, address, layout, price, land_space_sqm, property_category:property_categories(id, name, slug), property_images(image_url, sort_order)")
      .lt("status", 7)
      .order("status")
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("properties")
      .select("id, property_name, slug, price, address, property_category:property_categories(name, slug), property_images(image_url, sort_order)")
      .lt("status", 7)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("services")
      .select("id, name, slug, description, content, featured_photo_url")
      .eq("published", true)
      .order("created_at")
      .limit(4),
    supabase
      .from("news")
      .select("*, tag:news_tags(name)")
      .order("created_at", { ascending: false })
      .limit(3),
  ])

  return (
    <>
      <TopPageNav />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <HeroSection latestProperty={latestProperty as any ?? undefined} />
      <IntroSection />
      <PurposeSection />
      <PropertiesSection properties={(properties as unknown as Property[]) ?? []} />
      <ServicesSection services={(services as unknown as Service[]) ?? []} />
      <NewsSection news={(news as unknown as News[]) ?? []} />
    </>
  )
}
