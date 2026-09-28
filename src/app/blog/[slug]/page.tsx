import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { CTA } from "@/components/CTA";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const t = await getTranslations("blog");

  return (
    <>
      <article className="container-page max-w-3xl pt-32 pb-20">
        <Link href="/blog" className="text-sm font-bold text-brand-dark hover:underline">
          ← {t("back")}
        </Link>
        <time dateTime={post.date} className="mt-8 block text-xs tracking-widest text-ink-soft uppercase">
          {formatDate(post.date)}
        </time>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-ink-soft">{post.description}</p>
        <div aria-hidden className="mt-8 h-px w-16 bg-brand" />
        <div className="prose-oasis mt-8">
          <MDXRemote source={post.content} />
        </div>
      </article>
      <CTA />
    </>
  );
}
