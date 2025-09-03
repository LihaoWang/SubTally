export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SubTally",
    "description": "Track and manage all your digital subscriptions in one place. Monitor spending, get billing reminders, and take control of your recurring payments.",
    "url": "https://SubTally.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Subscription tracking",
      "Billing reminders",
      "Spending analysis",
      "Multi-currency support",
      "Privacy-first design",
      "Offline functionality"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
