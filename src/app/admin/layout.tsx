import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Panel de administración", template: "%s | Admin Oasis" },
  description: "Panel privado para administrar las noticias de Oasis Cartagena.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-sand">{children}</div>;
}
