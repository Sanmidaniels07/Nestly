"use client";

import { KeyboardEvent, useState } from "react";
import { Info, Layers, Plus, Trash2, X } from "lucide-react";

import { LegacyProductVariant } from "@/src/types/product";
import {
  DraftOption,
  DraftVariation,
  MAX_OPTIONS,
  MAX_VALUES,
  OPTION_SUGGESTIONS,
  OptionsDraft,
  newOption,
  syncVariations,
  totalStock,
  variationName,
} from "@/src/lib/product-options";

interface Props {
  value: OptionsDraft;
  onChange: (next: OptionsDraft) => void;
  basePrice: string;
  error?: string | null;
  // Old free-form variant rows (edit form only) - shown so the seller can re-add them as options.
  legacy?: LegacyProductVariant[];
}

const fieldClass =
  "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[14px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10";

const money = (value: string) =>
  value && Number(value) > 0
    ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Number(value))
    : "main price";

// Options such as Size or Colour, and the price/stock of every combination.
export default function OptionsEditor({ value, onChange, basePrice, error, legacy }: Props) {
  const setOptions = (options: DraftOption[]) =>
    onChange({ ...value, options, variations: syncVariations(options, value.variations) });

  const updateOption = (id: string, patch: Partial<DraftOption>) =>
    setOptions(value.options.map((option) => (option.id === id ? { ...option, ...patch } : option)));

  const toggle = () => {
    if (value.enabled) {
      onChange({ ...value, enabled: false });
    } else {
      const options = value.options.length > 0 ? value.options : [newOption()];
      onChange({ enabled: true, options, variations: syncVariations(options, value.variations) });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-[family-name:var(--font-fraunces)] text-[19px] italic text-ink">
            <Layers size={17} className="shrink-0 not-italic text-violet-600 dark:text-violet-400" />
            Options
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            {`Does it come in different sizes, colours or flavours? Add up to ${MAX_OPTIONS} options and buyers choose one. Leave this off if it doesn't.`}
          </p>
        </div>
        <Switch checked={value.enabled} onChange={toggle} label="This product has options" />
      </div>

      {legacy && legacy.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          <Info size={15} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">You added these variant details before options existed. Buyers don&apos;t see them:</p>
            <ul className="mt-1 list-disc pl-4">
              {legacy.map((row, index) => (
                <li key={row.id ?? index}>
                  {row.name}
                  {row.value ? ` - ${row.value}` : ""}
                </li>
              ))}
            </ul>
            <p className="mt-1">Turn on options and add them here so buyers can choose.</p>
          </div>
        </div>
      )}

      {value.enabled && (
        <>
          <div className="space-y-3">
            {value.options.map((option, index) => (
              <OptionCard
                key={option.id}
                index={index}
                option={option}
                otherNames={value.options.filter((o) => o.id !== option.id).map((o) => o.name.trim().toLowerCase())}
                onChange={(patch) => updateOption(option.id, patch)}
                onRemove={
                  value.options.length > 1 ? () => setOptions(value.options.filter((o) => o.id !== option.id)) : undefined
                }
              />
            ))}

            {value.options.length < MAX_OPTIONS && (
              <button
                type="button"
                onClick={() => setOptions([...value.options, newOption()])}
                className="flex items-center gap-2 rounded-xl border border-dashed border-violet-300 px-4 py-2.5 text-[13.5px] font-medium text-violet-700 transition-colors hover:bg-violet-50 dark:border-violet-500/40 dark:text-violet-300 dark:hover:bg-violet-500/10"
              >
                <Plus size={15} />
                Add another option
              </button>
            )}
          </div>

          {value.variations.length > 0 && (
            <Combinations
              variations={value.variations}
              basePrice={basePrice}
              onChange={(variations) => onChange({ ...value, variations })}
              total={totalStock(value)}
            />
          )}
        </>
      )}

      {error && <p className="text-[12.5px] font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

function OptionCard({
  index,
  option,
  otherNames,
  onChange,
  onRemove,
}: {
  index: number;
  option: DraftOption;
  otherNames: string[];
  onChange: (patch: Partial<DraftOption>) => void;
  onRemove?: () => void;
}) {
  const [draft, setDraft] = useState("");
  const suggestions = OPTION_SUGGESTIONS.filter((name) => !otherNames.includes(name.toLowerCase()));
  const full = option.values.length >= MAX_VALUES;

  const addValues = (raw: string) => {
    const next = [...option.values];
    raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => {
        if (next.length < MAX_VALUES && !next.some((v) => v.toLowerCase() === part.toLowerCase())) next.push(part);
      });
    if (next.length !== option.values.length) onChange({ values: next });
    setDraft("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addValues(draft);
    }
    if (e.key === "Backspace" && draft === "" && option.values.length > 0) {
      onChange({ values: option.values.slice(0, -1) });
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface-sunken p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-subtle">Option {index + 1}</p>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove option ${index + 1}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-subtle transition-colors hover:bg-surface-2 hover:text-red-600"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <label className="mt-2 block text-[13px] font-medium text-ink-2" htmlFor={`option-name-${option.id}`}>
        Name
      </label>
      <input
        id={`option-name-${option.id}`}
        value={option.name}
        onChange={(e) => onChange({ name: e.target.value.slice(0, 30) })}
        placeholder="e.g. Size"
        className={`${fieldClass} mt-1.5`}
      />
      {!option.name.trim() && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onChange({ name })}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:border-violet-500/40 dark:hover:text-violet-300"
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <label className="mt-4 block text-[13px] font-medium text-ink-2" htmlFor={`option-values-${option.id}`}>
        Choices
      </label>
      <div className="mt-1.5 rounded-xl border border-line bg-surface p-2.5 transition-colors focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10">
        {option.values.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {option.values.map((choice) => (
              <span
                key={choice}
                className="flex items-center gap-1 rounded-full bg-violet-50 py-1 pl-3 pr-1.5 text-[13px] font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
              >
                {choice}
                <button
                  type="button"
                  onClick={() => onChange({ values: option.values.filter((v) => v !== choice) })}
                  aria-label={`Remove ${choice}`}
                  className="rounded-full p-0.5 text-violet-400 transition-colors hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-500/20"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          id={`option-values-${option.id}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addValues(draft)}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (text.includes(",")) {
              e.preventDefault();
              addValues(text);
            }
          }}
          disabled={full}
          enterKeyHint="done"
          placeholder={full ? "Limit reached" : "Type a choice, then press Enter (e.g. Small)"}
          className="w-full bg-transparent px-1 py-1 text-[14px] text-ink outline-none placeholder:text-subtle disabled:cursor-not-allowed"
        />
      </div>
      {draft.trim() && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => addValues(draft)}
          className="mt-2 rounded-full bg-violet-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white"
        >
          Add &ldquo;{draft.trim()}&rdquo;
        </button>
      )}
    </div>
  );
}

function Combinations({
  variations,
  basePrice,
  onChange,
  total,
}: {
  variations: DraftVariation[];
  basePrice: string;
  onChange: (next: DraftVariation[]) => void;
  total: number;
}) {
  const [fillPrice, setFillPrice] = useState("");
  const [fillStock, setFillStock] = useState("");

  const update = (index: number, patch: Partial<DraftVariation>) =>
    onChange(variations.map((variation, i) => (i === index ? { ...variation, ...patch } : variation)));

  const applyAll = () => {
    onChange(
      variations.map((variation) => ({
        ...variation,
        ...(fillPrice !== "" ? { price: fillPrice } : {}),
        ...(fillStock !== "" ? { stock: fillStock } : {}),
      }))
    );
    setFillPrice("");
    setFillStock("");
  };

  const digits = (raw: string) => raw.replace(/[^\d]/g, "");

  return (
    <div className="rounded-2xl border border-line">
      <div className="border-b border-line px-4 py-3.5">
        <p className="text-[14px] font-semibold text-ink">Price &amp; stock for each choice</p>
        <p className="mt-0.5 text-[12.5px] text-muted">
          Leave price blank to use the {money(basePrice)}. Switch off any combination you don&apos;t sell.
        </p>
      </div>

      {variations.length > 1 && (
        <div className="flex flex-wrap items-end gap-2 border-b border-line bg-surface-sunken px-4 py-3">
          <p className="w-full text-[12px] font-medium text-subtle">Fill every row at once</p>
          <input
            value={fillPrice}
            onChange={(e) => setFillPrice(digits(e.target.value))}
            inputMode="numeric"
            placeholder="Price (₦)"
            aria-label="Price for every combination"
            className={`${fieldClass} min-w-0 flex-1 basis-28`}
          />
          <input
            value={fillStock}
            onChange={(e) => setFillStock(digits(e.target.value))}
            inputMode="numeric"
            placeholder="Stock"
            aria-label="Stock for every combination"
            className={`${fieldClass} min-w-0 flex-1 basis-24`}
          />
          <button
            type="button"
            onClick={applyAll}
            disabled={fillPrice === "" && fillStock === ""}
            className="h-11 shrink-0 rounded-xl bg-violet-600 px-4 text-[13px] font-semibold text-white transition-opacity disabled:opacity-40"
          >
            Apply
          </button>
        </div>
      )}

      <ul className="divide-y divide-line">
        {variations.map((variation, index) => (
          <li
            key={`${variation.option1}-${variation.option2}`}
            className={`grid grid-cols-2 items-center gap-x-3 gap-y-2.5 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_8.5rem_6.5rem_auto] ${
              variation.isActive ? "" : "opacity-60"
            }`}
          >
            <p className="col-span-1 min-w-0 text-[13.5px] font-medium text-ink [overflow-wrap:anywhere] sm:col-span-1">
              {variationName(variation)}
            </p>
            <div className="flex justify-end sm:order-last">
              <Switch
                checked={variation.isActive}
                onChange={() => update(index, { isActive: !variation.isActive })}
                label={`Sell ${variationName(variation)}`}
                small
              />
            </div>
            <input
              value={variation.price}
              onChange={(e) => update(index, { price: digits(e.target.value) })}
              inputMode="numeric"
              placeholder={basePrice ? `₦${Number(basePrice).toLocaleString("en-NG")}` : "Price (₦)"}
              aria-label={`Price for ${variationName(variation)}`}
              disabled={!variation.isActive}
              className={fieldClass}
            />
            <input
              value={variation.stock}
              onChange={(e) => update(index, { stock: digits(e.target.value) })}
              inputMode="numeric"
              placeholder="Stock"
              aria-label={`Stock for ${variationName(variation)}`}
              disabled={!variation.isActive}
              className={fieldClass}
            />
          </li>
        ))}
      </ul>

      <p className="border-t border-line px-4 py-3 text-[12.5px] text-muted">
        Total stock: <span className="font-[family-name:var(--font-mono)] font-semibold text-ink">{total}</span>
      </p>
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label,
  small,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20 ${
        small ? "h-6 w-10" : "h-7 w-12"
      } ${checked ? "bg-gradient-to-r from-violet-600 to-indigo-600" : "bg-line-strong"}`}
    >
      <span
        className={`absolute left-0 top-0.5 rounded-full bg-white shadow transition-transform ${small ? "h-5 w-5" : "h-6 w-6"} ${
          checked ? (small ? "translate-x-[18px]" : "translate-x-[22px]") : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
