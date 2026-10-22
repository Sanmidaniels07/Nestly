"use client";

import { cn } from "@/src/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Some (not all) rows selected - shows a dash. */
  indeterminate?: boolean;
  disabled?: boolean;
  /** Visible text. Omit for a box on its own (then pass ariaLabel). */
  label?: React.ReactNode;
  description?: React.ReactNode;
  ariaLabel?: string;
  size?: "sm" | "md";
  className?: string;
}

// Nestly's checkbox: rounded square that fills with the brand gradient and
// draws its tick. A real <button role="checkbox"> so it works with keyboard
// (Space/Enter) and screen readers; the tap area includes the label.
export default function Checkbox({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  label,
  description,
  ariaLabel,
  size = "md",
  className,
}: CheckboxProps) {
  const on = checked || indeterminate;
  const box = size === "sm" ? "h-[18px] w-[18px] rounded-[6px]" : "h-[22px] w-[22px] rounded-[7px]";

  const control = (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center border-2 transition-all duration-200",
        box,
        on
          ? "border-transparent bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_4px_12px_-4px_rgba(124,58,237,0.7)]"
          : "border-line-strong bg-surface group-hover:border-violet-400",
        disabled && "opacity-50"
      )}
    >
      {indeterminate && !checked ? (
        <span className="h-[2.5px] w-2.5 rounded-full bg-white" />
      ) : (
        <svg viewBox="0 0 16 16" className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} fill="none">
          <path
            d="M3.5 8.5l3 3 6-7"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="16"
            strokeDashoffset={checked ? 0 : 16}
            style={{ transition: "stroke-dashoffset 220ms ease-out" }}
          />
        </svg>
      )}
    </span>
  );

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate && !checked ? "mixed" : checked}
      aria-label={label ? undefined : ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "group inline-flex text-left focus:outline-none focus-visible:[&>span:first-child]:ring-2 focus-visible:[&>span:first-child]:ring-violet-400 focus-visible:[&>span:first-child]:ring-offset-2",
        label ? "items-start gap-3" : "items-center",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      {control}
      {label && (
        <span className="min-w-0 pt-px">
          <span className="block text-[13.5px] leading-snug text-ink-2">{label}</span>
          {description && <span className="mt-0.5 block text-[12px] text-muted">{description}</span>}
        </span>
      )}
    </button>
  );
}
