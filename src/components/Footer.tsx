import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FacebookIcon, InstagramIcon, PhoneIcon, TikTokIcon, YouTubeIcon } from "./icons";
import { site } from "@/lib/site";

const socials = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
] as const;

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink pt-14 pb-24 text-white/85 sm:pb-14">
      <div className="container-page grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-white">
            Oasis <span className="text-brand">Cartagena</span>
          </p>
          <p className="mt-3 text-sm">{t("footer.tagline")}</p>
          <p className="mt-1 text-sm">{site.owner}</p>
        </div>

        <nav aria-label="Pie de página">
          <ul className="space-y-2 text-sm">
            <li><Link href="/#inicio" className="hover:text-brand">{t("nav.home")}</Link></li>
            <li><Link href="/#oasis" className="hover:text-brand">{t("nav.oasis")}</Link></li>
            <li><Link href="/blog" className="hover:text-brand">{t("nav.blog")}</Link></li>
            <li><Link href="/#contacto" className="hover:text-brand">{t("nav.contact")}</Link></li>
          </ul>
        </nav>

        <div>
          <a href={`tel:+${site.whatsapp}`} className="inline-flex items-center gap-2 text-sm hover:text-brand">
            <PhoneIcon className="h-4 w-4" /> {site.phoneDisplay}
          </a>
          <p className="mt-6 mb-3 text-xs font-bold tracking-widest text-brand uppercase">{t("footer.follow")}</p>
          {/* [CONTENIDO PENDIENTE: links reales de redes sociales en src/lib/site.ts] */}
          <ul className="flex gap-3">
            {socials.map(({ key, label, Icon }) => (
              <li key={key}>
                <a
                  href={site.social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 hover:border-brand hover:text-brand"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="container-page mt-12 border-t border-white/10 pt-6 text-xs text-white/70">
        © {year} {site.owner}. {t("footer.rights")}
      </p>
    </footer>
  );
}
