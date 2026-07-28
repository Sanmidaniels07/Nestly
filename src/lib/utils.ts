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
};

export function formatConditionLabel(condition: string) {
  return conditionLabels[condition] ?? condition;
}