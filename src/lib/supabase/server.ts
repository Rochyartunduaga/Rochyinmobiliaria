import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY as key, SUPABASE_URL as url } from "./config";

/** Cliente con la sesión del usuario (cookies). Usar en el panel /admin y sus acciones. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Llamado desde un Server Component: el proxy se encarga de refrescar la sesión
        }
      },
    },
  });
}

/** Cliente público sin sesión: permite que las páginas del blog se generen de forma estática. */
export function createPublicClient() {
  return createPlainClient(url, key, { auth: { persistSession: false } });
}
