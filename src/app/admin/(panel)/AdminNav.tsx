"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Noticias", match: (p: string) => p === "/admin" || p.startsWith("/admin/noticias") },
  { href: "/admin/mensajes", label: "Mensajes", match: (p: string) => p.startsWith("/admin/mensajes") },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Panel" className="container-page flex gap-1">
      {items.map((i) => {
        const active = i.match(pathname);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 px-3 py-2 text-sm ${active ? "border-brand text-white" : "border-transparent text-white/70 hover:text-white"}`}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
