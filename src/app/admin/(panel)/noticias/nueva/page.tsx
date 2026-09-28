import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { PostEditor } from "../PostEditor";

export const metadata: Metadata = { title: "Nueva noticia" };

export default async function NewPostPage() {
  await requireAdmin();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" }); // AAAA-MM-DD

  return (
    <>
      <h1 className="mb-6 text-3xl">Nueva noticia</h1>
      <PostEditor
        post={{ title: "", slug: "", description: "", content: "", cover_url: null, published: true, published_at: today }}
      />
    </>
  );
}
