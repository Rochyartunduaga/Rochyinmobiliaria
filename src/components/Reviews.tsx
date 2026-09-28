import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./SectionHeading";

type Review = { quote: string; name: string; role: string };

export async function Reviews() {
  const t = await getTranslations("reviews");
  const items = t.raw("items") as Review[];

  return (
    <section id="resenas" aria-labelledby="resenas-title" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="resenas-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="grid gap-6 md:grid-cols-3">
          {items.map((r, i) => (
            <li key={i}>
              <figure className="h-full border-t-2 border-brand bg-sand p-8">
                <span aria-hidden className="font-serif text-5xl leading-none text-brand-dark">
                  “
                </span>
                <blockquote className="mt-2 font-serif text-lg leading-relaxed text-ink italic">{r.quote}</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="block font-bold">{r.name}</span>
                  <span className="text-ink-soft">{r.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
