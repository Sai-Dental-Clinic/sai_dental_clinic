"use client"

import { useEffect, useState } from "react"
import BlogsSection from "./BlogsSection"
import { getAllLocalBlogs } from "@/lib/blog-storage"
import { blogsData, type BlogDetailData, type BlogSectionData } from "@/data/blog/blogs"

export default function HomeBlogsSection() {
  const [data, setData] = useState<BlogSectionData>(blogsData)

  useEffect(() => {
    const localBlogs = getAllLocalBlogs()

    fetch("/api/blogs")
      .then(r => r.json())
      .then((res: { blogs?: any[] }) => {
        const serverBlogs = (res.blogs || []) as BlogDetailData[]

        const hardcodedSlugs = new Set(blogsData.blogs.map(b => b.slug))
        const serverSlugs = new Set(serverBlogs.map(b => b.slug))

        const localMapped: BlogDetailData[] = localBlogs
          .filter(b => !serverSlugs.has(b.slug) && !hardcodedSlugs.has(b.slug))
          .map(b => ({
            id: parseInt(b.id, 10) || Date.now(),
            title: b.title,
            excerpt: b.excerpt,
            date: b.date,
            readTime: b.readTime,
            image: b.image,
            category: b.category,
            slug: b.slug,
            author: b.author,
            tags: b.tags,
          }))

        const hardcodedDetails = new Map(
          blogsData.blogs.map(b => [b.slug, b])
        )

        const serverMapped: BlogDetailData[] = serverBlogs
          .filter(b => !hardcodedSlugs.has(b.slug))
          .map(b => ({
            ...(hardcodedDetails.get(b.slug) || {}),
            ...b,
            id: parseInt((b as any).id, 10) || Date.now(),
          }))

        const all = [...blogsData.blogs, ...serverMapped, ...localMapped]
        all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        const latest = all.slice(0, 6)

        setData({ ...blogsData, blogs: latest })
      })
      .catch(() => {
        const all = [...blogsData.blogs]
        all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setData({ ...blogsData, blogs: all.slice(0, 6) })
      })
  }, [])

  return <BlogsSection data={data} />
}
