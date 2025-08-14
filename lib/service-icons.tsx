import {
  Play,
  Music,
  Video,
  Tv,
  Cloud,
  Code,
  Gamepad2,
  BookOpen,
  Camera,
  Mail,
  CreditCard,
  Smartphone,
  Wifi,
  Car,
  Home,
  Dumbbell,
  Coffee,
  ShoppingBag,
  Globe,
} from "lucide-react"

const serviceIconMap: Record<string, any> = {
  // Streaming Services
  netflix: Tv,
  disney: Play,
  "disney+": Play,
  hulu: Video,
  "amazon prime": Play,
  "prime video": Play,
  hbo: Tv,
  "hbo max": Tv,
  "apple tv": Tv,
  paramount: Tv,
  peacock: Tv,
  "youtube premium": Play,
  crunchyroll: Video,

  // Music Services
  spotify: Music,
  "apple music": Music,
  "amazon music": Music,
  "youtube music": Music,
  tidal: Music,
  pandora: Music,

  // Cloud Storage
  "google drive": Cloud,
  dropbox: Cloud,
  icloud: Cloud,
  onedrive: Cloud,
  box: Cloud,

  // Development Tools
  github: Code,
  vercel: Code,
  netlify: Code,
  figma: Code,
  adobe: Code,
  canva: Code,

  // Gaming
  xbox: Gamepad2,
  playstation: Gamepad2,
  nintendo: Gamepad2,
  steam: Gamepad2,
  "epic games": Gamepad2,

  // Education
  coursera: BookOpen,
  udemy: BookOpen,
  skillshare: BookOpen,
  masterclass: BookOpen,
  duolingo: BookOpen,

  // Photography
  "adobe photoshop": Camera,
  lightroom: Camera,
  unsplash: Camera,

  // Email & Communication
  gmail: Mail,
  outlook: Mail,
  slack: Mail,
  zoom: Mail,
  teams: Mail,

  // Finance
  mint: CreditCard,
  ynab: CreditCard,
  quickbooks: CreditCard,

  // Mobile & Internet
  verizon: Smartphone,
  "at&t": Smartphone,
  "t-mobile": Smartphone,
  comcast: Wifi,
  spectrum: Wifi,

  // Transportation
  uber: Car,
  lyft: Car,
  tesla: Car,

  // Home & Utilities
  ring: Home,
  nest: Home,
  "smart things": Home,

  // Fitness
  peloton: Dumbbell,
  nike: Dumbbell,
  strava: Dumbbell,
  myfitnesspal: Dumbbell,

  // Food & Delivery
  starbucks: Coffee,
  doordash: ShoppingBag,
  "uber eats": ShoppingBag,
  grubhub: ShoppingBag,

  // Shopping
  amazon: ShoppingBag,
  costco: ShoppingBag,
  target: ShoppingBag,
}

export function getServiceIcon(serviceName: string) {
  const normalizedName = serviceName.toLowerCase().trim()

  // Try exact match first
  if (serviceIconMap[normalizedName]) {
    return serviceIconMap[normalizedName]
  }

  // Try partial matches
  for (const [key, icon] of Object.entries(serviceIconMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return icon
    }
  }

  // Default icon
  return Globe
}
