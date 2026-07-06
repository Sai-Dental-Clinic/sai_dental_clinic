const STORAGE_KEY = 'sai-dental-local-blogs'

export interface LocalBlog {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  image: string
  category: string
  slug: string
  author: string
  tags: string[]
  createdAt: number
}

export function getAllLocalBlogs(): LocalBlog[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as LocalBlog[]
  } catch {
    return []
  }
}

export function getLocalBlogBySlug(slug: string): LocalBlog | undefined {
  return getAllLocalBlogs().find(b => b.slug === slug)
}

export function saveLocalBlog(blog: LocalBlog): void {
  const blogs = getAllLocalBlogs()
  const idx = blogs.findIndex(b => b.slug === blog.slug)
  if (idx >= 0) {
    blogs[idx] = blog
  } else {
    blogs.push(blog)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs))
}

export function deleteLocalBlog(slug: string): void {
  const blogs = getAllLocalBlogs().filter(b => b.slug !== slug)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() || 'untitled'
}
