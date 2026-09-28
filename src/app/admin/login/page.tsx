import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white p-8 shadow-sm">
        <p className="font-serif text-2xl">
          Oasis <span className="text-brand-dark">Cartagena</span>
        </p>
        <h1 className="mt-1 mb-6 font-sans text-sm tracking-widest text-ink-soft uppercase">Panel de administración</h1>
        <LoginForm />
      </div>
    </main>
  );
}
