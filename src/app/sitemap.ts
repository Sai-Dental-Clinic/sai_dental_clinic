import type { MetadataRoute } from "next"
import { getAllBlogs } from "@/lib/mdx"
import { dentistsData } from "@/data/dentists/dentists"
import { serviceData } from "@/data/service/service"

const siteUrl = "https://saidentalmayiladuthurai.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/consultation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/dentist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/dentist/list`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/servicePage`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/videos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ]

  const blogs = getAllBlogs()
  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${siteUrl}/blogs/${blog.slug}`,
    lastModified: blog.date ? new Date(blog.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const dentistPages: MetadataRoute.Sitemap = dentistsData.dentists.map((dentist) => ({
    url: `${siteUrl}/dentist/${dentist.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  const servicePages: MetadataRoute.Sitemap = serviceData.cards.map((service) => ({
    url: `${siteUrl}/servicePage/${service.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [...staticPages, ...blogPages, ...dentistPages, ...servicePages]
}
