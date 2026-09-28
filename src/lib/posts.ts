import { createPublicClient } from "@/lib/supabase/server";

export type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  cover_url: string | null;
  published: boolean;
  published_at: string;
  updated_at: string;
};

export type PostMeta = Pick<Post, "slug" | "title" | "description" | "cover_url" | "published_at">;

const META_FIELDS = "slug, title, description, cover_url, published_at";

/** Noticias publicadas, más recientes primero (lectura pública). */
export async function getPublishedPosts(limit?: number): Promise<PostMeta[]> {
  let query = createPublicClient()
    .from("posts")
    .select(META_FIELDS)
    .eq("published", true)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("[blog] Error leyendo noticias", error.message);
    return [];
  }
  return data;
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const { data, error } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) console.error("[blog] Error leyendo noticia", error.message);
  return data;
}
