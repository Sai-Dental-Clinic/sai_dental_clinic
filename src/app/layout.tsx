import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"
import { poppins } from "@/utils/font"
import ClientLayout from "./ClientLayout"
import JsonLd from "@/components/seo/JsonLd"

const siteUrl = "https://saidentalmayiladuthurai.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sai Dental Clinic - Best Dentist in Mayiladuthurai",
    template: "%s | Sai Dental Clinic",
  },
  description:
    "Sai Dental Clinic in Mayiladuthurai offers expert dental care — root canal, teeth whitening, dental implants, braces, and more. 7+ years experience. Book your appointment today!",
  openGraph: {
    type: "website",
    siteName: "Sai Dental Clinic",
    title: "Sai Dental Clinic - Best Dentist in Mayiladuthurai",
    description:
      "Expert dental care in Mayiladuthurai. Root canal, teeth whitening, implants, braces & more. Book now!",
    url: siteUrl,
    locale: "en_IN",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Sai Dental Clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sai Dental Clinic",
    description:
      "Expert dental care in Mayiladuthurai. Root canal, teeth whitening, implants, braces & more.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-poppins min-h-screen antialiased",
          poppins,
        )}
        suppressHydrationWarning
      >
        <JsonLd />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
