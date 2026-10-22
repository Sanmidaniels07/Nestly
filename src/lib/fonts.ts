import { Fraunces, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

// The app's body/UI font. Without it every device fell back to its own
// system font (Segoe UI, SF, Roboto), so Nestly looked different everywhere.
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});