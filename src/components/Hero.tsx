import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Media } from "./Media";
import { site } from "@/lib/site";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink">
      <Media
        src={site.images.hero}
        alt={t("imageAlt")}
        pending="foto o render principal del proyecto / atardecer en Cartagena"
        priority
        labelAt="top"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />

      <div className="container-page relative pt-28 pb-16 sm:pb-24">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-brand uppercase">{t("eyebrow")}</p>
        <h1 id="hero-title" className="max-w-3xl text-4xl leading-[1.1] text-white sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{t("subtitle")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/#contacto" className="btn-primary">
            {t("primary")}
          </Link>
          <Link href="/#oasis" className="btn-outline text-white">
            {t("secondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
