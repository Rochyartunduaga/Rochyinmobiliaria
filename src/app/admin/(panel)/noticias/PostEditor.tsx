"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { savePost, type FormState } from "../../actions";
import { buttonSecondary, inputClass, labelClass } from "../../ui";
import { Markdown } from "@/components/Markdown";
import { slugify } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

export type EditablePost = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_url: string | null;
  published: boolean;
  published_at: string;
};

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Sube una imagen al bucket `blog` de Supabase y devuelve su URL pública. */
async function uploadImage(file: File): Promise<string> {
  if (!TYPES.includes(file.type)) throw new Error("Formato no permitido. Usa JPG, PNG o WebP.");
  if (file.size > MAX_BYTES) throw new Error("La imagen pesa más de 5 MB. Redúcela e inténtalo de nuevo.");

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagen";
  const path = `${new Date().getFullYear()}/${Date.now()}-${base}.${ext}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from("blog").upload(path, file, { contentType: file.type });
  if (error) throw new Error("No se pudo subir la imagen. Inténtalo de nuevo.");
  return supabase.storage.from("blog").getPublicUrl(path).data.publicUrl;
}

export function PostEditor({ post }: { post: EditablePost }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, null);
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  // En noticias nuevas la dirección sigue al título hasta que la editen a mano
  const [slugTouched, setSlugTouched] = useState(Boolean(post.id));
  const [description, setDescription] = useState(post.description);
  const [published, setPublished] = useState(post.published);
  const [publishedAt, setPublishedAt] = useState(post.published_at);
  const [content, setContent] = useState(post.content);
  const [cover, setCover] = useState(post.cover_url);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState<"cover" | "inline" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** Envuelve la selección del texto (o inserta en el cursor) con marcas Markdown. */
  const insert = (before: string, after = "", placeholder = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = content.slice(s, e) || placeholder;
    const next = content.slice(0, s) + before + selected + after + content.slice(e);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  };

  const handleUpload = async (file: File | undefined, kind: "cover" | "inline") => {
    if (!file) return;
    setUploadError(null);
    setUploading(kind);
    try {
      const url = await uploadImage(file);
      if (kind === "cover") setCover(url);
      else insert("![", `](${url})`, "Descripción de la imagen");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Error subiendo la imagen.");
    } finally {
      setUploading(null);
    }
  };

  const toolbar = [
    { label: "Título", title: "Subtítulo", run: () => insert("\n## ", "\n", "Subtítulo") },
    { label: "N", title: "Negrita", run: () => insert("**", "**", "texto") },
    { label: "I", title: "Cursiva", run: () => insert("_", "_", "texto") },
    { label: "• Lista", title: "Lista", run: () => insert("\n- ", "", "elemento") },
    { label: "Cita", title: "Cita destacada", run: () => insert("\n> ", "\n", "cita") },
    { label: "Enlace", title: "Enlace", run: () => insert("[", "](https://)", "texto del enlace") },
  ];

  return (
    <form action={action} className="space-y-6">
      {post.id && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="cover_url" value={cover ?? ""} />
      <input type="hidden" name="content" value={content} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6 bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="title" className={labelClass}>Título</label>
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className={`${inputClass} font-serif text-xl`}
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>Dirección de la noticia</label>
            <div className="mt-1 flex items-center rounded-sm border border-sand-deep bg-sand/50 text-sm">
              <span className="pl-3 text-ink-soft">/blog/</span>
              <input
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                className="w-full bg-transparent px-1 py-2.5 outline-none"
                aria-describedby="slug-help"
              />
            </div>
            <p id="slug-help" className="mt-1 text-xs text-ink-soft">
              Se crea sola con el título. Evita cambiarla después de publicar: los enlaces compartidos dejarían de funcionar.
            </p>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Resumen</label>
            <textarea
              id="description"
              name="description"
              rows={2}
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Una o dos frases. Se muestra en la tarjeta del blog y en Google."
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={labelClass}>Contenido</span>
              <div role="tablist" className="flex rounded-full border border-sand-deep p-0.5 text-sm">
                {(["write", "preview"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={`rounded-full px-3 py-1 ${tab === t ? "bg-ink text-white" : "text-ink-soft"}`}
                  >
                    {t === "write" ? "Escribir" : "Vista previa"}
                  </button>
                ))}
              </div>
            </div>

            {tab === "write" ? (
              <>
                <div className="mt-2 flex flex-wrap gap-1 rounded-t-sm border border-b-0 border-sand-deep bg-sand/50 p-1.5">
                  {toolbar.map((b) => (
                    <button
                      key={b.title}
                      type="button"
                      title={b.title}
                      aria-label={b.title}
                      onClick={b.run}
                      className="rounded px-2.5 py-1 text-sm font-bold hover:bg-white"
                    >
                      {b.label}
                    </button>
                  ))}
                  <label className="cursor-pointer rounded px-2.5 py-1 text-sm font-bold hover:bg-white">
                    {uploading === "inline" ? "Subiendo…" : "Imagen"}
                    <input
                      type="file"
                      accept={TYPES.join(",")}
                      className="sr-only"
                      disabled={uploading !== null}
                      onChange={(e) => {
                        handleUpload(e.target.files?.[0], "inline");
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <textarea
                  ref={textareaRef}
                  aria-label="Contenido de la noticia"
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe aquí la noticia. Usa los botones de arriba para dar formato."
                  className="block w-full rounded-b-sm border border-sand-deep bg-white px-3 py-2.5 font-mono text-sm leading-relaxed focus:border-brand-dark"
                />
              </>
            ) : (
              <div className="mt-2 min-h-[20rem] rounded-sm border border-sand-deep p-5">
                {content.trim() ? <Markdown>{content}</Markdown> : <p className="text-ink-soft">Nada que mostrar todavía.</p>}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="space-y-4 bg-white p-6 shadow-sm">
            <label className="flex items-center gap-3">
              <input type="checkbox" name="published" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-5 w-5 accent-[#8a6326]" />
              <span className="font-bold">Publicada</span>
            </label>
            <p className="text-xs text-ink-soft">Si no la marcas, se guarda como borrador y no aparece en el blog.</p>
            <div>
              <label htmlFor="published_at" className={labelClass}>Fecha</label>
              <input id="published_at" name="published_at" type="date" required value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="bg-white p-6 shadow-sm">
            <p className={labelClass}>Imagen de portada</p>
            {cover ? (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- vista previa de una imagen recién subida */}
                <img src={cover} alt="Portada actual" className="aspect-[16/9] w-full object-cover" />
                <button type="button" onClick={() => setCover(null)} className="mt-2 text-sm text-red-700 hover:underline">
                  Quitar portada
                </button>
              </div>
            ) : (
              <p className="mt-2 text-xs text-ink-soft">JPG, PNG o WebP de máximo 5 MB. Ideal horizontal.</p>
            )}
            <label className={`${buttonSecondary} mt-3 w-full cursor-pointer`}>
              {uploading === "cover" ? "Subiendo…" : cover ? "Cambiar imagen" : "Subir imagen"}
              <input
                type="file"
                accept={TYPES.join(",")}
                className="sr-only"
                disabled={uploading !== null}
                onChange={(e) => {
                  handleUpload(e.target.files?.[0], "cover");
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {uploadError && <p role="alert" className="text-sm font-bold text-red-700">{uploadError}</p>}
          {state?.error && <p role="alert" className="text-sm font-bold text-red-700">{state.error}</p>}

          <div className="flex flex-col gap-2">
            <button type="submit" disabled={pending || uploading !== null} className="btn-primary disabled:opacity-60">
              {pending ? "Guardando…" : "Guardar"}
            </button>
            <Link href="/admin" className={buttonSecondary}>Cancelar</Link>
          </div>
        </aside>
      </div>
    </form>
  );
}
