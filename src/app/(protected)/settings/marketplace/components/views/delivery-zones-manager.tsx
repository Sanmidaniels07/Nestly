"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Check,
  Loader2,
  LocateFixed,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { useMyStore } from "@/src/hooks/use-my-store";
import { useCreateShippingOption } from "@/src/hooks/use-create-shipping-option";
import { useBulkCreateShippingOptions } from "@/src/hooks/use-bulk-create-shipping-options";
import { useUpdateShippingOption } from "@/src/hooks/use-update-shipping-option";
import { useDeleteShippingOption } from "@/src/hooks/use-delete-shipping-option";
import { useDetectState, useNigerianStates, useStateLocations } from "@/src/hooks/use-locations";
import { NigerianState, SuggestedZone } from "@/src/types/location";
import { ShippingOption } from "@/src/types/store";

const money = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

const STATE_ALIASES: Record<string, string> = {
  abuja: "Federal Capital Territory",
  fct: "Federal Capital Territory",
  nassarawa: "Nasarawa",
};

// "Lagos", "lagos state", "Abuja" -> a state from the list, or null.
const matchState = (input: string | null | undefined, states: NigerianState[] = []) => {
  if (!input) return null;
  const cleaned = input.toLowerCase().replace(/,?\s*nigeria$/, "").replace(/\s+state$/, "").trim();
  const name = (STATE_ALIASES[cleaned] ?? cleaned).toLowerCase();
  return states.find((state) => state.name.toLowerCase() === name)?.name ?? null;
};

