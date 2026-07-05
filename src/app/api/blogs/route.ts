import { NextRequest, NextResponse } from "next/server"
import { createOrUpdateFile, deleteFile, listDirectory, getFileContent, hasGitHubToken } from "@/lib/github"

let fs: any = null
let pathModule: any = null
try {
  fs = require("fs")
  pathModule = require("path")
} catch {}

const BLOG_DIR = typeof process !== "undefined" && fs
  ? pathModule.join(process.cwd(), "src/content/blogs")
  : ""
const IMAGE_DIR = typeof process !== "undefined" && fs
  ? pathModule.join(process.cwd(), "public/images/blog")
  : ""

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() || "untitled"
}

function generateMdxContent(blog: {
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  image: string
  category: string
  author: string
  tags: string[]
}): string {
  const tagsYaml = blog.tags.length > 0
    ? blog.tags.map(t => `  - ${t}`).join("\n")
    : ""

  return `---
title: "${blog.title.replace(/"/g, '\\"')}"
excerpt: "${blog.excerpt.replace(/"/g, '\\"')}"
date: "${blog.date}"
readTime: "${blog.readTime}"
image: "${blog.image}"
category: "${blog.category}"
author: "${blog.author}"
tags:
${tagsYaml}
---

${blog.content}
`
}

function parseFrontmatter(source: string) {
  const data: Record<string, any> = {}
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return { data, content: source }
  const yamlBlock = match[1]
  let currentKey = ""
  for (const line of yamlBlock.split("\n")) {
    const keyMatch = line.match(/^(\w+):\s*(.*)/)
    if (keyMatch) {
      currentKey = keyMatch[1]
      let val: any = keyMatch[2].replace(/^"(.*)"$/, "$1")
      if (val === "true") val = true
      else if (val === "false") val = false
      else if (/^\d+$/.test(val)) val = parseInt(val, 10)
      data[currentKey] = val
    } else if (currentKey && /^\s+-/.test(line)) {
      const item = line.replace(/^\s*-\s*/, "").replace(/^"(.*)"$/, "$1")
      if (!Array.isArray(data[currentKey])) data[currentKey] = []
      ;(data[currentKey] as string[]).push(item)
    }
  }
  return { data, content: source.slice(match[0].length) }
}

async function readAllMdxBlogs() {
  if (hasGitHubToken()) {
    const entries = await listDirectory("src/content/blogs")
    const mdxFiles = entries.filter(e => e.type === "file" && e.name.endsWith(".mdx"))
    const blogs = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.name.replace(".mdx", "")
        const content = await getFileContent(`src/content/blogs/${file.name}`)
        if (!content) return null
        const { data } = parseFrontmatter(content)
        return { slug, ...data }
      }),
    )
    return blogs.filter(Boolean)
  }

  if (!fs || !BLOG_DIR) return []
  try {
    return fs
      .readdirSync(BLOG_DIR)
      .filter((f: string) => f.endsWith(".mdx"))
      .map((file: string) => {
        const slug = file.replace(".mdx", "")
        const source = fs.readFileSync(pathModule.join(BLOG_DIR, file), "utf8")
        const { data } = parseFrontmatter(source)
        return { slug, ...data }
      })
  } catch {
    return []
  }
}

export async function GET() {
  const blogs = await readAllMdxBlogs()
  return NextResponse.json({ blogs })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, excerpt, content, category, tags, author, image, imageName, password } = body

    const expectedPassword = process.env.BLOG_PASSWORD
    if (expectedPassword && password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 },
      )
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      )
    }

    const slug = slugify(title)
    const now = new Date()
    const dateStr = now.toISOString().split("T")[0]

    const wordCount = content.trim().split(/\s+/).length
    const readTimeMinutes = Math.max(1, Math.round(wordCount / 200))
    const readTime = `${readTimeMinutes} min`

    const blog = {
      title,
      excerpt: excerpt || content.slice(0, 150) + "...",
      content,
      date: dateStr,
      readTime,
      image: image ? `/images/blog/${imageName || `${slug}.webp`}` : "/images/blog/blog-cavity.jpg",
      category: category || "General",
      author: author || "Dr. S.K.Srinivas",
      tags: tags || [],
    }

    const mdxContent = generateMdxContent(blog)
    const mdxPath = `src/content/blogs/${slug}.mdx`
    const imageRelativePath = image ? `public/images/blog/${imageName || `${slug}.webp`}` : null

    if (hasGitHubToken()) {
      // Production: use GitHub API to commit files

      // Save image first if provided
      if (image && imageRelativePath) {
        const base64Data = image.includes("base64,")
          ? image.split("base64,")[1]
          : image

        await createOrUpdateFile(
          imageRelativePath,
          base64Data,
          `Add blog image: ${imageName || `${slug}.webp`}`,
          "base64",
        )
      }

      // Save MDX file
      await createOrUpdateFile(
        mdxPath,
        mdxContent,
        `Add blog post: ${title}`,
        "utf8",
      )

      return NextResponse.json({
        success: true,
        slug,
        message: "Blog post committed to GitHub. Vercel will auto-deploy shortly.",
      })
    } else {
      // Local development: write directly to filesystem
      if (!fs.existsSync(BLOG_DIR)) {
        fs.mkdirSync(BLOG_DIR, { recursive: true })
      }
      if (!fs.existsSync(IMAGE_DIR)) {
        fs.mkdirSync(IMAGE_DIR, { recursive: true })
      }

      // Save image
      if (image && imageRelativePath) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "")
        const imageBuffer = Buffer.from(base64Data, "base64")
        const imagePath = pathModule.join(process.cwd(), imageRelativePath)
        fs.writeFileSync(imagePath, imageBuffer)
      }

      // Save MDX
      const filePath = pathModule.join(BLOG_DIR, `${slug}.mdx`)
      fs.writeFileSync(filePath, mdxContent, "utf-8")

      return NextResponse.json({
        success: true,
        slug,
        message: "Blog post saved locally. Commit and deploy to make it live.",
      })
    }
  } catch (error: any) {
    console.error("Error saving blog:", error)
    return NextResponse.json(
      { error: error.message || "Failed to save blog post" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    const password = searchParams.get("password") || ""

    const expectedPassword = process.env.BLOG_PASSWORD
    if (expectedPassword && password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 },
      )
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 },
      )
    }

    const mdxPathRelative = `src/content/blogs/${slug}.mdx`

    if (hasGitHubToken()) {
      await deleteFile(
        mdxPathRelative,
        `Delete blog post: ${slug}`,
      )
    } else if (fs) {
      const mdxFullPath = pathModule.join(process.cwd(), mdxPathRelative)
      if (fs.existsSync(mdxFullPath)) {
        fs.unlinkSync(mdxFullPath)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted.",
    })
  } catch (error: any) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete blog post" },
      { status: 500 },
    )
  }
}
