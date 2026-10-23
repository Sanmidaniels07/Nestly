"use client";

import { ProductOption, ProductVariation } from "@/src/types/product";

interface Props {
  options: ProductOption[];
  variations: ProductVariation[];
  picked: string[];
  onPick: (position: number, value: string) => void;
}

const sellable = (variation: ProductVariation) => variation.isActive && variation.stock > 0;

// Buttons for each option (e.g. Size, Colour). Choices with nothing left to
// sell - given what's already picked for the other option - are crossed out.
export default function OptionPicker({ options, variations, picked, onPick }: Props) {
  const available = (position: number, value: string) =>
    variations.some((variation) => {
      if (!sellable(variation)) return false;
      const values = [variation.option1, variation.option2];
      if (values[position] !== value) return false;
      const other = position === 0 ? 1 : 0;
      return !options[other] || !picked[other] || values[other] === picked[other];
    });

  return (
    <div className="space-y-4">
      {options.map((option, position) => (
        <fieldset key={option.name}>
          <legend className="text-[13px] font-medium text-ink-2">
            {option.name}
            {picked[position] && <span className="font-semibold text-ink">: {picked[position]}</span>}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {option.values.map((value) => {
              const selected = picked[position] === value;
              const open = available(position, value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onPick(position, value)}
                  aria-pressed={selected}
                  aria-label={open ? value : `${value} (sold out)`}
                  className={`min-h-10 rounded-xl border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    selected
                      ? "border-violet-600 bg-violet-50 text-violet-800 ring-2 ring-violet-500/20 dark:bg-violet-500/15 dark:text-violet-200"
                      : open
                        ? "border-line text-ink-2 hover:border-violet-300 dark:hover:border-violet-500/40"
                        : "border-dashed border-line text-subtle line-through"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
