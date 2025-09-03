export type Language = "en" | "zh"

export interface Translations {
  [key: string]: string | Translations
}

export const translations: Record<Language, Translations> = {
  en: {
    // Landing page
    hero: {
      title: "Track Your Subscriptions",
      subtitle: "Take control of your recurring payments",
      description: "A simple, privacy-first tool to manage and monitor all your digital subscriptions in one place.",
      getStarted: "Get Started",
      learnMore: "Learn more",
    },
    features: {
      title: "Why Choose Our Tracker?",
      free: {
        title: "Free & Minimal",
        description: "Completely free to use with a clean, distraction-free interface focused on what matters.",
      },
      private: {
        title: "Privacy First",
        description: "Your data stays on your device. No tracking, no data collection.",
      },
      currency: {
        title: "Currency Conversion",
        description: "Supports multiple currencies with automatic conversion to your preferred base currency.",
      },
      export: {
        title: "Import & Export",
        description: "Backup and restore your data anytime with JSON export/import.",
      },
    },
    footer: {
      description: "Simple subscription tracking for everyone.",
      links: "Links",
      privacy: "Privacy",
      terms: "Terms",
      support: "Support",
    },
    common: {
      cancel: "Cancel",
      delete: "Delete",
    },
    // App page
    app: {
      title: "SubTally",
      addSubscription: "Add Subscription",
      add: "Add",
      spendingOverview: "Spending Overview",
      yourSubscriptions: "Your Subscriptions",
      totalSpending: "Total spending per",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
      week: "week",
      month: "month",
      year: "year",
      noSubscriptions: "No subscriptions yet",
      getStarted: "Get started by adding your first subscription!",
      dueSoon: "Due Soon",
      settings: "Settings",
      export: "Export Data",
      import: "Import Data",
      confirmImport: "Confirm Import",
      importWarning: "This will overwrite all your current subscription data. Are you sure you want to continue?",
      cancel: "Cancel",
      continue: "Continue",
      importSuccess: "Import successful",
      importError: "Import failed",
      exportSuccess: "Export successful",
      exportError: "Export failed",
      exportSuccessDesc: "Your subscription data has been downloaded.",
      exportErrorDesc: "There was an error exporting your data.",
      fileError: "Error reading file. Please try again.",
      loadingSubscriptions: "Loading your subscriptions...",
      subscriptions: "subscriptions",
      subscriptionsImported: "subscriptions imported",
      willBeImported: "will be imported",
    },
    form: {
      serviceName: "Service Name",
      serviceNamePlaceholder: "Netflix, Spotify, etc.",
      subscriptionName: "Subscription Name",
      subscriptionNamePlaceholder: "e.g., Netflix, Spotify",
      amount: "Amount",
      amountPlaceholder: "9.99",
      currency: "Currency",
      currencyPlaceholder: "Select currency",
      period: "Billing Period",
      billingPeriod: "Billing Period",
      billingPeriodPlaceholder: "Select billing period",
      description: "Description (Optional)",
      descriptionPlaceholder: "Premium plan, family subscription, etc.",
      nextBillingDate: "Next Billing Date",
      addSubscription: "Add Subscription",
      saveSubscription: "Save Subscription",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
    },
    overview: {
      title: "Spending Overview",
      totalSpending: "Total spending per",
      week: "week",
      month: "month",
      year: "year",
      loadingRates: "Loading exchange rates...",
      convertedFrom: "Converted from {count} currencies",
      conversionFailed: "Exchange rates unavailable",
    },
    onboarding: {
      title: "Welcome to SubTally!",
      description: "We've added some example subscriptions to show you how the app works.",
      exampleNote: "These are just demos - click 'Start Tracking' to begin adding your real subscriptions.",
      browseDemos: "Browse Examples",
      startTracking: "Add Subscription",
    },
    subscriptions: {
      title: "Your Subscriptions",
      noSubscriptions: "No subscriptions yet",
      noSubscriptionsDesc: "Add your first subscription to get started tracking your spending.",
      dueSoon: "Due Soon",
      nextBilling: "Next billing:",
      deleteConfirmTitle: "Delete Subscription",
      deleteConfirmDesc: "Are you sure you want to delete {name}? This action cannot be undone.",
    },
    modal: {
      title: "Add New Subscription",
      editTitle: "Edit Subscription",
    },
    settings: {
      title: "Settings",
      baseCurrency: "Base Currency",
      baseCurrencyDesc: "All spending will be converted to this currency",
      selectCurrency: "Select currency",
      currenciesInUse: "Currencies in use",
      dataManagement: "Data Management",
      dataManagementDesc: "Export and import your subscription data",
      dangerZone: "Danger Zone",
      dangerZoneDesc: "These actions cannot be undone",
      deleteAllData: "Delete All Data",
      deleteAllDataDesc: "Permanently delete all your subscription data",
      deleteConfirmTitle: "Delete All Data",
      deleteConfirmMessage: "Are you sure you want to delete ALL your subscription data? This action cannot be undone and all your subscriptions will be permanently lost.",
      typeDeleteToConfirm: "Type 'DELETE' to confirm",
      deleteTypePlaceholder: "Type DELETE here",
      confirmDelete: "Delete Everything",
    },
  },
  zh: {
    // Landing page
    hero: {
      title: "管理您的订阅服务",
      subtitle: "掌控您的定期付款",
      description: "一个简单、隐私优先的工具，帮您在一个地方管理和监控所有数字订阅服务。",
      getStarted: "开始使用",
      learnMore: "了解更多",
    },
    features: {
      title: "为什么选择我们的追踪器？",
      free: {
        title: "免费简约",
        description: "完全免费使用，界面简洁无干扰，专注于重要内容。",
      },
      private: {
        title: "隐私优先",
        description: "您的数据保存在设备上，无追踪，无数据收集。",
      },
      currency: {
        title: "货币转换",
        description: "支持多种货币，自动转换为您偏好的基础货币。",
      },
      export: {
        title: "导入导出",
        description: "随时通过JSON格式备份和恢复您的数据。",
      },
    },
    footer: {
      description: "人人都能使用的简单订阅追踪工具。",
      links: "链接",
      privacy: "隐私",
      terms: "条款",
      support: "支持",
    },
    common: {
      cancel: "取消",
      delete: "删除",
    },
    // App page
    app: {
      title: "SubTally",
      addSubscription: "添加订阅",
      add: "添加",
      spendingOverview: "支出概览",
      yourSubscriptions: "您的订阅",
      totalSpending: "总支出每",
      weekly: "每周",
      monthly: "每月",
      yearly: "每年",
      week: "周",
      month: "月",
      year: "年",
      noSubscriptions: "暂无订阅",
      getStarted: "添加您的第一个订阅开始使用！",
      dueSoon: "即将到期",
      settings: "设置",
      export: "导出数据",
      import: "导入数据",
      confirmImport: "确认导入",
      importWarning: "这将覆盖您当前的所有订阅数据。您确定要继续吗？",
      cancel: "取消",
      continue: "继续",
      importSuccess: "导入成功",
      importError: "导入失败",
      exportSuccess: "导出成功",
      exportError: "导出失败",
      exportSuccessDesc: "您的订阅数据已下载。",
      exportErrorDesc: "导出数据时出现错误。",
      fileError: "读取文件出错。请重试。",
      loadingSubscriptions: "正在加载您的订阅...",
      subscriptions: "个订阅",
      subscriptionsImported: "个订阅已导入",
      willBeImported: "将被导入",
    },
    form: {
      serviceName: "服务名称",
      serviceNamePlaceholder: "Netflix、Spotify 等",
      subscriptionName: "订阅名称",
      subscriptionNamePlaceholder: "例如：Netflix、Spotify",
      amount: "金额",
      amountPlaceholder: "9.99",
      currency: "货币",
      currencyPlaceholder: "选择货币",
      period: "计费周期",
      billingPeriod: "计费周期",
      billingPeriodPlaceholder: "选择计费周期",
      description: "描述（可选）",
      descriptionPlaceholder: "高级套餐、家庭订阅等",
      nextBillingDate: "下次计费日期",
      addSubscription: "添加订阅",
      saveSubscription: "保存订阅",
      weekly: "每周",
      monthly: "每月",
      yearly: "每年",
    },
    overview: {
      title: "支出概览",
      totalSpending: "总支出每",
      week: "周",
      month: "月",
      year: "年",
      loadingRates: "正在加载汇率...",
      convertedFrom: "已从 {count} 种货币转换",
      conversionFailed: "汇率不可用",
    },
    onboarding: {
      title: "欢迎使用 SubTally！",
      description: "我们添加了一些示例订阅来展示应用的工作方式。",
      exampleNote: "这些只是演示 - 点击\"开始跟踪\"来添加您真实的订阅。",
      browseDemos: "浏览示例",
      startTracking: "添加订阅",
    },
    subscriptions: {
      title: "您的订阅",
      noSubscriptions: "暂无订阅",
      noSubscriptionsDesc: "添加您的第一个订阅开始追踪支出。",
      dueSoon: "即将到期",
      nextBilling: "下次计费：",
      deleteConfirmTitle: "删除订阅",
      deleteConfirmDesc: "您确定要删除 {name} 吗？此操作无法撤销。",
    },
    modal: {
      title: "添加新订阅",
      editTitle: "编辑订阅",
    },
    settings: {
      title: "设置",
      baseCurrency: "基础货币",
      baseCurrencyDesc: "所有支出将转换为此货币",
      selectCurrency: "选择货币",
      currenciesInUse: "正在使用的货币",
      dataManagement: "数据管理",
      dataManagementDesc: "导出和导入您的订阅数据",
      dangerZone: "危险区域",
      dangerZoneDesc: "这些操作无法撤销",
      deleteAllData: "删除所有数据",
      deleteAllDataDesc: "永久删除您的所有订阅数据",
      deleteConfirmTitle: "删除所有数据",
      deleteConfirmMessage: "您确定要删除所有订阅数据吗？此操作无法撤销，所有订阅将永久丢失。",
      typeDeleteToConfirm: "输入 'DELETE' 确认",
      deleteTypePlaceholder: "在此输入 DELETE",
      confirmDelete: "删除所有内容",
    },
  },
}

// These functions are now handled by the cookie utilities in lib/cookies.ts

// Translation helper
export const getNestedTranslation = (obj: Translations, path: string, params?: Record<string, string>): string => {
  const keys = path.split(".")
  let current: any = obj

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key]
    } else {
      return path // Return the path if translation not found
    }
  }

  let result = typeof current === "string" ? current : path

  // Replace parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value)
    })
  }

  return result
}
