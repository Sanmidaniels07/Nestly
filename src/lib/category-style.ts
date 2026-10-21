import {
  Baby,
  BookOpen,
  Cake,
  CookingPot,
  Cpu,
  Dumbbell,
  Gem,
  Gift,
  Headphones,
  HeartPulse,
  Laptop,
  LucideIcon,
  Package,
  Palette,
  PartyPopper,
  Scissors,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

// Categories are created by admins with free-text names, so the look is
// matched from keywords in the name/slug. Order matters: more specific
// keywords (e.g. "accessor") come before broader ones ("phone").
const ICONS: [RegExp, LucideIcon][] = [
  [/accessor|gadget/, Headphones],
  [/phone|tablet/, Smartphone],
  [/computer|laptop/, Laptop],
  [/electronic/, Cpu],
  [/cake|pastr|bak/, Cake],
  [/grocer/, ShoppingBasket],
  [/food|drink|meal/, UtensilsCrossed],
  [/furniture/, Sofa],
  [/home|kitchen/, CookingPot],
  [/shoe|bag/, ShoppingBag],
  [/fashion|cloth|wear/, Shirt],
  [/hair|wig/, Scissors],
  [/beauty|skin|cosmetic/, Sparkles],
  [/jewel|watch/, Gem],
  [/health|wellness/, HeartPulse],
  [/baby|kid/, Baby],
  [/book|station/, BookOpen],
  [/gift|hamper/, Gift],
  [/event|party/, PartyPopper],
  [/art|craft|hand/, Palette],
  [/sport|fitness|gym/, Dumbbell],
];

export interface CategoryTone {
  /** Card background + border. */
  card: string;
  /** Solid icon tile. */
  tile: string;
  /** Large faded background icon. */
  ghost: string;
  /** Small text accents (counts, chips). */
  text: string;
  /** Chip background for hero shortcuts. */
  chip: string;
}

// Full class strings (not built dynamically) so Tailwind keeps them.
const TONES: CategoryTone[] = [
  { card: "bg-violet-50/70 border-violet-100 dark:bg-violet-500/[0.07] dark:border-violet-500/20", tile: "bg-gradient-to-br from-violet-500 to-indigo-600", ghost: "text-violet-500/10 dark:text-violet-400/10", text: "text-violet-700 dark:text-violet-300", chip: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300" },
  { card: "bg-rose-50/70 border-rose-100 dark:bg-rose-500/[0.07] dark:border-rose-500/20", tile: "bg-gradient-to-br from-rose-400 to-pink-600", ghost: "text-rose-500/10 dark:text-rose-400/10", text: "text-rose-700 dark:text-rose-300", chip: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" },
  { card: "bg-amber-50/70 border-amber-100 dark:bg-amber-500/[0.07] dark:border-amber-500/20", tile: "bg-gradient-to-br from-amber-400 to-orange-500", ghost: "text-amber-500/10 dark:text-amber-400/10", text: "text-amber-700 dark:text-amber-300", chip: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" },
  { card: "bg-emerald-50/70 border-emerald-100 dark:bg-emerald-500/[0.07] dark:border-emerald-500/20", tile: "bg-gradient-to-br from-emerald-400 to-teal-600", ghost: "text-emerald-500/10 dark:text-emerald-400/10", text: "text-emerald-700 dark:text-emerald-300", chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" },
  { card: "bg-sky-50/70 border-sky-100 dark:bg-sky-500/[0.07] dark:border-sky-500/20", tile: "bg-gradient-to-br from-sky-400 to-blue-600", ghost: "text-sky-500/10 dark:text-sky-400/10", text: "text-sky-700 dark:text-sky-300", chip: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300" },
  { card: "bg-fuchsia-50/70 border-fuchsia-100 dark:bg-fuchsia-500/[0.07] dark:border-fuchsia-500/20", tile: "bg-gradient-to-br from-fuchsia-400 to-purple-600", ghost: "text-fuchsia-500/10 dark:text-fuchsia-400/10", text: "text-fuchsia-700 dark:text-fuchsia-300", chip: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300" },
];

const hash = (value: string) => {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const getCategoryIcon = (category: { name: string; slug: string }): LucideIcon => {
  const key = `${category.name} ${category.slug}`.toLowerCase();
  return ICONS.find(([pattern]) => pattern.test(key))?.[1] ?? Package;
};

// Stable per category (same colour every visit), spread across the palette.
export const getCategoryTone = (category: { slug: string }): CategoryTone =>
  TONES[hash(category.slug) % TONES.length];

export const getToneByIndex = (index: number): CategoryTone => TONES[index % TONES.length];
