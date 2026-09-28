import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./SectionHeading";
import { ContactForm } from "./ContactForm";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { site, whatsappLink } from "@/lib/site";

export async function Contact() {
  const t = await getTranslations("contact");
  const tc = await getTranslations("cta");
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="bg-sand py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="contacto-title" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="bg-white p-6 shadow-sm sm:p-10">
            <h3 className="mb-6 text-2xl">{t("formTitle")}</h3>
            <ContactForm />
            <div className="mt-8 flex flex-col gap-3 border-t border-sand-deep pt-6 text-sm sm:flex-row sm:gap-6">
              <a href={`tel:+${site.whatsapp}`} className="inline-flex items-center gap-2 text-brand-dark hover:underline">
                <PhoneIcon className="h-4 w-4" /> {site.phoneDisplay}
              </a>
              <a
                href={whatsappLink(tc("whatsappMessage"))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-dark hover:underline"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div id="agenda" className="scroll-mt-24 bg-white p-6 shadow-sm sm:p-10">
            <h3 className="mb-6 text-2xl">{t("bookingTitle")}</h3>
            {site.calendlyUrl ? (
              <iframe
                src={`${site.calendlyUrl}?hide_gdpr_banner=1`}
                title={t("bookingTitle")}
                loading="lazy"
                className="h-[640px] w-full border-0"
              />
            ) : (
              <p className="border border-dashed border-ink-soft/40 p-6 text-sm text-ink-soft">
                [CONTENIDO PENDIENTE: {t("bookingPending")}]
              </p>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h3 className="mb-4 text-2xl">{t("mapTitle")}</h3>
          {/* [CONTENIDO PENDIENTE: dirección exacta del proyecto en src/lib/site.ts → mapQuery] */}
          <div className="relative aspect-[4/3] overflow-hidden shadow-sm sm:aspect-[21/9]">
            <iframe
              src={mapSrc}
              title={t("mapFrameTitle")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
