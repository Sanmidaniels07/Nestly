// A seller's brand colour, made safe to use. Whatever colour they pick (pale
// yellow, black, neon green), the store page must stay readable in light and
// dark mode, so the colour is never used raw. It becomes a full 50-950 shade
// ramp in the seller's hue, with each step at the lightness of Nestly's own
// violet, then checked against WCAG contrast:
//
// - light mode: text in shades 600/700 on white and white text on 600 >= 4.5:1
// - dark mode: text in shades 300/400 on the dark surfaces >= 4.5:1, white
//   text on the 600 button >= 4.5:1 and the button itself >= 3:1 against the
//   page, so it doesn't disappear
//
// Shade 600 (buttons) is the seller's exact colour whenever it passes; when
// it doesn't, only its lightness moves, so it still reads as their colour.
// The ramp replaces Tailwind's violet and indigo inside <BrandScope>, so
// every accent on those pages follows the brand without touching components.

type Rgb = [number, number, number];
type Lch = [number, number, number];

export const BRAND_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
type Step = (typeof BRAND_STEPS)[number];

// Tailwind's violet (Nestly's accent): lightness and chroma per step.
const VIOLET: Record<Step, [number, number]> = {
  50: [0.969, 0.016],
  100: [0.943, 0.029],
  200: [0.894, 0.057],
  300: [0.811, 0.111],
  400: [0.702, 0.183],
  500: [0.606, 0.25],
  600: [0.541, 0.281],
  700: [0.491, 0.27],
  800: [0.432, 0.232],
  900: [0.38, 0.189],
  950: [0.283, 0.141],
};

// Page surfaces (globals.css).
const LIGHT_SURFACES = ["#ffffff", "#f7f7fb"];
const DARK_SURFACES = ["#16151f", "#1e1d2a"];
const WHITE = "#ffffff";
export const MIN_TEXT_CONTRAST = 4.5;
const MIN_UI_CONTRAST = 3;

// Preset colours offered in settings. Any custom colour works too.
export const BRAND_PRESETS = [
  { name: "Nestly violet", hex: "#7c3aed" },
  { name: "Royal blue", hex: "#2563eb" },
  { name: "Teal", hex: "#0f766e" },
  { name: "Forest", hex: "#15803d" },
  { name: "Gold", hex: "#ca8a04" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Red", hex: "#dc2626" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Pink", hex: "#db2777" },
  { name: "Chocolate", hex: "#7c4a2d" },
  { name: "Black", hex: "#111111" },
] as const;

export const isBrandHex = (value: unknown): value is string => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);

// ---- colour maths (sRGB <-> OKLab/OKLCH) ----

const hexToRgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const rgbToHex = (rgb: Rgb) =>
  "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const fromLinear = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

const rgbToOklch = (rgb: Rgb): Lch => {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
};

// Linear-free sRGB, possibly out of range (out of gamut).
const oklchToRgbRaw = ([L, C, H]: Lch): Rgb => {
  const A = C * Math.cos((H * Math.PI) / 180);
  const B = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
};
const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);

// Keep lightness and hue, lower chroma until it's a real sRGB colour.
const oklchToHex = ([L, C, H]: Lch) => {
  let lo = 0;
  let hi = C;
  if (!inGamut(oklchToRgbRaw([L, C, H]))) {
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToRgbRaw([L, mid, H]))) lo = mid;
      else hi = mid;
    }
    C = lo;
  }
  return rgbToHex(oklchToRgbRaw([L, C, H]));
};

const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const minContrast = (hex: string, against: string[]) => Math.min(...against.map((c) => contrast(hex, c)));

// Move lightness (darker or lighter) in small steps until `ok` passes.
const shift = (lch: Lch, direction: -1 | 1, ok: (hex: string) => boolean) => {
  let [L] = lch;
  for (let i = 0; i < 100; i++) {
    const hex = oklchToHex([L, lch[1], lch[2]]);
    if (ok(hex)) return hex;
    L = Math.min(0.99, Math.max(0.02, L + direction * 0.01));
  }
  return oklchToHex([L, lch[1], lch[2]]);
};

