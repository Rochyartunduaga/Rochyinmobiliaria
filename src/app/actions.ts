"use server";

import { handleContact, type ContactResult } from "@/lib/contact";

type Values = { name: string; email: string; message: string };

// Devolvemos los valores para repoblar el formulario si hay un error (React lo reinicia tras la acción)
export type ContactState = (ContactResult & { values?: Values }) | null;

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Campo trampa anti-spam: los humanos no lo ven ni lo llenan
  if (formData.get("website")) return { ok: true };

  const values: Values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const result = await handleContact(values);
  return result.ok ? result : { ...result, values };
}
