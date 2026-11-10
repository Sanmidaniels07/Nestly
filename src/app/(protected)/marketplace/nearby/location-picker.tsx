"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Home, Loader2, LocateFixed, Map as MapIcon, MapPin, Search, X } from "lucide-react";
import toast from "react-hot-toast";

import { useAddresses } from "@/src/hooks/use-addresses";
import { useDetectState, usePlaceSearch } from "@/src/hooks/use-locations";
import { NearbyPlace, PlaceSuggestion } from "@/src/types/location";

interface Props {
  onPick: (place: NearbyPlace) => void;
  onClose?: () => void;
}

const TYPE_ICON = { area: MapPin, city: Building2, state: MapIcon } as const;
const TYPE_LABEL = { area: "Area", city: "City", state: "State" } as const;

const sellers = (count: number) => (count === 0 ? "No sellers yet" : `${count} seller${count === 1 ? "" : "s"}`);

// Typed text settles before it's searched, so each keystroke isn't a request.
const useDebounced = (value: string, ms = 250) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return debounced;
};

/**
 * Where to shop near: search any area, city or state, use the phone's
 * location, or pick a saved delivery address. Places with sellers come first.
 */
export default function LocationPicker({ onPick, onClose }: Props) {
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query.trim());
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: places, isFetching } = usePlaceSearch(debounced);
  const { data: addresses } = useAddresses();
  const { mutate: detect, isPending: detecting } = useDetectState();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const useMyLocation = () =>
    detect(undefined, {
      onSuccess: (found) => {
        if (!found.state) {
          toast.error("We couldn't tell where you are. Search for your area instead.");
          return;
        }
        onPick({ state: found.state, city: found.city, area: found.area ?? null, label: found.label ?? found.state });
      },
      onError: (error) => toast.error(error instanceof Error ? error.message : "Couldn't get your location."),
    });

  const savedAddresses = (addresses ?? []).filter((address) => address.city || address.state);
  const showSaved = !query.trim() && savedAddresses.length > 0;

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 shadow-lg sm:p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-12 flex-1 items-center gap-2.5 rounded-xl border border-line bg-surface-sunken px-3.5 focus-within:border-violet-400">
          <Search size={17} className="shrink-0 text-subtle" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Area, city or state"
            aria-label="Search your area, city or state"
            className="h-full w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-subtle"
          />
          {isFetching && <Loader2 size={15} className="shrink-0 animate-spin text-subtle" />}
          {query && !isFetching && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-subtle hover:text-ink">
              <X size={15} />
            </button>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="h-12 shrink-0 rounded-xl px-3 text-[13px] font-medium text-muted hover:text-ink"
          >
            Cancel
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={useMyLocation}
        disabled={detecting}
        className="flex w-full items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-3 text-left text-[13.5px] font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:opacity-70 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/15"
      >
        {detecting ? <Loader2 size={17} className="animate-spin" /> : <LocateFixed size={17} />}
        {detecting ? "Finding you..." : "Use my current location"}
      </button>

      {showSaved && (
        <div className="space-y-1.5">
          <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.25em] text-subtle">Saved addresses</p>
          {savedAddresses.map((address) => (
            <button
              key={address.id}
              type="button"
              onClick={() =>
                onPick({ state: address.state, city: address.city, area: null, label: [address.city, address.state].filter(Boolean).join(", ") })
              }
              className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-surface-sunken"
            >
              <Home size={16} className="shrink-0 text-muted" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium text-ink">
                  {[address.city, address.state].filter(Boolean).join(", ")}
                </span>
                <span className="block truncate text-[12px] text-subtle">{address.address}</span>
              </span>
              {address.isDefault && (
                <span className="shrink-0 rounded-full bg-surface-sunken px-2 py-0.5 text-[10.5px] font-semibold text-muted">Default</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.25em] text-subtle">
          {query.trim() ? "Places" : "Popular with sellers"}
        </p>

        {places && places.length > 0 ? (
          <ul className="max-h-[320px] space-y-0.5 overflow-y-auto">
            {places.map((place: PlaceSuggestion) => {
              const Icon = TYPE_ICON[place.type];
              return (
                <li key={`${place.type}-${place.label}`}>
                  <button
                    type="button"
                    onClick={() => onPick(place)}
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-surface-sunken"
                  >
                    <Icon size={16} className="shrink-0 text-violet-600 dark:text-violet-400" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-ink">{place.label}</span>
                      <span className="block text-[11.5px] text-subtle">{TYPE_LABEL[place.type]}</span>
                    </span>
                    <span
                      className={`shrink-0 text-[11.5px] font-medium ${
                        place.storeCount > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-subtle"
                      }`}
                    >
                      {sellers(place.storeCount)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-2.5 py-3 text-[13px] text-subtle">
            {query.trim()
              ? isFetching
                ? "Searching..."
                : "No matching place. Try your city or state."
              : "Search for your area to get started."}
          </p>
        )}
      </div>
    </div>
  );
}