const areaKey = (areas: string[]) =>
  areas
    .map((area) => area.toLowerCase())
    .sort()
    .join("|");

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[13.5px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400";

export default function DeliveryZonesManager({ slug }: { slug: string }) {
  const { data: store } = useMyStore();
  const { data: states } = useNigerianStates();
  const zones = useMemo(() => store?.shippingOptions ?? [], [store?.shippingOptions]);

  const storeState = matchState(store?.state, states);
  const [chosenState, setChosenState] = useState<string | null>(null);
  const activeState = chosenState ?? storeState;
  const { data: locations, isLoading: isLoadingLocations } = useStateLocations(activeState);

  const { mutate: detectState, isPending: isDetecting } = useDetectState();
  const [mode, setMode] = useState<"suggested" | "custom" | null>(null);

  const active = zones.filter((zone) => !zone.isArchived);
  const archived = zones.filter((zone) => zone.isArchived);

  const handleDetect = () =>
    detectState(undefined, {
      onSuccess: (result) => {
        if (result.state) {
          setChosenState(result.state);
          toast.success(`Showing areas in ${result.state}`);
        } else {
          toast.error("Couldn't match your location to a state. Pick it from the list.");
        }
      },
      onError: (error) => toast.error(error.message),
    });

  const suggestions = locations?.suggestedZones ?? [];
  const existingKeys = new Set(zones.map((zone) => areaKey(zone.areas)));
  const unusedSuggestions = suggestions.filter((zone) => !existingKeys.has(areaKey(zone.areas)));
  const effectiveMode = mode ?? (unusedSuggestions.length > 0 ? "suggested" : "custom");

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">Delivery zones</h2>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        Set a price for each group of areas you deliver to. Buyers pick their zone at checkout.
      </p>

      {/* Where suggestions come from */}
      <div className="mt-5 flex flex-col gap-3 rounded-xl bg-surface-sunken p-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <MapPin size={16} className="shrink-0 text-violet-600 dark:text-violet-400" />
          <label htmlFor="zone-state" className="shrink-0 text-[13px] text-muted">
            Suggesting areas in
          </label>
          <select
            id="zone-state"
            value={activeState ?? ""}
            onChange={(e) => setChosenState(e.target.value || null)}
            className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-[13.5px] font-medium text-ink outline-none focus:border-violet-400 sm:max-w-[240px]"
          >
            <option value="">Pick a state</option>
            {states?.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleDetect}
          disabled={isDetecting}
          className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 text-[13px] font-medium text-ink-2 transition-colors hover:border-violet-300 disabled:opacity-60"
        >
          {isDetecting ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
          Detect my location
        </button>
      </div>
      {!chosenState && storeState && (
        <p className="mt-1.5 text-[11.5px] text-subtle">Based on your store address.</p>
      )}

      {/* Current zones */}
      <div className="mt-6 space-y-2.5">
        {active.length === 0 && (
          <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-[13px] text-subtle">
            No delivery zones yet. Add some below so buyers can check out.
          </p>
        )}
        {active.map((zone) => (
          <ZoneRow key={zone.id} slug={slug} zone={zone} areas={locations?.areas ?? []} state={activeState} />
        ))}
      </div>

      {archived.length > 0 && (
        <details className="mt-4 group">
          <summary className="cursor-pointer text-[12.5px] font-medium text-muted hover:text-ink">
            Archived zones ({archived.length}), hidden from buyers
          </summary>
          <div className="mt-2.5 space-y-2.5">
            {archived.map((zone) => (
              <ZoneRow key={zone.id} slug={slug} zone={zone} areas={locations?.areas ?? []} state={activeState} />
            ))}
          </div>
        </details>
      )}

      {/* Add zones */}
      <div className="mt-6 border-t border-line-soft pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto text-[14px] font-semibold text-ink">Add zones</p>
          <div className="inline-flex rounded-xl bg-surface-2 p-1">
            {[
              { id: "suggested" as const, label: "Suggested", icon: Sparkles, disabled: unusedSuggestions.length === 0 },
              { id: "custom" as const, label: "Build your own", icon: Plus, disabled: false },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                disabled={tab.disabled}
                onClick={() => setMode(tab.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                  effectiveMode === tab.id
                    ? "bg-surface text-violet-700 shadow-sm dark:bg-track dark:text-violet-300"
                    : "text-muted hover:text-ink"
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {!activeState && (
          <p className="mt-3 text-[12.5px] text-subtle">
            Pick your state above (or detect your location) to get area suggestions.
          </p>
        )}
        {activeState && isLoadingLocations && <div className="mt-4 h-24 animate-pulse rounded-xl bg-surface-2" />}

        {effectiveMode === "suggested" && unusedSuggestions.length > 0 && (
          <SuggestedZonesForm slug={slug} state={activeState} suggestions={unusedSuggestions} />
        )}
        {effectiveMode === "custom" && (
          <div className="mt-4">
            <ZoneForm slug={slug} state={activeState} areaOptions={locations?.areas ?? []} />
          </div>
        )}
        {activeState && !isLoadingLocations && suggestions.length === 0 && effectiveMode === "custom" && (
          <p className="mt-2 text-[11.5px] text-subtle">
            No ready-made zones for {activeState} yet. Pick its areas above to build your own.
          </p>
        )}
      </div>
    </section>
  );
}

// Price the state's ready-made zones in one go: typing a price ticks the zone.
function SuggestedZonesForm({
  slug,
  state,
  suggestions,
}: {
  slug: string;
  state: string | null;
  suggestions: SuggestedZone[];
}) {
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [eta, setEta] = useState("");
  const { mutate: bulkCreate, isPending } = useBulkCreateShippingOptions(slug);

  const priced = suggestions.filter((zone) => prices[zone.name]?.trim() && Number(prices[zone.name]) >= 0);

  const handleSave = () =>
    bulkCreate(
      priced.map((zone) => ({
        fee: Number(prices[zone.name]),
        areas: zone.areas,
        state: state ?? undefined,
        eta: eta.trim() || undefined,
      })),
      { onSuccess: () => setPrices({}) }
    );

  return (
    <div className="mt-4">
      <p className="text-[12.5px] text-muted">
        Enter a price for each zone you deliver to. Leave the rest empty.
      </p>
      <ul className="mt-3 divide-y divide-line-soft overflow-hidden rounded-xl border border-line">
        {suggestions.map((zone) => {
          const value = prices[zone.name] ?? "";
          return (
            <li key={zone.name} className="flex items-center gap-3 px-3.5 py-2.5 sm:px-4">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  value ? "border-violet-600 bg-violet-600 text-white" : "border-line-strong"
                }`}
                aria-hidden="true"
              >
                {value && <Check size={12} />}
              </span>
              <p className="min-w-0 flex-1 text-[13px] leading-snug text-ink">{zone.name}</p>
              <div className="relative w-28 shrink-0 sm:w-32">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-subtle">₦</span>
                <input
                  value={value}
                  onChange={(e) => setPrices((prev) => ({ ...prev, [zone.name]: e.target.value.replace(/[^0-9.]/g, "") }))}
                  inputMode="decimal"
                  placeholder="Price"
                  aria-label={`Price for ${zone.name}`}
                  className="h-10 w-full rounded-lg border border-line bg-surface pl-7 pr-2.5 text-right font-[family-name:var(--font-mono)] text-[13px] text-ink outline-none focus:border-violet-400"
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <input
          value={eta}
          onChange={(e) => setEta(e.target.value)}
          maxLength={50}
          placeholder="Delivery time for these zones (optional), e.g. Same day"
          className={`${inputClass} sm:flex-1`}
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={priced.length === 0 || isPending}
          className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[13px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          {priced.length > 0 ? `Add ${priced.length} zone${priced.length === 1 ? "" : "s"}` : "Add zones"}
        </button>
      </div>
    </div>
  );
}

// Create or edit one zone: pick areas from the state's list (or type your
// own), set the price and an optional delivery time.
function ZoneForm({
  slug,
  state,
  areaOptions,
  zone,
  onDone,
}: {
  slug: string;
  state: string | null;
  areaOptions: string[];
  zone?: ShippingOption;
  onDone?: () => void;
}) {
  const [areas, setAreas] = useState<string[]>(zone?.areas ?? []);
  const [query, setQuery] = useState("");
  const [name, setName] = useState(zone && zone.name !== zone.areas.join(" / ") ? zone.name : "");
  const [fee, setFee] = useState(zone ? String(zone.fee) : "");
  const [eta, setEta] = useState(zone?.eta ?? "");

  const { mutate: create, isPending: isCreating } = useCreateShippingOption(slug);
  const { mutate: update, isPending: isUpdating } = useUpdateShippingOption(slug);
  const isPending = isCreating || isUpdating;

  const lowerSelected = new Set(areas.map((area) => area.toLowerCase()));
  const trimmed = query.trim();
  const matches = trimmed
    ? areaOptions.filter((area) => area.toLowerCase().includes(trimmed.toLowerCase()) && !lowerSelected.has(area.toLowerCase())).slice(0, 12)
    : [];
  const canAddCustom =
    trimmed.length > 1 && !areaOptions.some((area) => area.toLowerCase() === trimmed.toLowerCase()) && !lowerSelected.has(trimmed.toLowerCase());

  const addArea = (area: string) => {
    setAreas((prev) => [...prev, area]);
    setQuery("");
  };

  const canSave = (areas.length > 0 || name.trim().length > 0) && fee.trim() !== "" && Number(fee) >= 0;

  const reset = () => {
    setAreas([]);
    setName("");
    setFee("");
    setEta("");
    setQuery("");
  };

  const handleSave = () => {
    if (!canSave) return;
    const payload = {
      name: name.trim() || undefined,
      fee: Number(fee),
      areas,
      state: state ?? undefined,
    };

    if (zone) {
      update(
        { optionId: zone.id, data: { ...payload, eta: eta.trim() || null } },
        { onSuccess: () => onDone?.() }
      );
    } else {
      create({ ...payload, eta: eta.trim() || undefined }, { onSuccess: reset });
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-line p-3.5 sm:p-4">
      <div>
        <label className="mb-1.5 block text-[12.5px] font-medium text-ink-2">Areas in this zone</label>
        {areas.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {areas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1 rounded-full bg-violet-50 py-1 pl-2.5 pr-1 text-[12px] font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
              >
                {area}
                <button
                  type="button"
                  onClick={() => setAreas((prev) => prev.filter((item) => item !== area))}
                  aria-label={`Remove ${area}`}
                  className="rounded-full p-0.5 hover:bg-violet-100 dark:hover:bg-violet-500/20"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (matches[0]) addArea(matches[0]);
                else if (canAddCustom) addArea(trimmed);
              }
            }}
            placeholder={areaOptions.length ? "Search areas, e.g. Festac" : "Type an area and press Enter"}
            className={`${inputClass} pl-9`}
          />
        </div>
        {(matches.length > 0 || canAddCustom) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {matches.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => addArea(area)}
                className="rounded-full border border-line px-2.5 py-1 text-[12px] text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
              >
                + {area}
              </button>
            ))}
            {canAddCustom && (
              <button
                type="button"
                onClick={() => addArea(trimmed)}
                className="rounded-full border border-dashed border-line-strong px-2.5 py-1 text-[12px] text-muted hover:border-violet-300"
              >
                + Add &quot;{trimmed}&quot;
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.4fr_0.8fr_1fr]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
          placeholder={areas.length ? "Zone name (optional)" : "Zone name, e.g. Pickup"}
          aria-label="Zone name"
          className={inputClass}
        />
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-subtle">₦</span>
          <input
            value={fee}
            onChange={(e) => setFee(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            placeholder="Price"
            aria-label="Delivery price"
            className={`${inputClass} pl-8 font-[family-name:var(--font-mono)]`}
          />
        </div>
        <input
          value={eta}
          onChange={(e) => setEta(e.target.value)}
          maxLength={50}
          placeholder="Delivery time (optional)"
          aria-label="Delivery time"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="h-10 rounded-xl px-4 text-[13px] font-medium text-muted hover:bg-surface-2"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || isPending}
          className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[13px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {zone ? "Save changes" : "Add zone"}
        </button>
      </div>
    </div>
  );
}

function ZoneRow({
  slug,
  zone,
  areas,
  state,
}: {
  slug: string;
  zone: ShippingOption;
  areas: string[];
  state: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { mutate: update, isPending: isUpdating } = useUpdateShippingOption(slug);
  const { mutate: remove, isPending: isDeleting } = useDeleteShippingOption(slug);

  if (editing) {
    return <ZoneForm slug={slug} state={zone.state ?? state} areaOptions={areas} zone={zone} onDone={() => setEditing(false)} />;
  }

  const toggleArchive = () =>
    update({
      optionId: zone.id,
      data: { isArchived: !zone.isArchived },
      successMessage: zone.isArchived ? "Zone restored" : "Zone archived",
    });

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-line-soft px-4 py-3 sm:flex-row sm:items-center ${
        zone.isArchived ? "opacity-70" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium leading-snug text-ink">{zone.name}</p>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[12.5px] text-violet-700 dark:text-violet-300">
          {money(zone.fee)}
          {zone.eta && <span className="font-sans text-subtle"> · {zone.eta}</span>}
          {zone.areas.length === 0 && <span className="font-sans text-subtle"> · any location</span>}
        </p>
      </div>

      {confirmingDelete ? (
        <div className="flex items-center gap-2 text-[12.5px]">
          <span className="text-muted">Delete this zone?</span>
          <button
            type="button"
            onClick={() => remove(zone.id)}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            Delete
          </button>
          <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-lg px-2.5 py-1.5 text-muted hover:bg-surface-2">
            Keep
          </button>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium text-ink-2 hover:bg-surface-2"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={toggleArchive}
            disabled={isUpdating}
            className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium text-ink-2 hover:bg-surface-2 disabled:opacity-60"
          >
            {zone.isArchived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
            {zone.isArchived ? "Restore" : "Archive"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            aria-label={`Delete ${zone.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-subtle hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
