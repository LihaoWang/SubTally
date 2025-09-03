"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Sparkles, Play } from "lucide-react"

interface OnboardingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartUsingApp: () => void
}

export function OnboardingModal({ 
  open, 
  onOpenChange, 
  onStartUsingApp 
}: OnboardingModalProps) {
  const { t } = useLanguage()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-muted-foreground" />
          </div>
          <DialogTitle className="text-xl font-semibold text-center">
            {t("onboarding.title")}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {t("onboarding.description")}
          </DialogDescription>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t("onboarding.exampleNote")}
            </p>
          </div>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="order-2 sm:order-1"
          >
            {t("onboarding.browseDemos")}
          </Button>
          <Button
            onClick={onStartUsingApp}
            className="order-1 sm:order-2"
          >
            <Play className="w-4 h-4 mr-2" />
            {t("onboarding.startTracking")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}