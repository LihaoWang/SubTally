export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SubTally",
    "alternateName": "SubTally - Subscription Tracker",
    "description": "Track and manage all your digital subscriptions in one place. Monitor spending, get billing reminders, and take control of your recurring payments.",
    "url": "https://subtally.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "screenshot": "https://files.leo63.xyz/banner1.png",
    "image": "https://files.leo63.xyz/banner1.png",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31"
    },
    "featureList": [
      "Privacy-first subscription tracking",
      "Smart billing reminders and notifications",
      "Comprehensive spending analysis and insights",
      "Multi-currency support with real-time conversion",
      "Local data storage for complete privacy",
      "Offline functionality without external dependencies",
      "Bilingual interface (English/Chinese)",
      "Dark and light theme support",
      "JSON import/export for data portability",
      "Responsive design for all devices"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5. Compatible with Chrome, Firefox, Safari, Edge.",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": "2025-01-01",
    "inLanguage": ["en", "zh"],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "SubTally",
      "url": "https://subtally.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SubTally",
      "url": "https://subtally.com"
    },
    "keywords": "subscription tracker, subscription management, billing tracker, recurring payments, digital subscriptions, expense tracking, budget management, privacy-first, offline app",
    "potentialAction": {
      "@type": "UseAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://subtally.com/app",
        "inLanguage": ["en", "zh"],
        "actionPlatform": [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform"
        ]
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
