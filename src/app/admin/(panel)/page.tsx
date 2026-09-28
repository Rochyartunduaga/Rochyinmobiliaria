import type { Metadata } from "next";
import Link from "next/link";
import { getAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { DeletePostButton } from "./DeletePostButton";

export const metadata: Metadata = { title: "Noticias" };

const notices: Record<string, string> = {
  publicada: "Noticia publicada. Ya se ve en el blog.",
  guardada: "Noticia guardada como borrador (no se ve en el blog).",
  eliminada: "Noticia eliminada.",
};

type Props = { searchParams: Promise<{ ok?: string; error?: string }> };

export default async function AdminPostsPage({ searchParams }: Props) {
  // El layout muestra el aviso de "sin permisos"; aquí solo evitamos cargar datos
  const { supabase, isAdmin } = await getAdmin();
  if (!isAdmin) return null;

  const { ok, error } = await searchParams;
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, published, published_at, updated_at")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">Noticias</h1>
        <Link href="/admin/noticias/nueva" className="btn-primary">+ Nueva noticia</Link>
      </div>

      {ok && notices[ok] && (
        <p role="status" className="mb-6 border-l-4 border-brand bg-white p-4">{notices[ok]}</p>
      )}
      {error && (
        <p role="alert" className="mb-6 border-l-4 border-red-700 bg-white p-4">No se pudo completar la acción. Inténtalo de nuevo.</p>
      )}

      {!posts?.length ? (
        <p className="bg-white p-8 text-center text-ink-soft">Aún no hay noticias. Crea la primera con “Nueva noticia”.</p>
      ) : (
        <ul className="divide-y divide-sand-deep bg-white shadow-sm">
          {posts.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.published ? "bg-green-100 text-green-800" : "bg-sand-deep text-ink-soft"}`}
                  >
                    {p.published ? "Publicada" : "Borrador"}
                  </span>
                  <time dateTime={p.published_at} className="text-xs text-ink-soft">{formatDate(p.published_at)}</time>
                </div>
                <Link href={`/admin/noticias/${p.id}`} className="mt-1 block truncate font-bold hover:text-brand-dark">
                  {p.title}
                </Link>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 text-sm">
                <Link href={`/admin/noticias/${p.id}`} className="rounded-full border border-ink/20 px-3 py-1 font-bold hover:border-ink">
                  Editar
                </Link>
                {p.published && (
                  <Link href={`/blog/${p.slug}`} target="_blank" className="rounded-full border border-ink/20 px-3 py-1 hover:border-ink">
                    Ver ↗
                  </Link>
                )}
                <DeletePostButton id={p.id} title={p.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
