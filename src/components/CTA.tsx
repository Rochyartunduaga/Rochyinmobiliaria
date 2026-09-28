import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "./icons";
import { whatsappLink } from "@/lib/site";

export async function CTA() {
  const t = await getTranslations("cta");
  return (
    <section aria-labelledby="cta-title" className="bg-ink py-20 text-center text-white">
      <div className="container-page max-w-3xl">
        <h2 id="cta-title" className="text-3xl sm:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/85">{t("text")}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={whatsappLink(t("whatsappMessage"))} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <WhatsAppIcon className="h-5 w-5" />
            {t("whatsapp")}
          </a>
          <Link href="/#agenda" className="btn-outline">
            {t("book")}
          </Link>
        </div>
      </div>
    </section>
  );
}
