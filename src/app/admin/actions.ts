"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { markdownToRichText } from "@/lib/rich-text-markdown"

/** 認証済みでなければ弾く。認証済みなら service role クライアントを返す */
async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")
  return createAdminClient()
}

function revalidateSite() {
  revalidatePath("/", "layout")
}

// ── 物件 ─────────────────────────────────────────────

export type PropertyInput = {
  property_name: string
  /** 空欄の場合はエリア・カテゴリから英語スラッグを自動生成 */
  slug: string | null
  status: number
  price: number | null
  address: string | null
  property_category_id: string | null
  area_id: string | null
  layout: string | null
  land_space_sqm: number | null
  building_space_sqm: number | null
  bedroom: number | null
  bathroom: number | null
  transportation: string | null
  comment: string | null
  one_point: string | null
  lat: number | null
  lng: number | null
  images: string[]
  tag_ids: string[]
  facility_ids: string[]
}

/** 英語スラッグを「エリア-カテゴリ-連番」で自動生成 */
async function generatePropertySlug(
  db: ReturnType<typeof createAdminClient>,
  areaId: string | null,
  categoryId: string | null,
) {
  const [areaRes, catRes] = await Promise.all([
    areaId ? db.from("areas").select("slug").eq("id", areaId).single() : null,
    categoryId
      ? db.from("property_categories").select("slug").eq("id", categoryId).single()
      : null,
  ])
  const areaSlug = areaRes?.data?.slug ?? "minamiizu"
  const catSlug = catRes?.data?.slug ?? "property"

  const base = `${areaSlug}-${catSlug}`
  const { data: existing } = await db
    .from("properties")
    .select("slug")
    .like("slug", `${base}-%`)
  const used = new Set((existing ?? []).map((p) => p.slug))
  let n = 1
  while (used.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}

export async function saveProperty(id: string | null, input: PropertyInput) {
  const db = await requireAdmin()
  const { images, tag_ids, facility_ids, slug: inputSlug, ...fields } = input

  const slug = inputSlug?.trim()
    ? inputSlug.trim()
    : id
      ? undefined // 編集時に空欄なら既存スラッグを維持
      : await generatePropertySlug(db, fields.area_id, fields.property_category_id)

  let propertyId = id
  if (id) {
    const { error } = await db
      .from("properties")
      .update({
        ...fields,
        ...(slug ? { slug } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
    if (error) return { error: error.message }
  } else {
    const { data, error } = await db
      .from("properties")
      .insert({ ...fields, slug })
      .select("id")
      .single()
    if (error) return { error: error.message }
    propertyId = data.id
  }

  // 画像・タグ・周辺施設は入れ替え
  await Promise.all([
    db.from("property_images").delete().eq("property_id", propertyId!),
    db.from("property_tags").delete().eq("property_id", propertyId!),
    db.from("property_facilities").delete().eq("property_id", propertyId!),
  ])
  if (images.length) {
    const { error } = await db.from("property_images").insert(
      images.map((url, i) => ({
        property_id: propertyId!,
        image_url: url,
        sort_order: i,
      })),
    )
    if (error) return { error: error.message }
  }
  if (tag_ids.length) {
    const { error } = await db.from("property_tags").insert(
      tag_ids.map((tagId) => ({ property_id: propertyId!, tag_id: tagId })),
    )
    if (error) return { error: error.message }
  }
  if (facility_ids.length) {
    const { error } = await db.from("property_facilities").insert(
      facility_ids.map((facilityId) => ({
        property_id: propertyId!,
        facility_id: facilityId,
      })),
    )
    if (error) return { error: error.message }
  }

  revalidateSite()
  return { id: propertyId }
}

/** 一覧からのステータス変更 */
export async function updatePropertyStatus(id: string, status: number) {
  const db = await requireAdmin()
  const { error } = await db
    .from("properties")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}

export async function deleteProperty(id: string) {
  const db = await requireAdmin()
  await db.from("property_images").delete().eq("property_id", id)
  await db.from("property_facilities").delete().eq("property_id", id)
  await db.from("property_tags").delete().eq("property_id", id)
  const { error } = await db.from("properties").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}

/** 国土地理院 API で住所から緯度経度を取得 */
export async function geocodeAddress(address: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  try {
    const res = await fetch(
      `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(address)}`,
      { headers: { "User-Agent": "sai-farm-admin" } },
    )
    if (!res.ok) return { error: "住所検索に失敗しました。" }
    const results: { geometry?: { coordinates?: [number, number] } }[] = await res.json()
    const coords = results?.[0]?.geometry?.coordinates
    if (!coords) return { error: "住所から位置を特定できませんでした。番地を減らして試してください。" }
    return { lat: coords[1], lng: coords[0] }
  } catch {
    return { error: "住所検索に失敗しました。" }
  }
}

/** 画像ファイルを Supabase Storage にアップロードし公開 URL を返す */
export async function uploadImages(formData: FormData) {
  const db = await requireAdmin()
  const files = formData.getAll("files") as File[]
  if (!files.length) return { error: "ファイルがありません。" }

  const urls: string[] = []
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return { error: `画像ファイルではありません: ${file.name}` }
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await db.storage
      .from("property-images")
      .upload(path, file, { contentType: file.type })
    if (error) return { error: error.message }
    const { data } = db.storage.from("property-images").getPublicUrl(path)
    urls.push(data.publicUrl)
  }
  return { urls }
}

// ── 記事 ─────────────────────────────────────────────

export type ArticleInput = {
  title: string
  slug: string
  meta_description: string | null
  featured_photo_url: string | null
  published: boolean
  category_id: string | null
  author_id: string | null
  tag_ids: string[]
  /** マークダウン本文（保存時にリッチテキスト JSON に変換） */
  body_markdown: string
}

export async function saveArticle(id: string | null, input: ArticleInput) {
  const db = await requireAdmin()
  const { body_markdown, tag_ids, ...fields } = input
  const record = {
    ...fields,
    content: markdownToRichText(body_markdown),
    updated_at: new Date().toISOString(),
  }

  let articleId = id
  if (id) {
    const { error } = await db.from("articles").update(record).eq("id", id)
    if (error) return { error: error.message }
  } else {
    const { data, error } = await db
      .from("articles")
      .insert(record)
      .select("id")
      .single()
    if (error) return { error: error.message }
    articleId = data.id
  }

  // タグは入れ替え
  await db.from("article_tags").delete().eq("article_id", articleId!)
  if (tag_ids.length) {
    const { error } = await db.from("article_tags").insert(
      tag_ids.map((tagId) => ({ article_id: articleId!, tag_id: tagId })),
    )
    if (error) return { error: error.message }
  }

  revalidateSite()
  return { id: articleId }
}

export async function deleteArticle(id: string) {
  const db = await requireAdmin()
  await db.from("article_tags").delete().eq("article_id", id)
  const { error } = await db.from("articles").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}

// ── お知らせ ─────────────────────────────────────────

export async function saveNews(id: string | null, title: string, tagId: string | null) {
  const db = await requireAdmin()
  if (id) {
    const { error } = await db.from("news").update({ title, tag_id: tagId }).eq("id", id)
    if (error) return { error: error.message }
  } else {
    const { error } = await db.from("news").insert({ title, tag_id: tagId })
    if (error) return { error: error.message }
  }
  revalidateSite()
  return {}
}

export async function deleteNews(id: string) {
  const db = await requireAdmin()
  const { error } = await db.from("news").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}

export async function saveNewsTag(id: string | null, name: string) {
  const db = await requireAdmin()
  if (id) {
    const { error } = await db.from("news_tags").update({ name }).eq("id", id)
    if (error) return { error: error.message }
  } else {
    const { error } = await db.from("news_tags").insert({ name })
    if (error) return { error: error.message }
  }
  revalidateSite()
  return {}
}

export async function deleteNewsTag(id: string) {
  const db = await requireAdmin()
  // 使用中のお知らせからタグを外してから削除
  await db.from("news").update({ tag_id: null }).eq("tag_id", id)
  const { error } = await db.from("news_tags").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}

// ── サービス ─────────────────────────────────────────

export type ServiceInput = {
  name: string
  slug: string
  description: string | null
  meta_description: string | null
  featured_photo_url: string | null
  published: boolean
  /** マークダウン本文（保存時にリッチテキスト JSON に変換） */
  body_markdown: string
}

export async function saveService(id: string | null, input: ServiceInput) {
  const db = await requireAdmin()
  const { body_markdown, ...fields } = input
  const record = {
    ...fields,
    content: markdownToRichText(body_markdown),
    updated_at: new Date().toISOString(),
  }

  if (id) {
    const { error } = await db.from("services").update(record).eq("id", id)
    if (error) return { error: error.message }
    revalidateSite()
    return { id }
  }
  const { data, error } = await db.from("services").insert(record).select("id").single()
  if (error) return { error: error.message }
  revalidateSite()
  return { id: data.id }
}

export async function deleteService(id: string) {
  const db = await requireAdmin()
  const { error } = await db.from("services").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}

// ── 周辺施設 ─────────────────────────────────────────

export type FacilityInput = {
  name: string
  description: string | null
  facility_type_id: string | null
  image_url: string | null
  lat: number
  lng: number
}

export async function saveFacility(id: string | null, input: FacilityInput) {
  const db = await requireAdmin()
  if (id) {
    const { error } = await db.from("facilities").update(input).eq("id", id)
    if (error) return { error: error.message }
  } else {
    const { error } = await db.from("facilities").insert(input)
    if (error) return { error: error.message }
  }
  revalidateSite()
  return {}
}

export async function deleteFacility(id: string) {
  const db = await requireAdmin()
  // 物件との紐付けを外してから削除
  await db.from("property_facilities").delete().eq("facility_id", id)
  const { error } = await db.from("facilities").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}

// ── 著者 ─────────────────────────────────────────────

export type AuthorInput = {
  name: string
  description: string | null
  avatar_url: string | null
}

export async function saveAuthor(id: string | null, input: AuthorInput) {
  const db = await requireAdmin()
  if (id) {
    const { error } = await db.from("authors").update(input).eq("id", id)
    if (error) return { error: error.message }
  } else {
    const { error } = await db.from("authors").insert(input)
    if (error) return { error: error.message }
  }
  revalidateSite()
  return {}
}

export async function deleteAuthor(id: string) {
  const db = await requireAdmin()
  // 使用中の記事から著者を外してから削除
  await db.from("articles").update({ author_id: null }).eq("author_id", id)
  const { error } = await db.from("authors").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}

// ── タグ・記事カテゴリ（マスタ） ─────────────────────

export async function saveTag(id: string | null, name: string) {
  const db = await requireAdmin()
  if (id) {
    const { error } = await db.from("tags").update({ name }).eq("id", id)
    if (error) return { error: error.message }
  } else {
    const { error } = await db.from("tags").insert({ name })
    if (error) return { error: error.message }
  }
  revalidateSite()
  return {}
}

export async function deleteTag(id: string) {
  const db = await requireAdmin()
  // 記事・物件の紐付けを外してから削除
  await db.from("article_tags").delete().eq("tag_id", id)
  await db.from("property_tags").delete().eq("tag_id", id)
  const { error } = await db.from("tags").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}

export async function saveArticleCategory(id: string | null, name: string) {
  const db = await requireAdmin()
  if (id) {
    const { error } = await db.from("article_categories").update({ name }).eq("id", id)
    if (error) return { error: error.message }
  } else {
    const { error } = await db.from("article_categories").insert({ name })
    if (error) return { error: error.message }
  }
  revalidateSite()
  return {}
}

export async function deleteArticleCategory(id: string) {
  const db = await requireAdmin()
  // 使用中の記事からカテゴリを外してから削除
  await db.from("articles").update({ category_id: null }).eq("category_id", id)
  const { error } = await db.from("article_categories").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}

// ── 会社情報 ─────────────────────────────────────────

export async function saveCompanyProfile(
  id: string,
  fields: Record<string, string | null>,
) {
  const db = await requireAdmin()
  const { error } = await db.from("company_profile").update(fields).eq("id", id)
  if (error) return { error: error.message }
  revalidateSite()
  return {}
}
