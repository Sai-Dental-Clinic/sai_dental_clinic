"use client"

import DynamicYouTubeSection from "@/components/sections/videos/DynamicYouTubeSection"
import SubscribeSection from "@/components/sections/subscribe/SubscribeSection"
import { subscribeData } from "@/data/home/subscribe"

export default function VideosPage() {
  return (
    <main>
      <section className="py-16 bg-gradient-to-r from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4">
            YouTube Channel
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Dental Videos
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Watch dental care tips, treatment explanations, and oral health education videos from Dr. S.K. Srinivas.
          </p>
        </div>
      </section>

      <DynamicYouTubeSection showHeading={false} />

      <SubscribeSection data={subscribeData} />
    </main>
  )
}
