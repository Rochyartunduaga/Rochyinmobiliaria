import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Mensajes" };

type Contacto = { id: number; created_at: string; nombre: string; email: string; mensaje: string };

export default async function AdminMessagesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("contactos")
    .select("id, created_at, nombre, email, mensaje")
    .order("created_at", { ascending: false })
    .limit(200);
  const messages = (data ?? []) as Contacto[];

  return (
    <>
      <h1 className="mb-2 text-3xl">Mensajes del formulario</h1>
      <p className="mb-6 text-sm text-ink-soft">Personas que escribieron desde la sección de contacto de la página.</p>

      {messages.length === 0 ? (
        <p className="bg-white p-8 text-center text-ink-soft">Todavía no hay mensajes.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li key={m.id} className="bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-bold">{m.nombre}</p>
                <time dateTime={m.created_at} className="text-xs text-ink-soft">
                  {new Date(m.created_at).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Bogota" })}
                </time>
              </div>
              <a href={`mailto:${m.email}`} className="text-sm text-brand-dark hover:underline">{m.email}</a>
              <p className="mt-3 text-sm whitespace-pre-line">{m.mensaje}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
