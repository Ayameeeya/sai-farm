import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { SITE_URL } from "@/lib/site"

const STATIC_PATHS = [
  "/",
  "/about-us/",
  "/services/",
  "/sales/",
  "/map/",
  "/articles/",
  "/company/",
  "/contact/",
  "/privacy-policy/",
  "/properties/property-categories/all/",
  "/properties/property-categories/land/",
  "/properties/property-categories/house/",
  "/tools/properties-tax-simulator/",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const [{ data: properties }, { data: articles }, { data: services }] =
    await Promise.all([
      supabase.from("properties").select("slug, updated_at").neq("status", 9),
      supabase.from("articles").select("slug, updated_at").eq("published", true),
      supabase.from("services").select("slug, updated_at").eq("published", true),
    ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }))

  const propertyEntries: MetadataRoute.Sitemap = (properties ?? []).map((p) => ({
    url: `${SITE_URL}/properties/${p.slug}/`,
    lastModified: p.updated_at ?? undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const articleEntries: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}/`,
    lastModified: a.updated_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const serviceEntries: MetadataRoute.Sitemap = (services ?? []).map((s) => ({
    url: `${SITE_URL}/services/${s.slug}/`,
    lastModified: s.updated_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticEntries, ...propertyEntries, ...articleEntries, ...serviceEntries]
}
