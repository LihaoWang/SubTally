"use client"

import { Github, Twitter, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="https://github.com/LihaoWang" className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </a>
          <a href="https://x.com/leowang9988" className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>
          {/* <a href="#" className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">Website</span>
            <Globe className="h-6 w-6" />
          </a> */}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-muted-foreground">
            &copy; 2025 {t("app.title")}. {t("footer.description")}
          </p>
        </div>
      </div>
    </footer>
  )
}
