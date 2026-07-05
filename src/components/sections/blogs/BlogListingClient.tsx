"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaCalendar, FaClock, FaArrowRight } from "react-icons/fa"
import { BlogMeta } from "@/lib/mdx"
import { getAllLocalBlogs, type LocalBlog } from "@/lib/blog-storage"

interface BlogListingClientProps {
  serverBlogs: BlogMeta[]
}

type MergedBlog = (BlogMeta | LocalBlog) & {
  isLocal: boolean
  _slug: string
  _title: string
  _excerpt: string
  _date: string
  _readTime: string
  _image: string
  _category: string
}

function toMerged(blog: BlogMeta | LocalBlog, isLocal: boolean): MergedBlog {
  return {
    ...blog,
    isLocal,
    _slug: (blog as any).slug,
    _title: (blog as any).title,
    _excerpt: (blog as any).excerpt,
    _date: (blog as any).date,
    _readTime: (blog as any).readTime,
    _image: (blog as any).image,
    _category: (blog as any).category || '',
  }
}

export default function BlogListingClient({ serverBlogs }: BlogListingClientProps) {
  const [blogs, setBlogs] = useState<MergedBlog[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const localBlogs = getAllLocalBlogs()
    const serverSlugs = new Set(serverBlogs.map(b => b.slug))
    const merged = [
      ...serverBlogs.map(b => toMerged(b, false)),
      ...localBlogs
        .filter(b => !serverSlugs.has(b.slug))
        .map(b => toMerged(b, true)),
    ]
    merged.sort((a, b) => new Date(b._date).getTime() - new Date(a._date).getTime())
    setBlogs(merged)
    setLoaded(true)
  }, [serverBlogs])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  if (!loaded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serverBlogs.map(blog => (
          <div key={blog.slug} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {blogs.map(blog => (
        <motion.div key={blog._slug} variants={itemVariants}>
          <Link href={`/blogs/${blog._slug}`} className="group block">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition h-full">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={blog._image}
                  alt={blog._title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition"
                  loading="lazy"
                />
                {blog.isLocal && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Draft
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1">
                      <FaCalendar /> {blog._date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock /> {blog._readTime}
                    </span>
                  </div>
                  {blog._category && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-semibold">
                      {blog._category}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600">
                  {blog._title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                  {blog._excerpt}
                </p>

                <div className="flex items-center text-blue-600 font-semibold mt-auto">
                  Read More <FaArrowRight className="ml-2" />
                </div>
              </div>
            </article>
          </Link>
        </motion.div>
      ))}

      {blogs.length === 0 && (
        <div className="col-span-full text-center py-16 text-gray-500">
          <p className="text-xl">No blogs yet.</p>

        </div>
      )}
    </motion.div>
  )
}
