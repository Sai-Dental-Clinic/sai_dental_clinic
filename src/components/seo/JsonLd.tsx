const structuredData = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": "https://sai-dental-clinic.pages.dev",
  name: "Sai Dental Clinic",
  description:
    "Expert dental care in Mayiladuthurai. Root canal, teeth whitening, dental implants, braces, and more.",
  url: "https://sai-dental-clinic.pages.dev",
  telephone: ["+918122835737", "+918903157201"],
  email: "support@saidentalmayiladuthurai.com",
  founder: {
    "@type": "Person",
    name: "Dr. Srinivas S K",
    description: "Dental Surgeon (BDS, FDS in Endodontics)",
  },
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Kenikarai, Thiruvarur Main Road",
      addressLocality: "Mayiladuthurai",
      addressRegion: "Tamil Nadu",
      postalCode: "609001",
      addressCountry: "IN",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Near Indian Overseas Bank, Main Road",
      addressLocality: "Needur",
      addressRegion: "Tamil Nadu",
      postalCode: "609203",
      addressCountry: "IN",
    },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "16:30",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "15:00",
    },
  ],
  image: "https://sai-dental-clinic.pages.dev/icon.png",
  sameAs: [
    "https://www.youtube.com/@saidentalclinicdrsrinivas",
    "https://www.facebook.com/saidentalclinic1/",
    "https://www.instagram.com/sai.dental_clinic/",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "80",
    bestRating: "5",
    worstRating: "1",
  },
  priceRange: "₹₹",
}

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