export interface BrandTheme {
  light: Record<Step, string>;
  dark: Record<Step, string>;
  // The colour as the seller picked it.
  picked: string;
  // True when the button colour had to be shaded to stay readable.
  adjustedLight: boolean;
  adjustedDark: boolean;
}

const cache = new Map<string, BrandTheme>();

export function brandTheme(picked: string): BrandTheme {
  const key = picked.toLowerCase();
  const hit = cache.get(key);
  if (hit) return hit;

  const own = rgbToOklch(hexToRgb(key));
  const [, C0, H0] = own;
  // Greys stay grey; vivid colours get violet-level vividness.
  const vividness = Math.min(1.1, C0 / 0.2);
  const hue = C0 < 0.01 ? 0 : H0;

  const base = {} as Record<Step, string>;
  for (const step of BRAND_STEPS) {
    const [L, C] = VIOLET[step];
    base[step] = oklchToHex([L, C * vividness, hue]);
  }

  // ---- light mode ----
  const light = { ...base };
  const lightText = (hex: string) => minContrast(hex, [...LIGHT_SURFACES, light[50]]) >= MIN_TEXT_CONTRAST && contrast(hex, WHITE) >= MIN_TEXT_CONTRAST;
  // Buttons and links: the seller's own colour if it passes, else darkened.
  light[600] = shift(own, -1, lightText);
  for (const step of [700, 800, 900, 950] as const) {
    // Darker steps must stay darker than 600 and readable.
    const lch = rgbToOklch(hexToRgb(base[step]));
    const darker = Math.min(lch[0], rgbToOklch(hexToRgb(light[600]))[0] - (VIOLET[600][0] - VIOLET[step][0]));
    light[step] = shift([Math.max(0.12, darker), lch[1], lch[2]], -1, lightText);
  }

  // ---- dark mode ----
  const dark = { ...base };
  const darkText = (hex: string) => minContrast(hex, DARK_SURFACES) >= MIN_TEXT_CONTRAST;
  for (const step of [300, 400] as const) dark[step] = shift(rgbToOklch(hexToRgb(base[step])), 1, darkText);
  // The button: white text must read on it, and it must stand out from the
  // dark page. Prefer the seller's exact colour, else the nearest shade.
  const darkButton = (hex: string) => contrast(hex, WHITE) >= MIN_TEXT_CONTRAST && minContrast(hex, DARK_SURFACES) >= MIN_UI_CONTRAST;
  if (darkButton(key)) dark[600] = key;
  else {
    const L0 = own[0];
    const up = shift(own, 1, darkButton);
    const down = shift(own, -1, darkButton);
    const dist = (hex: string) => (darkButton(hex) ? Math.abs(rgbToOklch(hexToRgb(hex))[0] - L0) : Infinity);
    dark[600] = dist(up) <= dist(down) ? up : down;
    // Nothing fits both (rare): white text wins - it's what people read.
    if (!darkButton(dark[600])) dark[600] = light[600];
  }
  dark[700] = shift(rgbToOklch(hexToRgb(dark[600])), -1, (hex) => contrast(hex, WHITE) >= MIN_TEXT_CONTRAST && luminance(hex) < luminance(dark[600]));

  const theme: BrandTheme = {
    light,
    dark,
    picked: key,
    adjustedLight: light[600] !== key,
    adjustedDark: dark[600] !== key,
  };
  cache.set(key, theme);
  return theme;
}

// CSS for <BrandScope>: Tailwind's violet and indigo, replaced by the brand
// ramp inside [data-brand=...], with dark-mode shades under .dark.
export function brandCss(picked: string): string {
  if (!isBrandHex(picked)) return "";
  const { light, dark } = brandTheme(picked);
  const vars = (ramp: Record<Step, string>) =>
    BRAND_STEPS.map((step) => `--color-violet-${step}:${ramp[step]};--color-indigo-${step}:${ramp[step]};`).join("");
  const id = picked.slice(1).toLowerCase();
  return `[data-brand="${id}"]{${vars(light)}--brand-picked:${picked};}.dark [data-brand="${id}"]{${vars(dark)}}`;
}
