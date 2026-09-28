import Link from "next/link";
import { getAdmin } from "@/lib/admin";
import { signOut } from "../actions";
import { AdminNav } from "./AdminNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await getAdmin();

  return (
    <>
      <header className="bg-ink text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <Link href="/admin" className="font-serif text-lg">
            Oasis <span className="text-brand">Admin</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="hover:text-brand">Ver sitio ↗</Link>
            <form action={signOut}>
              <button type="submit" className="rounded-full border border-white/30 px-3 py-1 hover:border-brand hover:text-brand">
                Salir
              </button>
            </form>
          </div>
        </div>
        {isAdmin && <AdminNav />}
      </header>

      <main className="container-page py-8">
        {isAdmin ? (
          children
        ) : (
          <div className="bg-white p-8 shadow-sm">
            <h1 className="text-2xl">Sin permisos de administrador</h1>
            <p className="mt-3 text-ink-soft">
              Iniciaste sesión como <strong>{user.email}</strong>, pero este usuario no tiene acceso al panel. Pide al
              responsable de la página que lo agregue como administrador.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
