"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useTheme } from "@/contexts/theme-context";

export function LandingNavbar() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <img src="/icon.png" alt="SubTally" className="h-12 w-auto" />
            <span className="hidden md:block text-xl font-bold text-foreground">
              SubTally
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Button asChild>
            <Link href="/main">{t("hero.getStarted")}</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
