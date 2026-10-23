import { OptionInput, Product, VariationInput } from "@/src/types/product";

// Seller-side form state for product options (e.g. Size, Colour) and the
// combinations they produce. Shared by the add and edit product forms.

export const MAX_OPTIONS = 2;
export const MAX_VALUES = 30;
export const OPTION_SUGGESTIONS = ["Size", "Colour", "Flavour", "Length", "Material", "Weight"];

export interface DraftOption {
  id: string;
  name: string;
  values: string[];
}

export interface DraftVariation {
  option1: string;
  option2: string;
  price: string;
  stock: string;
  isActive: boolean;
}

export interface OptionsDraft {
  enabled: boolean;
  options: DraftOption[];
  variations: DraftVariation[];
}

export const EMPTY_OPTIONS: OptionsDraft = { enabled: false, options: [], variations: [] };

export const newOption = (name = ""): DraftOption => ({ id: crypto.randomUUID(), name, values: [] });

const keyOf = (option1: string, option2: string) => `${option1}\u0000${option2}`;

// Rebuilds the combination list after the options change, keeping what the
// seller already typed for combinations that still exist.
export const syncVariations = (options: DraftOption[], previous: DraftVariation[]): DraftVariation[] => {
  const [first, second] = options;
  if (!first || first.values.length === 0) return [];

  const kept = new Map(previous.map((variation) => [keyOf(variation.option1, variation.option2), variation]));
  const seconds = second && second.values.length > 0 ? second.values : [""];

  return first.values.flatMap((option1) =>
    seconds.map(
      (option2) => kept.get(keyOf(option1, option2)) ?? { option1, option2, price: "", stock: "", isActive: true }
    )
  );
};

export const variationName = (variation: Pick<DraftVariation, "option1" | "option2">) =>
  [variation.option1, variation.option2].filter(Boolean).join(" / ");

export const totalStock = (draft: OptionsDraft) =>
  draft.variations.filter((v) => v.isActive).reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

// First problem with the options, or null when they're ready to save.
export const optionsError = (draft: OptionsDraft): string | null => {
  if (!draft.enabled) return null;

  const named = draft.options.filter((option) => option.name.trim() || option.values.length > 0);
  if (named.length === 0) return "Add an option, like Size, or turn options off.";

  for (const option of named) {
    if (!option.name.trim()) return "Give each option a name, like Size or Colour.";
    if (option.values.length === 0) return `Add at least one choice under ${option.name.trim()}.`;
  }

  if (named.length === 2 && named[0].name.trim().toLowerCase() === named[1].name.trim().toLowerCase()) {
    return "The two options need different names.";
  }

  const active = draft.variations.filter((variation) => variation.isActive);
  if (active.length === 0) return "Switch on at least one combination buyers can choose.";

  for (const variation of active) {
    const stock = Number(variation.stock);
    if (variation.stock === "" || !Number.isInteger(stock) || stock < 0) {
      return `Enter the stock for ${variationName(variation)} (0 or more).`;
    }
    if (variation.price !== "" && !(Number(variation.price) > 0)) {
      return `Enter a valid price for ${variationName(variation)}, or leave it blank to use the main price.`;
    }
  }

  return null;
};

// Request body fields. Turning options off sends empty lists, which
// removes them from the product.
export const optionsPayload = (draft: OptionsDraft): { options: OptionInput[]; variations: VariationInput[] } => {
  if (!draft.enabled) return { options: [], variations: [] };

  const options = draft.options
    .filter((option) => option.name.trim() && option.values.length > 0)
    .map((option) => ({ name: option.name.trim(), values: option.values }));

  return {
    options,
    variations: draft.variations.map((variation) => ({
      option1: variation.option1,
      ...(options.length > 1 ? { option2: variation.option2 } : {}),
      price: variation.price === "" ? null : Number(variation.price),
      stock: Number(variation.stock) || 0,
      isActive: variation.isActive,
    })),
  };
};

export const optionsDraftFrom = (product: Pick<Product, "options" | "variations">): OptionsDraft => {
  const options = (product.options ?? []).map((option) => ({
    id: option.id ?? crypto.randomUUID(),
    name: option.name,
    values: option.values,
  }));
  if (options.length === 0) return EMPTY_OPTIONS;

  const saved = (product.variations ?? []).map((variation) => ({
    option1: variation.option1,
    option2: variation.option2,
    price: variation.price != null ? String(variation.price) : "",
    stock: String(variation.stock),
    isActive: variation.isActive,
  }));

  return { enabled: true, options, variations: syncVariations(options, saved) };
};
