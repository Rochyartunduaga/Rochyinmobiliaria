import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

export type Post = PostMeta & { content: string };

async function readPost(file: string): Promise<Post> {
  const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.mdx$/, ""),
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    content,
  };
}

export async function getPosts(): Promise<PostMeta[]> {
  const files = (await fs.readdir(BLOG_DIR)).filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(files.map(readPost));
  return posts
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return await readPost(`${slug}.mdx`);
  } catch {
    return null;
  }
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
