"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FaCalendar, FaUser, FaClock } from "react-icons/fa"
import ContentContainer from "@/components/common-ui/containers/ContentContainer"
import PageHeading from "@/components/common-ui/headers/PageHeading"
import { getLocalBlogBySlug, type LocalBlog } from "@/lib/blog-storage"

interface LocalBlogDetailProps {
  slug: string
}

function textToHtml(text: string): string {
  let html = text

  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-10 mb-4">$1</h1>')

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^\d+[.)] (.+)$/gm, '<li>$1</li>')

  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul class="list-disc pl-6 space-y-1 mb-6">$&</ul>')

  html = html.replace(/\n{3,}/g, '\n\n')

  const blocks = html.split(/\n{2,}/)
  html = blocks
    .map(block => {
      const b = block.trim()
      if (!b) return ''
      if (/^<[hul]/.test(b)) return b
      if (/^<\/[hul]>/.test(b)) return b
      return `<p class="text-gray-700 leading-relaxed mb-6">${b.replace(/\n/g, '<br/>')}</p>`
    })
    .join('\n')

  html = html.replace(/<\/ul>\s*<ul[^>]*>/g, '')

  return html
}

export default function LocalBlogDetail({ slug }: LocalBlogDetailProps) {
  const [blog, setBlog] = useState<LocalBlog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = getLocalBlogBySlug(slug)
    setBlog(found || null)
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <ContentContainer>
        <div className="py-24 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        </div>
      </ContentContainer>
    )
  }

  if (!blog) {
    return (
      <ContentContainer>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h2>
          <Link href="/blogs" className="text-blue-600 hover:underline">
            Back to Blogs
          </Link>
        </div>
      </ContentContainer>
    )
  }

  const htmlContent = textToHtml(blog.content)

  return (
    <ContentContainer>
      <div className="py-12 text-center">
        {blog.category && (
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
            {blog.category}
          </span>
        )}

        <PageHeading className="text-4xl md:text-5xl mb-6">
          {blog.title}
        </PageHeading>

        <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600 mb-8">
          <div className="flex items-center gap-2">
            <FaCalendar className="w-4 h-4" />
            <span>{blog.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaClock className="w-4 h-4" />
            <span>{blog.readTime}</span>
          </div>

          {blog.author && (
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
          )}
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {blog.tags.map(tag => (
              <span
                key={tag}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {blog.image && (
        <div className="mb-12 rounded-xl overflow-hidden">
          <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg md:prose-xl max-w-none mb-12
          prose-headings:font-semibold
          prose-headings:text-gray-900
          prose-p:text-gray-700
          prose-p:leading-relaxed
          prose-ul:space-y-2
          prose-li:marker:text-blue-500
          prose-a:text-blue-600
          prose-strong:text-gray-900
        ">
          <div className="mb-10">
            <p className="text-xl font-medium text-gray-700 leading-relaxed">
              {blog.excerpt}
            </p>
          </div>

          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center py-8">
        <Link
          href="/blogs"
          className="text-blue-600 font-semibold hover:underline"
        >
          ← Back to Blogs
        </Link>
      </div>
    </ContentContainer>
  )
}
