"use client";

import type React from "react";
import Link from "next/link"; // Added Link import for navigation
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SettingsModal } from "@/components/settings-modal";
import { useTheme } from "@/contexts/theme-context";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  period: "weekly" | "monthly" | "yearly";
  currency: string;
  description: string;
  nextBillingDate: string;
}

interface NavbarProps {
  onAddClick: () => void;
  subscriptions: Subscription[];
  onImportData: (data: Subscription[]) => void;
  baseCurrency: string;
  onBaseCurrencyChange: (currency: string) => void;
  onDeleteAllData: () => void;
}

export function Navbar({
  onAddClick,
  subscriptions,
  onImportData,
  baseCurrency,
  onBaseCurrencyChange,
  onDeleteAllData,
}: NavbarProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<Subscription[] | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(subscriptions, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `subscriptions-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: t("app.exportSuccess"),
        description: t("app.exportSuccessDesc"),
      });
    } catch (error) {
      toast({
        title: t("app.exportError"),
        description: t("app.exportErrorDesc"),
        variant: "destructive",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);

        // Validate data structure
        if (!Array.isArray(jsonData)) {
          throw new Error("Invalid data format: expected an array");
        }

        // Validate each subscription object
        const isValidSubscription = (sub: any): sub is Subscription => {
          return (
            typeof sub === "object" &&
            typeof sub.id === "string" &&
            typeof sub.name === "string" &&
            typeof sub.amount === "number" &&
            ["weekly", "monthly", "yearly"].includes(sub.period) &&
            typeof sub.description === "string" &&
            typeof sub.nextBillingDate === "string"
          );
        };

        const validSubscriptions = jsonData.filter(isValidSubscription);

        if (validSubscriptions.length === 0) {
          throw new Error("No valid subscription data found");
        }

        if (validSubscriptions.length !== jsonData.length) {
          toast({
            title: "Warning",
            description: `${jsonData.length - validSubscriptions.length} invalid entries were skipped.`,
          });
        }

        setImportData(validSubscriptions);
        setShowImportDialog(true);
      } catch (error) {
        toast({
          title: t("app.importError"),
          description: t("app.importError"),
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = "";
  };

  const handleConfirmImport = () => {
    if (importData) {
      onImportData(importData);
      setShowImportDialog(false);
      setImportData(null);
      toast({
        title: t("app.importSuccess"),
        description: `${importData.length} ${t("app.subscriptionsImported")}`,
      });
    }
  };

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/icon.png"
                alt="SubTally"
                className="h-12 w-auto"
              />
              <span className="hidden md:block text-xl font-bold text-foreground">
                SubTally
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettingsModal(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>

            <Button onClick={onAddClick} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("app.addSubscription")}
              </span>
              <span className="sm:hidden">{t("app.add")}</span>
            </Button>
          </div>
        </div>
      </nav>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      <SettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
        baseCurrency={baseCurrency}
        onBaseCurrencyChange={onBaseCurrencyChange}
        subscriptions={subscriptions}
        onExport={handleExport}
        onImport={handleImportClick}
        onDeleteAllData={onDeleteAllData}
      />

      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("app.confirmImport")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("app.importWarning")}
              <br />
              <br />
              <strong>
                {importData?.length || 0} {t("app.subscriptions")}
              </strong>{" "}
              {t("app.willBeImported")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("app.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport}>
              {t("app.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
