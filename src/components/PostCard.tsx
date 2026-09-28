import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/blog";

export function PostCard({ post, readMore }: { post: PostMeta; readMore: string }) {
  return (
    <article className="flex h-full flex-col border border-sand-deep bg-white p-6">
      <time dateTime={post.date} className="text-xs tracking-widest text-ink-soft uppercase">
        {formatDate(post.date)}
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
    </article>
  );
}
