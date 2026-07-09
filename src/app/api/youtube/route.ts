import { NextResponse } from "next/server"

export const runtime = "edge"

const YT_API = "https://www.googleapis.com/youtube/v3"

interface YouTubeVideoItem {
  id: string
  videoId: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
}

interface ApiResponse {
  channelHandle: string
  channelUrl: string
  channelName: string
  channelSubscriberCount: string
  videos: YouTubeVideoItem[]
}

async function fetchWithRetry(url: string, retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url)
    if (res.ok) return res.json()
    if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    else throw new Error(`YouTube API error ${res.status}: ${await res.text()}`)
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const maxResults = Math.min(parseInt(searchParams.get("max") || "50", 10) || 50, 50)
  const apiKey = process.env.YOUTUBE_API_KEY
  const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE || "@saidentalclinicdrsrinivas"
  const channelUrl = `https://www.youtube.com/${channelHandle}`

  if (!apiKey) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY not configured" },
      { status: 503 },
    )
  }

  try {
    const channelData = await fetchWithRetry(
      `${YT_API}/channels?part=snippet,contentDetails,statistics&forHandle=${encodeURIComponent(channelHandle)}&key=${apiKey}`
    )

    if (!channelData?.items?.length) {
      throw new Error("Channel not found")
    }

    const channel = channelData.items[0]
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads
    const channelName = channel.snippet?.title || channelHandle
    const subscriberCount = channel.statistics?.subscriberCount || ""

    if (!uploadsPlaylistId) {
      throw new Error("No uploads playlist found")
    }

    const playlistData = await fetchWithRetry(
      `${YT_API}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`
    )

    const videos: YouTubeVideoItem[] = (playlistData?.items || [])
      .filter((item: any) => item.snippet?.resourceId?.videoId)
      .map((item: any) => ({
        id: item.id,
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
        publishedAt: item.snippet.publishedAt,
      }))

    videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    const response: ApiResponse = {
      channelHandle,
      channelUrl,
      channelName,
      channelSubscriberCount: String(subscriberCount),
      videos,
    }

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
    })
  } catch (error: any) {
    console.error("YouTube API error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch YouTube videos" },
      { status: 500 },
    )
  }
}
