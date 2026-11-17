"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, MapPin, X } from "lucide-react";

import { useFeedAreaOptions, useSetFeedArea } from "@/src/hooks/use-shopping-feed";
import { NIGERIAN_STATES } from "@/src/lib/google-maps";
import { FeedArea } from "@/src/types/shopping-feed";

const WHOLE_STATE = "__state__";

// "Where are you?" for Near me: a state, then a neighbourhood (or the
// whole state). Saved to the account, so it's asked once.
export default function AreaPicker({ current, onClose }: { current: FeedArea | null; onClose: () => void }) {
  const [state, setState] = useState(current?.state ?? "");
  const [area, setArea] = useState(current?.area ?? (current ? WHOLE_STATE : ""));
  const { data: areas, isLoading } = useFeedAreaOptions(state);
  const { mutate: save, isPending } = useSetFeedArea();

  const field =
    "h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-[16px] text-ink outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-60 sm:text-[14px]";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!state) return;
    save({ state, area: area && area !== WHOLE_STATE ? area : null }, { onSuccess: onClose });
  };

  // Portalled to <body>: the feed column is its own stacking context, which
  // would otherwise leave the bottom nav and install banner on top.
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Choose your area"
        className="w-full rounded-t-3xl bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-md sm:rounded-3xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-[family-name:var(--font-fraunces)] text-[22px] text-ink">
              <MapPin size={20} className="text-violet-600 dark:text-violet-400" /> Where are you?
            </h2>
            <p className="mt-0.5 text-[12.5px] text-muted">We&apos;ll show shops that are based in or deliver to your area.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-3.5">
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">State</span>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setArea("");
              }}
              className={field}
            >
              <option value="">Choose your state…</option>
              {NIGERIAN_STATES.map((name) => (
                <option key={name} value={name}>
                  {name === "Federal Capital Territory" ? "Abuja (FCT)" : name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Area</span>
            <select value={area} onChange={(e) => setArea(e.target.value)} disabled={!state || isLoading} className={field}>
              <option value="">{!state ? "Choose a state first" : isLoading ? "Loading areas…" : "Choose your area…"}</option>
              {state && <option value={WHOLE_STATE}>Anywhere in {state === "Federal Capital Territory" ? "Abuja" : state}</option>}
              {areas?.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={!state || !area || isPending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[14px] font-semibold text-white hover:brightness-110 disabled:opacity-60"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />} Show what&apos;s near me
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
