import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPublishedPost, getPublishedPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { CTA } from "@/components/CTA";
import { Markdown } from "@/components/Markdown";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: post.cover_url ? { images: [post.cover_url] } : undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const t = await getTranslations("blog");

  return (
    <>
      <article className="container-page max-w-3xl pt-32 pb-20">
        <Link href="/blog" className="text-sm font-bold text-brand-dark hover:underline">
          ← {t("back")}
        </Link>
        <time dateTime={post.published_at} className="mt-8 block text-xs tracking-widest text-ink-soft uppercase">
          {formatDate(post.published_at)}
        </time>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{post.title}</h1>
        {post.description && <p className="mt-4 text-lg text-ink-soft">{post.description}</p>}
        {post.cover_url ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden">
            <Image src={post.cover_url} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        ) : (
          <div aria-hidden className="mt-8 h-px w-16 bg-brand" />
        )}
        <div className="mt-8">
          <Markdown>{post.content}</Markdown>
        </div>
      </article>
      <CTA />
    </>
  );
}
