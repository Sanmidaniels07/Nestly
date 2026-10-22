"use client";

import Checkbox from "./checkbox";

interface Props {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

// A full-width option card with Nestly's checkbox on the right (settings
// toggles, shipping options). The whole card is the tap target.
export default function CheckboxRow({ label, description, checked, onChange, disabled }: Props) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`
        flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-colors
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${checked ? "border-violet-300 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-500/10" : "border-line hover:border-violet-200 dark:hover:border-violet-500/30"}
      `}
    >
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium text-ink">{label}</p>
        {description && <p className="mt-0.5 text-[12px] text-muted">{description}</p>}
      </div>

      {/* Stop the card's click from toggling twice. */}
      <span onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={checked} onChange={onChange} disabled={disabled} ariaLabel={label} />
      </span>
    </div>
  );
}
