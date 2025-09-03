# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build production version  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint (Note: errors ignored during builds via next.config.mjs)

## Architecture Overview

This is SubTally, a Next.js 15 subscription tracking application built with TypeScript, React 19, and Tailwind CSS. The app is privacy-first, storing all data in localStorage without external APIs or databases.

### Key Architecture Patterns

**Client-Side Data Storage**: All subscription data is stored in localStorage. The app works entirely offline with no backend dependencies.

**Internationalization (i18n)**: Full bilingual support (English/Chinese) implemented via:
- `contexts/language-context.tsx` - Language state management
- `lib/i18n.ts` - Translation definitions and utilities
- Nested translation keys with parameter substitution support
- Browser language detection with localStorage persistence

**Component Structure**:
- `app/page.tsx` - Main app page with subscription management logic
- `app/layout.tsx` - Root layout with theme and language providers
- Landing page at root `/` with app functionality at `/app`

**Theme System**: Dual theme support (light/dark) via `contexts/theme-context.tsx` using next-themes.

### UI Component System

Built on shadcn/ui components with Radix UI primitives:
- Components located in `components/ui/`
- Configuration in `components.json` using "new-york" style
- Lucide React for icons
- Tailwind CSS for styling with CSS variables

### Key Data Models

**Subscription Interface** (defined in `app/page.tsx`):
```typescript
interface Subscription {
  id: string
  name: string
  amount: number
  period: 'weekly' | 'monthly' | 'yearly'
  nextBillingDate: Date
  description?: string
}
```

### Component Architecture

**Feature Components**:
- `subscription-form.tsx` - Add/edit subscription modal with react-hook-form + zod validation
- `subscription-list.tsx` - Display subscriptions with period conversion and due date alerts
- `spending-overview.tsx` - Financial summary with period-based calculations
- `language-switcher.tsx` / `theme-switcher.tsx` - UI controls for user preferences

**State Management**: React Context pattern for global state (language, theme) with localStorage persistence.

### Translation System

Use the `t()` function from `useLanguage()` hook:
- Nested keys: `t("subscriptions.deleteConfirmTitle")`  
- Parameter substitution: `t("subscriptions.deleteConfirmDesc", { name: "Netflix" })`
- All user-facing text must be translatable

### Local Storage Keys

- `language` - User's selected language preference
- `subscriptions` - Array of subscription data (main data store)

### Import/Export Functionality

The app includes JSON-based data export/import for backup and restoration, implemented directly in the main page component.