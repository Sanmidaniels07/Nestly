"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, MapPinOff, Megaphone, Truck } from "lucide-react";

import { useCustomerMap } from "@/src/hooks/use-customer-map";
import { areaSlug, stateLabel, stateSlug } from "@/src/lib/locations";
import { CustomerMapState, CustomerMapTally } from "@/src/types/customer-map";

// Where a store's customers are: a tile map of Nigeria (one square per
// state, roughly where it sits) shaded by how many orders or interested
// shoppers came from it, and a heat grid of the selected state's areas.
// Areas with shoppers but no delivery are called out - that's demand the
// seller is missing.

// [column, row, short label] on a 7 x 7 grid.
const TILES: Record<string, [number, number, string]> = {
  Sokoto: [1, 0, "SO"], Katsina: [3, 0, "KT"], Jigawa: [4, 0, "JI"], Yobe: [5, 0, "YO"], Borno: [6, 0, "BO"],
  Kebbi: [1, 1, "KE"], Zamfara: [2, 1, "ZA"], Kano: [3, 1, "KN"], Bauchi: [4, 1, "BA"], Gombe: [5, 1, "GO"], Adamawa: [6, 1, "AD"],
  Kwara: [1, 2, "KW"], Niger: [2, 2, "NI"], Kaduna: [3, 2, "KD"], Plateau: [4, 2, "PL"], Taraba: [5, 2, "TA"],
  Oyo: [0, 3, "OY"], Osun: [1, 3, "OS"], Kogi: [2, 3, "KO"], "Federal Capital Territory": [3, 3, "FCT"], Nasarawa: [4, 3, "NA"], Benue: [5, 3, "BE"],
  Ogun: [0, 4, "OG"], Ekiti: [1, 4, "EK"], Edo: [2, 4, "ED"], Enugu: [3, 4, "EN"], Ebonyi: [4, 4, "EB"], "Cross River": [5, 4, "CR"],
  Lagos: [0, 5, "LA"], Ondo: [1, 5, "ON"], Delta: [2, 5, "DE"], Anambra: [3, 5, "AN"], Abia: [4, 5, "AB"], "Akwa Ibom": [5, 5, "AK"],
  Bayelsa: [2, 6, "BY"], Imo: [3, 6, "IM"], Rivers: [4, 6, "RI"],
};

// One hue, light to dark (dark mode: dark to light). Step 0 = nobody.
const STEPS = [
  "bg-surface-sunken text-subtle",
  "bg-violet-100 text-violet-900 dark:bg-[#2b1d55] dark:text-violet-100",
  "bg-violet-200 text-violet-900 dark:bg-[#3c2780] dark:text-violet-50",
  "bg-violet-300 text-violet-950 dark:bg-[#5534b8] dark:text-white",
  "bg-violet-500 text-white dark:bg-[#7c5ce8] dark:text-white",
  "bg-violet-700 text-white dark:bg-[#b9a6fb] dark:text-violet-950",
];

const step = (count: number, max: number) => (count <= 0 || max <= 0 ? 0 : Math.min(5, Math.max(1, Math.ceil((count / max) * 5))));

const MEASURES = [
  { key: "orders", label: "Orders", noun: ["order", "orders"] },
  { key: "interested", label: "Interested shoppers", noun: ["shopper", "shoppers"] },
] as const;

type Measure = (typeof MEASURES)[number];

const n = (count: number, measure: Measure) => `${count.toLocaleString()} ${measure.noun[count === 1 ? 0 : 1]}`;

