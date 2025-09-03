"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Upload, Globe, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getUsedCurrencies } from "@/lib/exchange-rates"
import { POPULAR_CURRENCIES, formatCurrencyOption } from "@/lib/currencies"
import { useState } from "react"

interface Subscription {
  id: string
  name: string
  amount: number
  period: "weekly" | "monthly" | "yearly"
  currency: string
  description: string
  nextBillingDate: string
}

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  baseCurrency: string
  onBaseCurrencyChange: (currency: string) => void
  subscriptions: Subscription[]
  onExport: () => void
  onImport: () => void
  onDeleteAllData: () => void
}


export function SettingsModal({ 
  open, 
  onOpenChange, 
  baseCurrency, 
  onBaseCurrencyChange,
  subscriptions,
  onExport,
  onImport,
  onDeleteAllData
}: SettingsModalProps) {
  const { t } = useLanguage()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Get currencies used in subscriptions plus popular ones
  const usedCurrencies = getUsedCurrencies(subscriptions)
  const popularCurrencyCodes = POPULAR_CURRENCIES.map(c => c.code)
  const availableCurrencies = [...new Set([...usedCurrencies, ...popularCurrencyCodes])].sort()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("settings.title")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Base Currency Section */}
          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("settings.baseCurrency")}</h3>
              <p className="text-xs text-muted-foreground">
                {t("settings.baseCurrencyDesc")}
              </p>
            </div>
            
            <Select value={baseCurrency} onValueChange={onBaseCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("settings.selectCurrency")} />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map((currencyCode) => {
                  const currency = POPULAR_CURRENCIES.find(c => c.code === currencyCode)
                  return (
                    <SelectItem key={currencyCode} value={currencyCode}>
                      {currency ? formatCurrencyOption(currency) : currencyCode}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            
            {usedCurrencies.length > 1 && (
              <p className="text-xs text-muted-foreground">
                {t("settings.currenciesInUse")}: {usedCurrencies.join(", ")}
              </p>
            )}
          </div>

          {/* Data Management Section */}
          <div className="space-y-3 pt-4 border-t">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("settings.dataManagement")}</h3>
              <p className="text-xs text-muted-foreground">
                {t("settings.dataManagementDesc")}
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={onExport} className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                {t("app.export")}
              </Button>
              
              <Button variant="outline" onClick={onImport} className="justify-start">
                <Upload className="h-4 w-4 mr-2" />
                {t("app.import")}
              </Button>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="space-y-3 pt-4 border-t">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("settings.dangerZone")}</h3>
              <p className="text-xs text-muted-foreground">
                {t("settings.dangerZoneDesc")}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(true)} 
              className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("settings.deleteAllData")}
            </Button>
            <p className="text-xs text-muted-foreground">
              {t("settings.deleteAllDataDesc")}
            </p>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog 
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={() => {
            onDeleteAllData()
            setShowDeleteConfirm(false)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

// Delete Confirmation Dialog Component
function DeleteConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  const { t } = useLanguage()
  const [deleteText, setDeleteText] = useState("")
  const isDeleteTextValid = deleteText === "DELETE"

  const handleConfirm = () => {
    if (isDeleteTextValid) {
      onConfirm()
      setDeleteText("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("settings.deleteConfirmTitle")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            {t("settings.deleteConfirmMessage")}
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("settings.typeDeleteToConfirm")}
            </label>
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder={t("settings.deleteTypePlaceholder")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring dark:bg-background"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!isDeleteTextValid}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
            >
              {t("settings.confirmDelete")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}