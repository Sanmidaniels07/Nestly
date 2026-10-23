import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(
  ...inputs: any[]
) {
  return twMerge(
    clsx(inputs)
  );
}

const conditionLabels: Record<string, string> = {
  NEW: "New",
  USED: "Used",
  REFURBISHED: "Refurbished",
  FRESHLY_MADE: "Freshly made",
  MADE_TO_ORDER: "Made to order",
  PRE_ORDER: "Pre-order",
};

export function formatConditionLabel(condition: string) {
  return conditionLabels[condition] ?? condition;
}