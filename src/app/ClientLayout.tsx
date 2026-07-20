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
import CelebrationOverlay from "@/components/common-ui/celebration/CelebrationOverlay"

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

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const [celebrateTrigger, setCelebrateTrigger] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => window.scrollTo(0, 0), 50)
    return () => clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    const t = setTimeout(() => setCelebrateTrigger(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Header />

      <main className="px-4 sm:px-0 w-full">{children}</main>

      <GoogleReviews />
      <ContactSection locations={contactLocations} />
      <GoogleBusinessQR />
      <Footer />

      <CelebrationOverlay
        trigger={celebrateTrigger}
        duration={10000}
        onClose={() => setCelebrateTrigger(false)}
      />

      <ConsultationFloat />
      <div className="fixed bottom-4 right-4 z-[9999] isolate">
        <ChatBotFloat />
      </div>
    </>
  )
}
