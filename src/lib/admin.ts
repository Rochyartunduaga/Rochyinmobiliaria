import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Verifica en el servidor que haya sesión y que el usuario esté en la tabla `admins`.
 * Supabase (RLS) vuelve a verificarlo en cada consulta, así que esto es una segunda barrera.
 */
export async function getAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  return { supabase, user, isAdmin: isAdmin === true };
}

/** Igual que getAdmin, pero corta la ejecución si el usuario no es administrador. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin.isAdmin) redirect("/admin");
  return admin;
}
