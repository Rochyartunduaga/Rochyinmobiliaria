import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  message: z.string().trim().min(10).max(3000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: "invalid"; fields: Partial<Record<keyof ContactInput, true>> }
  | { ok: false; reason: "error" };

/** Valida y envía el mensaje. Compartido por la Server Action y la ruta /api/contact. */
export async function handleContact(raw: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Partial<Record<keyof ContactInput, true>> = {};
    for (const issue of parsed.error.issues) fields[issue.path[0] as keyof ContactInput] = true;
    return { ok: false, reason: "invalid", fields };
  }

  const data = parsed.data;
  const channels = [saveToSupabase, sendEmail];
  const results = await Promise.all(channels.map((send) => send(data)));
  const configured = results.filter((r) => r !== "skipped");

  if (configured.length === 0) {
    console.info("[contacto] Supabase y Resend sin configurar. Mensaje recibido:", data);
    return { ok: true };
  }
  // Basta con que un canal funcione para no perder el contacto
  return configured.includes("sent") ? { ok: true } : { ok: false, reason: "error" };
}

type ChannelResult = "sent" | "failed" | "skipped";

/** Guarda el mensaje en la tabla `contactos` (ver supabase/schema.sql) vía la API REST. */
async function saveToSupabase({ name, email, message }: ContactInput): Promise<ChannelResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return "skipped";

  try {
    const res = await fetch(`${url}/rest/v1/contactos`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        // La clave pública no puede leer la tabla, así que no pedimos la fila de vuelta
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ nombre: name, email, mensaje: message }),
    });
    if (!res.ok) {
      console.error("[contacto] Supabase respondió", res.status, await res.text());
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[contacto] Error guardando en Supabase", err);
    return "failed";
  }
}

/** Envía el mensaje por correo con Resend (opcional). */
async function sendEmail({ name, email, message }: ContactInput): Promise<ChannelResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return "skipped";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Oasis Web <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `Nuevo contacto web Oasis: ${name}`,
        text: `Nombre: ${name}\nCorreo: ${email}\n\n${message}`,
      }),
    });
    if (!res.ok) {
      console.error("[contacto] Resend respondió", res.status, await res.text());
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[contacto] Error enviando correo", err);
    return "failed";
  }
}
