"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export type FormState = { error?: string } | null;

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: "Correo o contraseña incorrectos." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const postSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres.").max(200),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "La dirección solo puede tener minúsculas, números y guiones.")
    .max(80),
  description: z.string().trim().max(300, "El resumen no puede pasar de 300 caracteres."),
  content: z.string(),
  cover_url: z.url().nullable(),
  published: z.boolean(),
  published_at: z.iso.date("Fecha inválida."),
});

/** Actualiza el blog público, el inicio y el sitemap después de cualquier cambio. */
function refreshSite() {
  revalidatePath("/", "layout");
}

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const parsed = postSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    content: formData.get("content") ?? "",
    cover_url: formData.get("cover_url") || null,
    published: formData.get("published") === "on",
    published_at: formData.get("published_at"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { id, ...post } = parsed.data;
  const { error } = id
    ? await supabase.from("posts").update(post).eq("id", id)
    : await supabase.from("posts").insert(post);

  if (error) {
    if (error.code === "23505") return { error: "Ya existe una noticia con esa dirección (slug). Cámbiala." };
    console.error("[admin] Error guardando noticia", error);
    return { error: "No se pudo guardar. Inténtalo de nuevo." };
  }

  refreshSite();
  redirect(`/admin?ok=${post.published ? "publicada" : "guardada"}`);
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const { data: post } = await supabase.from("posts").select("cover_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    console.error("[admin] Error borrando noticia", error);
    redirect("/admin?error=borrar");
  }

  // Borra también la portada del Storage si estaba subida al bucket del blog
  const path = post?.cover_url?.split("/storage/v1/object/public/blog/")[1];
  if (path) await supabase.storage.from("blog").remove([decodeURIComponent(path)]);

  refreshSite();
  redirect("/admin?ok=eliminada");
}
