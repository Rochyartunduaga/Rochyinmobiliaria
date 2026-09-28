import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/SectionHeading";
import { PostCard } from "@/components/PostCard";
import { getPosts } from "@/lib/blog";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return { title: t("title"), description: t("metaDescription") };
}

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const posts = await getPosts();

  return (
    <div className="bg-sand pt-32 pb-24">
      <div className="container-page">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} readMore={t("readMore")} />
          ))}
        </div>
      </div>
    </div>
  );
}
