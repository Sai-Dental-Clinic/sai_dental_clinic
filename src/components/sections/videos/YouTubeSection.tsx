"use client"

import React from "react"
import { motion } from "framer-motion"
import ContentContainer from "@/components/common-ui/containers/ContentContainer"
import SectionTitleText from "@/components/common-ui/contentText/SectionTitleText"
import PageHeading from "@/components/common-ui/headers/PageHeading"

interface YouTubeVideo {
  id: string
  videoId: string
  title: string
  description: string
  thumbnail: string
}

export interface YouTubeSectionData {
  channelHandle: string
  channelUrl: string
  channelName: string
  channelSubscriberCount?: string
  sectionHeading: string
  sectionSubheading: string
  videos: YouTubeVideo[]
}

interface YouTubeSectionProps {
  data: YouTubeSectionData
  showHeading?: boolean
}

export default function YouTubeSection({ data, showHeading = true }: YouTubeSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <ContentContainer className="items-center justify-center space-y-12">
        {showHeading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <SectionTitleText wrapperClassName="items-center">
              <motion.span
                className="text-blue-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Videos
              </motion.span>
            </SectionTitleText>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <PageHeading
                wrapperClassName="items-center"
                className="text-4xl lg:text-5xl text-gray-900 text-center mb-6"
              >
                {data.sectionHeading}
              </PageHeading>
            </motion.div>
            <motion.p
              className="text-xl text-gray-600 mt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {data.sectionSubheading}
            </motion.p>
          </motion.div>
        )}

        {data.videos.filter(v => v.videoId).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {data.videos.filter(v => v.videoId).map((video, index) => (
              <motion.div
                key={video.id}
                className="rounded-xl overflow-hidden shadow-lg bg-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.videoId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="w-full max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
              <div className="text-6xl mb-6">📺</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Watch Our Dental Care Videos
              </h3>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                Visit our YouTube channel for dental care tips, treatment explanations, and clinic updates from Dr. S.K. Srinivas.
              </p>
              <a
                href={data.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-full font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Visit Our YouTube Channel
              </a>
            </div>
          </motion.div>
        )}

        {data.videos.filter(v => v.videoId).length > 0 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a
              href={data.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Subscribe on YouTube
            </a>
          </motion.div>
        )}
      </ContentContainer>
    </section>
  )
}
