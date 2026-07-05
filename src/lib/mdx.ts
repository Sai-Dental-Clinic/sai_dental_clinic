import path from "path"
import matter from "gray-matter"
import { serialize } from "next-mdx-remote/serialize"
import type { MDXRemoteSerializeResult } from "next-mdx-remote"

let fs: typeof import("fs") | null = null
try {
  fs = require("fs")
} catch {}

const BLOG_DIR = typeof process !== "undefined" && typeof process.cwd === "function"
  ? path.join(process.cwd(), "src/content/blogs")
  : ""

export interface BlogMeta {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  image: string
  category: string
  author?: string
  tags?: string[]
  featured?: boolean
}

export interface BlogWithContent extends BlogMeta {
  content: MDXRemoteSerializeResult
}

export interface BlogWithRawContent extends BlogMeta {
  content: string
}

/* LIST PAGE */
export function getAllBlogs(): BlogMeta[] {
  if (!fs || !BLOG_DIR) return []
  try {
    return fs
      .readdirSync(BLOG_DIR)
      .filter(file => file.endsWith(".mdx"))
      .map(file => {
        const slug = file.replace(".mdx", "")
        const source = fs!.readFileSync(
          path.join(BLOG_DIR, file),
          "utf8"
        )

        const { data } = matter(source)

        return {
          slug,
          ...(data as Omit<BlogMeta, "slug">),
        }
      })
  } catch {
    return []
  }
}

/* DETAIL PAGE */
export async function getBlogBySlug(
  slug: string
): Promise<BlogWithContent | null> {
  if (!fs || !BLOG_DIR) return null
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null

    const source = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(source)

    const mdxSource = await serialize(content)

    return {
      slug,
      ...(data as Omit<BlogMeta, "slug">),
      content: mdxSource,
    }
  } catch {
    return null
  }
}

/* DETAIL PAGE - RAW CONTENT */
export function getBlogBySlugRaw(
  slug: string
): BlogWithRawContent | null {
  if (!fs || !BLOG_DIR) return null
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null

    const source = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(source)

    return {
      slug,
      ...(data as Omit<BlogMeta, "slug">),
      content,
    }
  } catch {
    return null
  }
}
