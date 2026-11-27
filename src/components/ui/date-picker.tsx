"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { MONTHS, toYMD } from "./calendar-picker";
import { cn } from "@/src/lib/utils";

interface DateOfBirthPickerProps {
  name?: string;
  label?: string;
  // Kept so existing callers still type-check; the day / month / year
  // dropdowns label themselves.
  placeholder?: string;
  minAge?: number;
  maxAge?: number;
}

// Date of birth inside a react-hook-form form (signup, welcome, Edit
// profile): three plain dropdowns - Day, Month, Year. Phones open their own
// scroll wheels for these, which is much quicker for a birthday than paging a
// calendar back 25 years. The value stays a "YYYY-MM-DD" string ("" until all
// three are picked).
export default function DateOfBirthPicker({ name = "dateOfBirth", label = "Date of birth", minAge = 13, maxAge = 100 }: DateOfBirthPickerProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = (errors[name]?.message as string) || undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <BirthdayFields label={label} value={field.value ?? ""} onChange={field.onChange} error={error} minAge={minAge} maxAge={maxAge} />
      )}
    />
  );
}

interface FieldsProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  minAge: number;
  maxAge: number;
}

type Parts = { d: string; m: string; y: string };

const EMPTY: Parts = { d: "", m: "", y: "" };

const partsOf = (value: string): Parts => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? { y: match[1], m: String(Number(match[2]) - 1), d: String(Number(match[3])) } : EMPTY;
};

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

function BirthdayFields({ label, value, onChange, error, minAge, maxAge }: FieldsProps) {
  const [parts, setParts] = useState<Parts>(() => partsOf(value));
  const labelId = useId();

  const today = new Date();
  const newestYear = today.getFullYear() - minAge;
  const oldestYear = today.getFullYear() - maxAge;
  const latest = toYMD(newestYear, today.getMonth(), today.getDate());
  const earliest = toYMD(oldestYear, today.getMonth(), today.getDate());

  const composed = parts.d && parts.m && parts.y ? toYMD(Number(parts.y), Number(parts.m), Number(parts.d)) : "";
  const tooYoung = !!composed && composed > latest;
  const tooOld = !!composed && composed < earliest;

  // The form loaded or reset its value (e.g. Edit profile fetching your
  // details): show it. A half-picked date ("" in the form) is left alone.
  // Done while rendering, React's pattern for reacting to a changed prop.
  const [seenValue, setSeenValue] = useState(value);
  if (value !== seenValue) {
    setSeenValue(value);
    if (value && value.slice(0, 10) !== composed) setParts(partsOf(value));
    else if (!value && composed && !tooYoung && !tooOld) setParts(EMPTY);
  }

  const update = (next: Parts) => {
    // Keep the day valid when the month or year changes (31 -> 30, 29 Feb).
    if (next.d && next.m) {
      const max = daysInMonth(next.y ? Number(next.y) : 2000, Number(next.m));
      if (Number(next.d) > max) next = { ...next, d: String(max) };
    }
    setParts(next);
    const full = next.d && next.m && next.y ? toYMD(Number(next.y), Number(next.m), Number(next.d)) : "";
    // Only a complete date within the allowed ages goes to the form.
    onChange(full && full <= latest && full >= earliest ? full : "");
  };

  const dayCount = parts.m ? daysInMonth(parts.y ? Number(parts.y) : 2000, Number(parts.m)) : 31;
  const days = Array.from({ length: dayCount }, (_, i) => String(i + 1));
  const years = Array.from({ length: newestYear - oldestYear + 1 }, (_, i) => String(newestYear - i));

  const started = !!(parts.d || parts.m || parts.y);
  const message = error
    ? error
    : tooYoung
      ? `You need to be at least ${minAge} to add a birthday.`
      : tooOld
        ? "Please check the year."
        : started && !composed
          ? "Pick the day, month and year."
          : undefined;
  const isError = !!error || tooYoung || tooOld;

  const select = cn(
    "h-12 w-full cursor-pointer appearance-none rounded-2xl border bg-surface-sunken pl-3.5 pr-8 text-[16px] text-ink transition-colors focus:border-violet-400 focus:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40 sm:text-[14.5px]",
    isError ? "border-red-400" : "border-line-strong hover:border-violet-300 dark:hover:border-violet-500/40"
  );

  return (
    <div role="group" aria-labelledby={labelId}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span id={labelId} className="text-[13.5px] font-medium text-ink-2">
          {label}
        </span>
        {started && (
          <button type="button" onClick={() => update(EMPTY)} className="text-[12.5px] font-semibold text-muted hover:text-ink">
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-[1fr_1.15fr_1.25fr] gap-2">
        <Dropdown label="Day" value={parts.d} onChange={(d) => update({ ...parts, d })} className={select} options={days.map((d) => ({ value: d, label: d }))} />
        <Dropdown
          label="Month"
          value={parts.m}
          onChange={(m) => update({ ...parts, m })}
          className={select}
          // Short names (Jan, Feb...) so the box fits a phone: "22 Oct 1995".
          options={MONTHS.map((month, i) => ({ value: String(i), label: month.slice(0, 3) }))}
        />
        <Dropdown label="Year" value={parts.y} onChange={(y) => update({ ...parts, y })} className={select} options={years.map((y) => ({ value: y, label: y }))} />
      </div>

      {message && (
        <p role={isError ? "alert" : undefined} className={cn("mt-1.5 text-[12.5px]", isError ? "text-red-500" : "text-muted")}>
          {message}
        </p>
      )}
    </div>
  );
}

function Dropdown({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className: string;
}) {
  return (
    <div className="relative">
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={cn(className, !value && "text-subtle")}>
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-ink">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-subtle" />
    </div>
  );
}
