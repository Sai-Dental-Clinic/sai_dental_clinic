import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { FaCalendar, FaUser, FaClock, FaShareAlt } from "react-icons/fa"

import ContentContainer from "@/components/common-ui/containers/ContentContainer"

import { getBlogBySlugRaw, getAllBlogs } from "@/lib/mdx"
import { renderMdxToHtml } from "@/lib/mdx-to-html"
import PageHeading from "@/components/common-ui/headers/PageHeading"
import LocalBlogDetail from "@/components/sections/blogs/LocalBlogDetail"

export const dynamicParams = true

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params

  const blog = getBlogBySlugRaw(slug)

  if (!blog) {
    return <LocalBlogDetail slug={slug} />
  }

  const htmlContent = await renderMdxToHtml(blog.content)

  const relatedBlogs = (await getAllBlogs())
    .filter(b => b.slug !== slug)
    .slice(0, 3)

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

        {blog.tags && (
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {blog.tags.map(tag => (
              <span
                key={tag}
                className="px-5 py-2 rounded-full text-sm font-semibold
                    bg-blue-50 text-blue-700
                    border border-blue-100
                    hover:bg-blue-100 transition"
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

      <div className="max-w-4xl mx-auto">
        <div className="py-8 border-t border-b border-gray-200 mb-12">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-semibold text-lg">
              Share this article:
            </span>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `${blog.title} - ${blog.excerpt}`
              )}`}
              target="_blank"
              className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
            >
              <FaShareAlt className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">
            Related Articles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map(related => (
              <Link
                key={related.slug}
                href={`/blogs/${related.slug}`}
                className="block p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg"
              >
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                  {related.title}
                </h4>

                <p className="text-gray-600 line-clamp-3 mb-4">
                  {related.excerpt}
                </p>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">{related.category}</span>
                  <span>{related.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ContentContainer>
  )
}
