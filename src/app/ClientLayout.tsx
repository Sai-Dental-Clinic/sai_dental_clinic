"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import GoogleReviews from "@/components/common-ui/google-reviews/GoogleReviews"
import ContactSection from "@/components/common-ui/contactForm/ContactSection"
import GoogleBusinessQR from "@/components/common-ui/businessqr/GoogleBusinessQR"
import { contactLocations } from "@/data/contact/contact"
import NoticePopup from "@/components/common-ui/notice/NoticePopup"
import CelebrationOverlay from "@/components/common-ui/celebration/CelebrationOverlay"
import HiringPopup from "@/components/common-ui/hiring/HiringPopup"

const ChatBotFloat = dynamic(
  () => import("@/components/common-ui/chatbot/ChatBotFloat").then((m) => m.ChatBotFloat),
  { ssr: false },
)

const WhatsAppFloat = dynamic(
  () => import("@/components/common-ui/whatsappfloat/WhatsappFloat").then((m) => m.WhatsAppFloat),
  { ssr: false },
)

const ConsultationFloat = dynamic(
  () => import("@/components/sections/consultation/ConsultationFloat").then((m) => m.ConsultationFloat),
  { ssr: false },
)

const noticeImage = "/images/Notice.webp"
const ACTIVE_NOTICE_KEY = "notice-5th-anniversary-2025"
const NOTICE_PREVIEW_MODE = true

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const [celebrateTrigger, setCelebrateTrigger] = useState(false)
  const [showHiring, setShowHiring] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => window.scrollTo(0, 0), 50)
    return () => clearTimeout(t)
  }, [pathname])

  const handleNoticeClose = () => {
    setTimeout(() => setCelebrateTrigger(true), 400)
  }

  const handleCelebrationClose = () => {
    setCelebrateTrigger(false)
    setShowHiring(true)
  }

  return (
    <>
      <Header />

      <main className="px-4 sm:px-0 w-full">{children}</main>

      <GoogleReviews />
      <ContactSection locations={contactLocations} />
      <GoogleBusinessQR />
      <Footer />

      <NoticePopup
        imageSrc={noticeImage}
        imageAlt="Sai Dental Clinic – 5th Anniversary Notice"
        storageKey={ACTIVE_NOTICE_KEY}
        alwaysShow={NOTICE_PREVIEW_MODE}
        delay={1000}
        onClose={handleNoticeClose}
      />

      <CelebrationOverlay
        trigger={celebrateTrigger}
        duration={10000}
        onClose={handleCelebrationClose}
      />

      <HiringPopup
        trigger={showHiring}
        delay={2000}
        onClose={() => setShowHiring(false)}
      />

      <ConsultationFloat />
      <div className="fixed bottom-4 right-4 z-[9999] isolate">
        <ChatBotFloat />
      </div>
    </>
  )
}
