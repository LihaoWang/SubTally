"use client"

import { Shield, Download, DollarSign, Zap } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Features() {
  const { t } = useLanguage()

  const features = [
    {
      name: t("features.free.title"),
      description: t("features.free.description"),
      icon: Zap,
    },
    {
      name: t("features.private.title"),
      description: t("features.private.description"),
      icon: Shield,
    },
    {
      name: t("features.currency.title"),
      description: t("features.currency.description"),
      icon: DollarSign,
    },
    {
      name: t("features.export.title"),
      description: t("features.export.description"),
      icon: Download,
    },
  ]

  return (
    <section id="features" className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">{t("features.title")}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("hero.subtitle")}</p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">{t("hero.description")}</p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
