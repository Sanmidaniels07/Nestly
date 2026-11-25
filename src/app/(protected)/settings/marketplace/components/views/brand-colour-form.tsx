"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Moon, Palette, Sun } from "lucide-react";

import { useUpdateStore } from "@/src/hooks/use-update-store";
import { BRAND_PRESETS, brandTheme, isBrandHex } from "@/src/lib/brand-color";
import { Store } from "@/src/types/store";

const NESTLY = "#7c3aed";

// "7C3AED", "#7c3aed", "#73e" -> "#7c3aed" (or null if it isn't a colour yet).
const normalise = (value: string) => {
  const hex = value.trim().replace(/^#/, "").toLowerCase();
  const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;
  return /^[0-9a-f]{6}$/.test(full) ? `#${full}` : null;
};

// The seller's brand colour on their store page, products and pay links.
// Any colour can be picked: it's shaded where needed so text and buttons
// stay readable in light and dark mode, and the preview shows exactly that.
export default function BrandColourForm({ store }: { store: Store }) {
  const { mutate: updateStore, isPending } = useUpdateStore();
  const saved = isBrandHex(store.brandColor) ? store.brandColor.toLowerCase() : null;
  const [picked, setPicked] = useState<string | null>(saved);
  const [typed, setTyped] = useState(saved ?? "");

  const colour = picked ?? NESTLY;
  const theme = brandTheme(colour);
  const changed = picked !== saved;

  const choose = (hex: string | null) => {
    setPicked(hex);
    setTyped(hex ?? "");
  };

  const save = () => updateStore({ id: store.id, data: { brandColor: picked ?? "" } });

  return (
    <section id="brand-colour" className="scroll-mt-24 rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <h2 className="flex items-center gap-2 font-[family-name:var(--font-fraunces)] text-[20px] text-ink">
        <Palette size={19} className="text-violet-600 dark:text-violet-400" /> Brand colour
      </h2>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        Used for buttons, prices and links on your{" "}
        <Link href={`/marketplace/seller/${store.slug}`} className="font-semibold text-violet-700 hover:underline dark:text-violet-300">
          store page
        </Link>
        , your products and your pay links. Pick any colour - we shade it where needed so everything stays easy to read, in light and dark
        mode.
      </p>

      <div className="mt-5 flex flex-wrap gap-2.5" role="radiogroup" aria-label="Brand colour">
        {BRAND_PRESETS.map(({ name, hex }) => {
          const active = (picked ?? NESTLY) === hex;
          return (
            <button
              key={hex}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={name}
              title={name}
              onClick={() => choose(hex === NESTLY ? null : hex)}
              className={`flex h-10 w-10 items-center justify-center rounded-full ring-offset-2 ring-offset-surface transition-shadow ${
                active ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-2 hover:ring-line-strong"
              }`}
              style={{ background: hex }}
            >
              {active && <Check size={16} className="text-white drop-shadow" strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex h-11 items-center gap-2.5 rounded-xl border border-line bg-surface pl-1.5 pr-3 focus-within:border-violet-400">
          <input
            type="color"
            value={colour}
            onChange={(e) => choose(e.target.value.toLowerCase())}
            aria-label="Pick your own colour"
            className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
          />
          <span className="text-[12.5px] font-medium text-muted">Your own</span>
          <input
            value={typed}
            onChange={(e) => {
              setTyped(e.target.value);
              const hex = normalise(e.target.value);
              if (hex) setPicked(hex);
            }}
            placeholder="#7C3AED"
            aria-label="Colour code"
            autoCapitalize="none"
            autoCorrect="off"
            className="h-full w-24 bg-transparent font-[family-name:var(--font-mono)] text-[16px] uppercase text-ink outline-none placeholder:text-subtle sm:text-[13.5px]"
          />
        </label>
        {picked !== null && (
          <button type="button" onClick={() => choose(null)} className="text-[12.5px] font-semibold text-muted hover:text-ink">
            Use Nestly colours
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Preview mode="light" name={store.name} theme={theme} />
        <Preview mode="dark" name={store.name} theme={theme} />
      </div>
      {(theme.adjustedLight || theme.adjustedDark) && picked !== null && (
        <p className="mt-2.5 text-[12px] leading-relaxed text-muted">
          Your colour is {theme.adjustedLight && theme.adjustedDark ? "shaded slightly in both modes" : theme.adjustedLight ? "a little darker in light mode" : "a little lighter in dark mode"} so the
          writing on it stays easy to read.
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={!changed || isPending}
          className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-[13.5px] font-semibold text-white transition-opacity disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save brand colour"}
        </button>
      </div>
    </section>
  );
}

// How the colour looks on the store page, in one mode - with that mode's
// real page colours, whatever mode the seller is using now.
function Preview({ mode, name, theme }: { mode: "light" | "dark"; name: string; theme: ReturnType<typeof brandTheme> }) {
  const dark = mode === "dark";
  const ramp = theme[mode];
  const surface = dark ? "#16151f" : "#ffffff";
  const ink = dark ? "#f2f1f8" : "#13131a";
  const muted = dark ? "#a3a0b6" : "#64748b";
  const line = dark ? "#2a2839" : "#ece9f6";
  return (
    <div className="rounded-xl border p-4" style={{ background: surface, borderColor: line }}>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: muted }}>
        {dark ? <Moon size={12} /> : <Sun size={12} />} {dark ? "Dark mode" : "Light mode"}
      </p>
      <p className="mt-2 truncate text-[15px] font-semibold" style={{ color: ink }}>
        {name}
      </p>
      <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[16px] font-semibold" style={{ color: dark ? ramp[300] : ramp[700] }}>
        ₦12,500
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex h-9 items-center rounded-lg px-4 text-[12.5px] font-semibold text-white" style={{ background: ramp[600] }}>
          Buy now
        </span>
        <span
          className="flex h-9 items-center rounded-lg border px-3 text-[12.5px] font-semibold"
          style={{ borderColor: ramp[600], color: dark ? ramp[300] : ramp[700] }}
        >
          Follow
        </span>
        <span className="text-[12.5px] font-medium underline" style={{ color: dark ? ramp[400] : ramp[600] }}>
          See reviews
        </span>
      </div>
    </div>
  );
}
