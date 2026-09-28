"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CloseIcon, MenuIcon } from "./icons";

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = usePathname() === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#inicio", label: t("home") },
    { href: "/#oasis", label: t("oasis") },
    { href: "/#resenas", label: t("reviews") },
    { href: "/blog", label: t("blog") },
    { href: "/#contacto", label: t("contact") },
  ];

  // Fuera del inicio no hay hero oscuro detrás, así que el header siempre es sólido
  const solid = scrolled || open || !isHome;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors ${solid ? "bg-ink shadow-lg" : "bg-gradient-to-b from-ink/70 to-transparent"}`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/#inicio" className="font-serif text-xl text-white" onClick={() => setOpen(false)}>
          {/* [CONTENIDO PENDIENTE: logo] */}
          Oasis <span className="text-brand">Cartagena</span>
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-white">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#agenda" className="btn-primary !px-5 !py-2">
                {t("cta")}
              </Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="rounded p-2 text-white md:hidden"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Principal móvil" className="border-t border-white/10 bg-ink md:hidden">
          <ul className="container-page flex flex-col gap-1 py-4 text-white">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-3 text-lg" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/#agenda" className="btn-primary w-full" onClick={() => setOpen(false)}>
                {t("cta")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
