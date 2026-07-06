"use client"

import { useEffect, useState } from "react"
import YouTubeSection, { type YouTubeSectionData } from "./YouTubeSection"
import { youtubeData } from "@/data/home/youtube"

interface DynamicYouTubeSectionProps {
  showHeading?: boolean
  maxVideos?: number
}

export default function DynamicYouTubeSection({ showHeading = true, maxVideos }: DynamicYouTubeSectionProps) {
  const [data, setData] = useState<YouTubeSectionData>(youtubeData)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const url = maxVideos ? `/api/youtube?max=${maxVideos}` : "/api/youtube"
    fetch(url)
      .then(r => r.json())
      .then((res) => {
        if (res.videos && res.videos.length > 0) {
          setData({
            channelHandle: res.channelHandle,
            channelUrl: res.channelUrl,
            channelName: res.channelName,
            channelSubscriberCount: res.channelSubscriberCount,
            sectionHeading: youtubeData.sectionHeading,
            sectionSubheading: youtubeData.sectionSubheading,
            videos: res.videos.map((v: any, i: number) => ({
              id: v.id || String(i + 1),
              videoId: v.videoId,
              title: v.title,
              description: v.description,
              thumbnail: v.thumbnail,
            })),
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  if (!loaded) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto" />
        </div>
      </section>
    )
  }

  return <YouTubeSection data={data} showHeading={showHeading} />
}
