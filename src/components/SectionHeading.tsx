type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
  tone?: "light" | "dark";
};

export function SectionHeading({ eyebrow, title, intro, id, tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className={`mb-3 text-xs font-bold tracking-[0.25em] uppercase ${dark ? "text-brand" : "text-brand-dark"}`}>
        {eyebrow}
      </p>
      <h2 id={id} className={`text-3xl leading-tight sm:text-4xl ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      <div aria-hidden className="mx-auto mt-5 h-px w-16 bg-brand" />
      {intro && <p className={`mt-5 text-base leading-relaxed ${dark ? "text-white/85" : "text-ink-soft"}`}>{intro}</p>}
    </div>
  );
}
