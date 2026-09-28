import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./SectionHeading";
import { PostCard } from "./PostCard";
import { getPosts } from "@/lib/blog";

export async function BlogPreview() {
  const t = await getTranslations("blog");
  const posts = (await getPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="blog" aria-labelledby="blog-title" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="blog-title" eyebrow={t("eyebrow")} title={t("title")} />
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} readMore={t("readMore")} />
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link href="/blog" className="font-bold text-brand-dark hover:underline">
            {t("viewAll")} →
          </Link>
        </p>
      </div>
    </section>
  );
}
