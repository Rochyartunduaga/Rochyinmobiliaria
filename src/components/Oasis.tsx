import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./SectionHeading";
import { Media } from "./Media";
import { HandshakeIcon, MapPinIcon, SunIcon, TrendIcon } from "./icons";
import { site } from "@/lib/site";

const featureKeys = [
  { key: "location", Icon: MapPinIcon },
  { key: "growth", Icon: TrendIcon },
  { key: "tourism", Icon: SunIcon },
  { key: "advisory", Icon: HandshakeIcon },
] as const;

export async function Oasis() {
  const t = await getTranslations("oasis");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section id="oasis" aria-labelledby="oasis-title" className="bg-sand py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="oasis-title" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureKeys.map(({ key, Icon }) => (
            <li key={key} className="rounded-sm border border-sand-deep bg-white p-6 shadow-sm">
              <Icon className="h-8 w-8 text-brand-dark" />
              <h3 className="mt-4 text-xl">{t(`features.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(`features.${key}.text`)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 bg-ink px-6 py-10 text-white">
          <h3 className="sr-only">{t("statsTitle")}</h3>
          <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-xs tracking-widest text-white/80 uppercase">{s.label}</dt>
                <dd className="font-serif text-3xl text-brand">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-20">
          <h3 className="mb-6 text-center text-2xl">{t("galleryTitle")}</h3>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {site.images.gallery.map((src, i) => (
              <li key={i} className={`relative overflow-hidden ${i === 0 ? "col-span-2 aspect-[16/9] md:row-span-2 md:aspect-auto" : "aspect-square"}`}>
                <Media
                  src={src}
                  alt={`${t("galleryAlt")} ${i + 1}`}
                  pending={t("galleryPending")}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="transition-transform duration-500 hover:scale-105"
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20">
          <h3 className="mb-6 text-center text-2xl">{t("videoTitle")}</h3>
          <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden bg-ink shadow-xl">
            {site.videoEmbedUrl ? (
              <iframe
                src={site.videoEmbedUrl}
                title={t("videoTitle")}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <Media alt={t("videoTitle")} pending={t("videoPending")} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
