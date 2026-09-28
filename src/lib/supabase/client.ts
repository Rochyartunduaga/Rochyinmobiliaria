import { createBrowserClient } from "@supabase/ssr";

/** Cliente del navegador (usa la sesión del admin). Se usa para subir imágenes. */
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
