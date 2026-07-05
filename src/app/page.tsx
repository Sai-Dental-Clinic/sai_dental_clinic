"use client"
import HeroSection from '@/components/sections/home/heroSection/HeroSection'
import IntroductionSection from '@/components/sections/home/introduction/IntroductionSection'
import VideoSection from '@/components/sections/home/video/VideoSection' 
import StatsSection from '@/components/sections/home/stats/StatsSection'
import ServiceSection from '@/components/sections/service/ServiceSection'
import WhyChooseUsSection from '@/components/sections/home/homeabout/WhyChooseUs'
import FeaturesSection from '@/components/sections/home/featuresection/FeatureSection'
import TestimonialsSection from '@/components/sections/home/testimonials/TestimonialsSection'
import HomeBlogsSection from '@/components/sections/blogs/HomeBlogsSection'
import DynamicYouTubeSection from '@/components/sections/videos/DynamicYouTubeSection'
import AppointmentSection from '@/components/sections/home/appointment/AppointmentSection'
import FAQSection from '@/components/sections/home/faq/FAQSection'
import GoogleReviews from "@/components/common-ui/google-reviews/GoogleReviews"
// import ContactSection from '@/components/sections/home/contact/ContactSection'
import ContactSection from '@/components/common-ui/contactForm/ContactSection'
import SubscribeSection from '@/components/sections/subscribe/SubscribeSection'
import { heroSectionData } from '@/data/home/hero'
import { introductionData } from '@/data/home/introduction'
import { videoData } from '@/data/home/video' 
import { statsData } from '@/data/home/Stats'
import { serviceData } from '@/data/service/service'
import { whyChooseUsData } from "@/data/home/whychooseusnew"
import { appointmentData } from '@/data/home/appointment'
import { sampleTestimonials } from '@/data/home/testimonials'
import { faqData } from '@/data/home/faq'
import { contactData } from '@/data/home/contact'
import { contactLocations } from '@/data/contact/contact'
import { subscribeData } from '@/data/home/subscribe'
import { featuredServices } from '@/data/service/featuredServices'
import ConsultationSection from "@/components/sections/consultation/ConsultationSection"
import { consultationData } from "@/data/consultation/consultation"
import dynamic from "next/dynamic";

const ChatBotFloat = dynamic(
  () => import("@/components/common-ui/chatbot/ChatBotFloat").then((m) => m.ChatBotFloat),
  { ssr: false }
);
const Page = () => {
  return (
<main className="">
      <HeroSection data={heroSectionData} />
      <ConsultationSection data={consultationData} />
      <IntroductionSection data={introductionData} />
      <VideoSection src={videoData.videoUrl} poster={videoData.videoPoster} />
      <StatsSection data={statsData} />
      <ServiceSection data={featuredServices} pageHeading={false} showViewAll />
      <WhyChooseUsSection data={whyChooseUsData} />
      <FeaturesSection data={introductionData} />
      <TestimonialsSection data={sampleTestimonials} />
      <DynamicYouTubeSection maxVideos={6} />
      <AppointmentSection data={appointmentData} />
      <HomeBlogsSection />
      <FAQSection data={faqData} />
      <ChatBotFloat />
      </main>
  )
}

export default Page