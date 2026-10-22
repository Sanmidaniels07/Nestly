import localFont from "next/font/local";

// Fonts are bundled in src/fonts (variable woff2, latin subset, OFL-licensed)
// instead of next/font/google, which downloads them from Google at build time
// and intermittently failed Vercel builds when that download didn't complete.

// The app's body/UI font. Without it every device fell back to its own
// system font (Segoe UI, SF, Roboto), so Nestly looked different everywhere.
export const jakarta = localFont({
  src: "../fonts/plus-jakarta-sans-latin-wght-normal.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  style: "normal",
  display: "swap",
});

export const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/fraunces-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  weight: "100 800",
  style: "normal",
  display: "swap",
});
