import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export function PostCard({ post, readMore }: { post: PostMeta; readMore: string }) {
  return (
    <article className="flex h-full flex-col border border-sand-deep bg-white">
      {post.cover_url && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image src={post.cover_url} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={post.published_at} className="text-xs tracking-widest text-ink-soft uppercase">
          {formatDate(post.published_at)}
        </time>
        <h3 className="mt-3 text-xl leading-snug">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand-dark">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{post.description}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 text-sm font-bold text-brand-dark hover:underline"
          aria-label={`${readMore}: ${post.title}`}
        >
          {readMore} →
        </Link>
      </div>
    </article>
  );
}
