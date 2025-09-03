"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:pb-24 lg:px-8 lg:pt-32 lg:pb-32 pt-16 sm:pt-24">
        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
          <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">{t("hero.title")}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:max-w-md lg:max-w-none">
              {t("hero.description")}
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/main">
                <Button size="lg">
                  {t("hero.getStarted")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-foreground">
                {t("hero.learnMore")} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mt-14 lg:mt-0 lg:w-full lg:max-w-lg lg:flex-shrink-0">
            <div className="mx-auto w-full max-w-lg">
              <img
                src="/hero2.png"
                alt="3D illustration of subscription management with calendar, recurring symbols, and notification elements"
                className="w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
