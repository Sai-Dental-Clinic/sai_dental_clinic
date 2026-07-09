import type { Metadata } from "next"
import AboutHero from '@/components/sections/about/abouthero/AboutHero'
import Gallery from '@/components/sections/about/gallery/Gallery'
import StatsSection from '@/components/sections/about/statsabout/StatsSection'
import ContactSection from '@/components/common-ui/contactForm/ContactSection'
import SubscribeSection from '@/components/sections/subscribe/SubscribeSection'
import AboutMissionSection from '@/components/sections/about/aboutmission/AboutMissionSection'
import AboutWhyUsSection from '@/components/sections/about/aboutwhyus/AboutWhyUs'
import VideoSection from '@/components/sections/home/video/VideoSection'
import { whyUsData } from '@/data/about/whyus'
import { aboutMissionData } from '@/data/about/mission'
import { aboutHeroData } from '@/data/about/abouthero'
import { statsData } from '@/data/home/Stats'
import { contactLocations } from '@/data/contact/contact'
import { subscribeData } from '@/data/home/subscribe'
import { videoData } from '@/data/home/video' 
import { aboutVideoData } from '@/data/about/video'


export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Sai Dental Clinic in Mayiladuthurai. 7+ years of expert dental care with a team of skilled dentists. Your smile, our 1st priority.",
}

const AboutPage = () => {
  return (
    <main className="">
      <AboutHero data={aboutHeroData} />
      <Gallery />
      <StatsSection statsData={statsData} />
      <AboutMissionSection data={aboutMissionData} />
      <AboutWhyUsSection data={whyUsData} />

        <VideoSection src={videoData.videoUrl} poster={videoData.videoPoster} />


    </main>
  )
}

export default AboutPage