export default function CustomerMap({ days }: { days: number }) {
  const { data, isLoading } = useCustomerMap(days);
  const [measureKey, setMeasureKey] = useState<Measure["key"]>("interested");
  const [picked, setPicked] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  if (isLoading || !data) {
    return <div className="h-[460px] animate-pulse rounded-2xl border border-line bg-surface-2" />;
  }

  const measure = MEASURES.find((m) => m.key === measureKey)!;
  const tally: CustomerMapTally = data[measure.key];
  const byState = new Map(tally.states.map((s) => [s.state, s]));
  const max = Math.max(0, ...tally.states.map((s) => s.count));
  const selected = byState.get(picked ?? "") ?? tally.states[0] ?? null;
  const readout = hovered ? (byState.get(hovered) ?? { state: hovered, count: 0, delivers: "none" as const }) : null;

  // Shoppers in areas the store doesn't deliver to, across the country.
  const missed = data.interested.states
    .flatMap((s) => s.areas.filter((a) => a.count > 0 && !a.delivers).map((a) => ({ ...a, state: s.state })))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const listed = tally.states.flatMap((s) => s.areas.filter((a) => a.listed).map((a) => ({ ...a, state: s.state })));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex gap-0.5 rounded-xl bg-surface-2 p-1">
          {MEASURES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMeasureKey(m.key)}
              aria-pressed={m.key === measureKey}
              className={`rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-all ${
                m.key === measureKey ? "bg-surface text-violet-700 shadow-sm dark:bg-track dark:text-violet-300" : "text-muted hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-[12.5px] text-muted">
          <span className="font-[family-name:var(--font-mono)] font-semibold text-ink">{tally.total.toLocaleString()}</span> {measure.noun[1]} in the
          last {days} days{tally.unknown > 0 && <> · {tally.unknown.toLocaleString()} without a location</>}
        </p>
      </div>

      <p className="text-[12.5px] leading-relaxed text-subtle">
        {measure.key === "orders"
          ? "Paid orders, by delivery address."
          : "Signed-in people who followed your store, visited it, or viewed or saved your products - by the address or location on their account."}
      </p>

      {/* Nigeria */}
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-start sm:p-5">
        <div className="w-full max-w-[360px] shrink-0">
          <div className="grid grid-cols-7 gap-[3px]">
            {Object.entries(TILES).map(([state, [col, row, label]]) => {
              const entry = byState.get(state);
              const count = entry?.count ?? 0;
              const isSelected = selected?.state === state;
              return (
                <button
                  key={state}
                  type="button"
                  onClick={() => setPicked(state)}
                  onMouseEnter={() => setHovered(state)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(state)}
                  onBlur={() => setHovered(null)}
                  aria-label={`${stateLabel(state)}: ${n(count, measure)}`}
                  aria-pressed={isSelected}
                  style={{ gridColumnStart: col + 1, gridRowStart: row + 1 }}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-[6px] transition-transform hover:scale-[1.06] ${STEPS[step(count, max)]} ${
                    isSelected ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""
                  }`}
                >
                  <span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold leading-none sm:text-[11px]">{label}</span>
                  {count > 0 && <span className="mt-0.5 font-[family-name:var(--font-mono)] text-[10px] leading-none opacity-90">{count}</span>}
                  {entry && entry.delivers !== "none" && (
                    <span className="absolute right-[3px] top-[3px] h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-surface" aria-hidden />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <p className="min-h-[20px] text-[12.5px] text-muted" aria-live="polite">
            {readout ? (
              <>
                <span className="font-semibold text-ink">{stateLabel(readout.state)}</span>: {n(readout.count, measure)}
                {readout.delivers !== "none" && <> · you deliver {readout.delivers === "all" ? "across the state" : "to parts of it"}</>}
              </>
            ) : (
              "Tap a state to see its areas"
            )}
          </p>
          <Legend max={max} measure={measure} />
          {/* The same numbers as a list */}
          {tally.states.some((s) => s.count > 0) && (
            <ol className="divide-y divide-line border-t border-line">
              {tally.states
                .filter((s) => s.count > 0)
                .slice(0, 6)
                .map((s) => (
                  <li key={s.state}>
                    <button
                      type="button"
                      onClick={() => setPicked(s.state)}
                      className={`flex w-full items-center justify-between gap-3 py-2 text-left text-[13px] ${
                        s.state === selected?.state ? "font-semibold text-ink" : "text-ink-2 hover:text-violet-700 dark:hover:text-violet-300"
                      }`}
                    >
                      <span>{stateLabel(s.state)}</span>
                      <span className="font-[family-name:var(--font-mono)] text-[12px]">{s.count.toLocaleString()}</span>
                    </button>
                  </li>
                ))}
            </ol>
          )}
        </div>
      </div>

      {/* Selected state's areas */}
      <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        {selected ? <AreaGrid state={selected} measure={measure} /> : <EmptyState measure={measure} />}
      </div>

      {(missed.length > 0 || listed.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {missed.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/25 dark:bg-amber-500/10">
              <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                <MapPinOff size={15} className="text-amber-600 dark:text-amber-400" /> Shoppers where you don&apos;t deliver
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                {missed.map((a, i) => (
                  <span key={`${a.state}-${a.area}`}>
                    {i > 0 && ", "}
                    <span className="font-medium text-ink-2">{a.area}</span> ({a.count})
                  </span>
                ))}
                . Add a delivery zone to sell to them.
              </p>
              <Link href="/settings/marketplace?tab=store" className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-amber-700 hover:underline dark:text-amber-300">
                <Truck size={13} /> Set delivery zones
              </Link>
            </div>
          )}
          {listed.length > 0 && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/25 dark:bg-violet-500/10">
              <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                <Megaphone size={15} className="text-violet-600 dark:text-violet-400" /> Shoppers searching these areas find you
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Your store is listed on Nestly&apos;s local pages for{" "}
                {listed.slice(0, 8).map((a, i) => (
                  <span key={`${a.state}-${a.area}`}>
                    {i > 0 && ", "}
                    <Link
                      href={`/marketplace/locations/${stateSlug(a.state)}/${areaSlug(a.area)}`}
                      className="font-medium text-violet-700 hover:underline dark:text-violet-300"
                    >
                      {a.area}
                    </Link>
                  </span>
                ))}
                {listed.length > 8 && ` and ${listed.length - 8} more`} - the pages Google and AI assistants show for searches like &quot;buy in{" "}
                {listed[0].area}&quot;. Every area you add to a delivery zone adds a page.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AreaGrid({ state, measure }: { state: CustomerMapState; measure: Measure }) {
  const max = Math.max(0, ...state.areas.map((a) => a.count));
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-ink">{stateLabel(state.state)}</h3>
        <p className="text-[12.5px] text-muted">{n(state.count, measure)}</p>
      </div>
      {state.areas.length === 0 ? (
        <p className="mt-4 text-[13px] text-subtle">
          No recognised areas yet{state.otherAreas > 0 && ` - ${n(state.otherAreas, measure)} in places Nestly doesn't list`}.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-[3px]">
          {state.areas.map((area) => (
            <li
              key={area.area}
              title={`${area.area}: ${n(area.count, measure)}${area.delivers ? "" : " - you don't deliver here"}`}
              className={`relative flex min-h-[58px] flex-col justify-between rounded-[6px] px-2.5 py-2 ${STEPS[step(area.count, max)]} ${
                area.delivers ? "" : "outline-dashed outline-1 -outline-offset-2 outline-amber-500"
              }`}
            >
              <span className="flex items-start justify-between gap-1">
                <span className="text-[12px] font-medium leading-tight">{area.area}</span>
                {area.listed && <MapPin size={11} className="mt-px shrink-0 opacity-80" aria-label="Your store is listed on this area's page" />}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[12px] font-semibold">{area.count}</span>
            </li>
          ))}
        </ul>
      )}
      {state.otherAreas > 0 && state.areas.length > 0 && (
        <p className="mt-3 text-[12px] text-subtle">
          + {n(state.otherAreas, measure)} elsewhere in {stateLabel(state.state)}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px] outline-dashed outline-1 -outline-offset-1 outline-amber-500" /> You don&apos;t deliver here
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={11} /> Your store is on this area&apos;s Nestly page
        </span>
      </div>
    </>
  );
}

function Legend({ max, measure }: { max: number; measure: Measure }) {
  return (
    <div className="space-y-1.5 text-[11.5px] text-muted">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>Fewer</span>
        <span className="flex gap-[2px]">
          {STEPS.slice(1).map((classes) => (
            <span key={classes} className={`h-3 w-5 rounded-[3px] ${classes}`} />
          ))}
        </span>
        <span>More{max > 0 && ` (up to ${n(max, measure)})`}</span>
      </div>
      <p className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> You deliver there
      </p>
    </div>
  );
}

function EmptyState({ measure }: { measure: Measure }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
      <MapPin className="h-8 w-8 text-faint" strokeWidth={1.5} />
      <p className="mt-3 text-[14px] font-medium text-ink">No {measure.noun[1]} with a location yet</p>
      <p className="mt-1 max-w-xs text-[13px] text-subtle">Share your store link - as people follow, visit and order, you&apos;ll see where they are.</p>
    </div>
  );
}
