import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { PostEditor } from "../PostEditor";

export const metadata: Metadata = { title: "Editar noticia" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data: post } = await supabase
    .from("posts")
    .select("id, title, slug, description, content, cover_url, published, published_at")
    .eq("id", id)
    .maybeSingle();
  if (!post) notFound();

  return (
    <>
      <h1 className="mb-6 text-3xl">Editar noticia</h1>
      <PostEditor post={post} />
    </>
  );
}
