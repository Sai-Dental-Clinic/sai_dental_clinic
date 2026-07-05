"use client"

import { useEffect, useState, useRef } from "react"
import { FaTrash, FaEdit, FaEye } from "react-icons/fa"
import ContentContainer from "@/components/common-ui/containers/ContentContainer"
import PageHeading from "@/components/common-ui/headers/PageHeading"
import {
  getAllLocalBlogs,
  saveLocalBlog,
  deleteLocalBlog,
  slugify,
  type LocalBlog,
} from "@/lib/blog-storage"
import { plainTextToMarkdown } from "@/lib/plain-text-to-markdown"

type FormMode = "create" | "edit"

export default function WritePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [authenticated, setAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [checkingPassword, setCheckingPassword] = useState(false)

  const [blogs, setBlogs] = useState<LocalBlog[]>([])
  const [serverBlogs, setServerBlogs] = useState<{ slug: string; title: string; date: string; readTime: string; image?: string }[]>([])
  const [mode, setMode] = useState<FormMode>("create")
  const [editingSlug, setEditingSlug] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [author, setAuthor] = useState("Dr. S.K.Srinivas")
  const [image, setImage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const passwordRef = useRef("")

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setCheckingPassword(true)
    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      })
      if (res.ok) {
        passwordRef.current = passwordInput
        setAuthenticated(true)
      } else {
        setPasswordError("Incorrect password")
      }
    } catch {
      setPasswordError("Something went wrong")
    } finally {
      setCheckingPassword(false)
    }
  }

  const refreshList = () => {
    setBlogs(getAllLocalBlogs())
  }

  useEffect(() => {
    refreshList()
    fetch("/api/blogs")
      .then(r => r.json())
      .then(res => setServerBlogs(res.blogs || []))
      .catch(() => {})
  }, [])

  const resetForm = () => {
    setTitle("")
    setExcerpt("")
    setContent("")
    setCategory("")
    setTagsInput("")
    setAuthor("Dr. S.K.Srinivas")
    setImage("")
    setImageFile(null)
    setImagePreview("")
    setShowPreview(false)
    setSaved(false)
    setError("")
    setMessage("")
    setMode("create")
    setEditingSlug(null)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB")
      return
    }

    setImageFile(file)
    setError("")

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setImagePreview(dataUrl)
      setImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage("")
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleAutoFormat = () => {
    if (!content.trim()) return
    const formatted = plainTextToMarkdown(content)
    setContent(formatted)
    setMessage("Content auto-formatted as markdown!")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleSave = async () => {
    setError("")

    if (!title.trim()) {
      setError("Title is required")
      return
    }
    if (!content.trim()) {
      setError("Content is required")
      return
    }

    const finalContent = plainTextToMarkdown(content)

    const slug = slugify(title)
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    const tags = tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean)

    const wordCount = finalContent.trim().split(/\s+/).length
    const readTimeMinutes = Math.max(1, Math.round(wordCount / 200))
    const readTime = `${readTimeMinutes} min`

    const imageExt = imageFile ? imageFile.name.split('.').pop() || 'webp' : 'webp'
    const imageName = `${slug}.${imageExt}`
    setError("")

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim() || finalContent.trim().slice(0, 150) + "...",
          content: finalContent.trim(),
          category: category.trim() || "General",
          tags,
          author: author.trim() || "Dr. S.K.Srinivas",
          image: image || "",
          imageName: image ? imageName : undefined,
          password: passwordRef.current,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save")
      }

      // Remove local draft copy since it's now committed as MDX
      deleteLocalBlog(slug)

      // Refresh server blog list so it shows as "Live"
      setServerBlogs(prev => {
        const exists = prev.some(b => b.slug === slug)
        if (exists) return prev
        return [...prev, {
          slug,
          title: title.trim(),
          date: dateStr,
          readTime,
          image: image || "/images/blog/blog-cavity.jpg",
        }]
      })

      setSaved(true)
      refreshList()
      setMessage(data.message || "Blog post saved!")
      resetForm()

      setTimeout(() => { setSaved(false); setMessage("") }, 5000)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    }
  }

  const handleEdit = (blog: LocalBlog) => {
    setMode("edit")
    setEditingSlug(blog.slug)
    setTitle(blog.title)
    setExcerpt(blog.excerpt)
    setContent(blog.content)
    setCategory(blog.category)
    setTagsInput((blog.tags || []).join(", "))
    setAuthor(blog.author)
    setImage(blog.image)
    setImagePreview(blog.image)
    setShowPreview(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (slug: string) => {
    const isServer = serverBlogs.some(b => b.slug === slug)
    if (!confirm(`Delete "${slug}"${isServer ? " (this will remove it from the live site)" : ""}?`)) return

    if (isServer) {
      try {
        const res = await fetch(`/api/blogs?slug=${slug}&password=${encodeURIComponent(passwordRef.current)}`, {
          method: "DELETE",
        })
        if (!res.ok) {
          const err = await res.json()
          setError(err.error || "Failed to delete")
          return
        }
        setServerBlogs(prev => prev.filter(b => b.slug !== slug))
      } catch (err: any) {
        setError(err.message || "Failed to delete")
        return
      }
    }

    deleteLocalBlog(slug)
    refreshList()
    if (editingSlug === slug) resetForm()
  }

  const handleView = (slug: string) => {
    window.open(`/blogs/${slug}`, "_blank")
  }

  if (!authenticated) {
    return (
      <ContentContainer>
        <div className="py-16 max-w-md mx-auto">
          <PageHeading className="text-2xl md:text-3xl mb-4 text-center">
            Doctor Access
          </PageHeading>
          <p className="text-gray-500 text-center mb-8">
            Enter the password to write blog posts.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                {passwordError}
              </div>
            )}
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
            />
            <button
              type="submit"
              disabled={checkingPassword || !passwordInput.trim()}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {checkingPassword ? "Checking..." : "Enter"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Only the clinic doctor has access to this page.
          </p>
        </div>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <div className="py-8">
        <PageHeading className="text-3xl md:text-4xl mb-2">
          {mode === "create" ? "Write a Blog Post" : "Edit Blog Post"}
        </PageHeading>
        <p className="text-gray-500 mb-8">
          Write your blog content below. Your posts are saved and visible to all visitors after deployment.
        </p>

        {saved && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            {message || "Blog post saved!"} It now appears on the{" "}
            <a href="/blogs" className="font-semibold underline">
              blogs page
            </a>
            .
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog post title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Excerpt / Short Description
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the blog post (optional — auto-generated from content if empty)"
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-700">
                  Content *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition"
                  >
                    {showPreview ? "Edit" : "Preview"}
                  </button>
                  <button
                    type="button"
                    onClick={handleAutoFormat}
                    className="text-xs px-3 py-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                  >
                    Auto Format
                  </button>
                </div>
              </div>

              {showPreview ? (
                <div className="w-full min-h-[16rem] px-4 py-3 border border-gray-300 rounded-lg bg-white prose prose-sm max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content
                        ? content
                            .replace(/^### (.+)$/gm, "<h3>$1</h3>")
                            .replace(/^## (.+)$/gm, "<h2>$1</h2>")
                            .replace(/^# (.+)$/gm, "<h1>$1</h1>")
                            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\*(.+?)\*/g, "<em>$1</em>")
                            .replace(/^- (.+)$/gm, "<li>$1</li>")
                            .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
                            .replace(/^\d+[.)] (.+)$/gm, "<li>$1</li>")
                            .replace(/\n{2,}/g, "</p><p>")
                            .replace(/^((?!<[hul]>|<\/[hul]>).+)$/gm, "<p>$1</p>")
                            .replace(/<\/ul>\n*<ul>/g, "")
                            .replace(/<\/p>\n*<p>/g, "</p><p>")
                        : "<p class='text-gray-400'>Nothing to preview yet.</p>",
                    }}
                  />
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here. Use blank lines between paragraphs. You can use markdown: ## headings, **bold**, - lists."
                  rows={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-y font-mono text-sm"
                  style={{ fontFamily: 'inherit' }}
                />
              )}
              <p className="text-xs text-gray-400 mt-1">
                Supports markdown formatting. Use <strong>Auto Format</strong> to convert plain text. Supports Tamil text.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Prevention, Treatment, Wellness"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Dr. S.K.Srinivas"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Oral Health, Dental Care, Prevention"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Featured Image
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300"
                >
                  Choose Image
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <p className="text-xs text-gray-400 mt-1">Max 5MB. If none selected, a default image is used.</p>
              {imagePreview && (
                <div className="mt-3 relative w-48 h-32 rounded-lg overflow-hidden border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {mode === "create" ? "Save Blog Post" : "Update Blog Post"}
              </button>
              {mode === "edit" && (
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Sidebar: All blogs list */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaEdit /> All Blogs
                <span className="text-sm font-normal text-gray-500">({blogs.length + serverBlogs.length})</span>
              </h3>

              {(() => {
                const localSlugs = new Set(blogs.map(b => b.slug))
                const allBlogs = [
                  ...serverBlogs.filter(b => !localSlugs.has(b.slug)).map(b => ({ ...b, isServer: true as const })),
                  ...blogs.map(b => ({ ...b, isServer: false as const })),
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

                if (allBlogs.length === 0) {
                  return <p className="text-gray-400 text-sm">No blogs yet. Write your first blog post!</p>
                }

                return (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {allBlogs.map((blog) => (
                      <div
                        key={blog.slug}
                        className={`p-3 rounded-lg border bg-white ${
                          editingSlug === blog.slug
                            ? "border-blue-400 ring-1 ring-blue-400"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {(blog as any).image && (
                            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={(blog as any).image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-gray-800 truncate">
                                {blog.title}
                              </h4>
                              <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                blog.isServer
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}>
                                {blog.isServer ? "Live" : "Draft"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {blog.date} &middot; {blog.readTime}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {blog.isServer && (
                                <button
                                  onClick={() => window.open(`/blogs/${blog.slug}`, "_blank")}
                                  className="text-xs text-gray-600 hover:underline flex items-center gap-1"
                                >
                                  <FaEye /> View
                                </button>
                              )}
                              {!blog.isServer && (
                                <button
                                  onClick={() => {
                                    const lb = blogs.find(b => b.slug === blog.slug)
                                    if (lb) handleEdit(lb)
                                  }}
                                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <FaEdit /> Edit
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(blog.slug)}
                                className="text-xs text-red-600 hover:underline flex items-center gap-1"
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <a
                  href="/blogs"
                  className="text-sm text-blue-600 hover:underline block"
                >
                  View all blogs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  )
}
