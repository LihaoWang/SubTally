import { LandingNavbar } from "@/components/landing-navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  )
}
