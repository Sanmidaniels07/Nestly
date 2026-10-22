"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Clock } from "lucide-react";

import { cn } from "@/src/lib/utils";

// Nestly's date (and date + time) picker. One calendar used everywhere:
// Mon-first grid with month arrows; tap the "April 1991 >" title to flip to
// scrolling month/year wheels (like iOS). Opens as a popover on desktop and
// a bottom sheet on phones. Values are plain strings so they drop into
// forms: "YYYY-MM-DD" for dates, "YYYY-MM-DDTHH:mm" (local) for date-times.

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT_MONTHS = MONTHS.map((m) => m.slice(0, 3));
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const pad = (n: number) => String(n).padStart(2, "0");
export const toYMD = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parseYMD = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? { y: +match[1], m: +match[2] - 1, d: +match[3] } : null;
};
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

export const formatDateLabel = (value: string) => {
  const p = parseYMD(value);
  return p ? `${p.d} ${SHORT_MONTHS[p.m]} ${p.y}` : "";
};

function useIsPhone() {
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isPhone;
}

/* ------------------------------------------------------------------ wheel */

const ITEM_H = 40;

/** A scroll-snapping column (month, year, hour...). Calls onChange with the centred item's index. */
function Wheel({ items, index, onChange, label }: { items: string[]; index: number; onChange: (i: number) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmatic = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = index * ITEM_H;
    if (Math.abs(el.scrollTop - target) > 2) {
      programmatic.current = true;
      el.scrollTo({ top: target });
      setTimeout(() => (programmatic.current = false), 60);
    }
  }, [index]);

  const onScroll = () => {
    if (programmatic.current) return;
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM_H)));
      if (i !== index) onChange(i);
    }, 90);
  };

  return (
    <div className="relative h-[200px] flex-1">
      <div className="pointer-events-none absolute inset-x-1 top-[80px] h-10 rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-surface to-transparent" />
      <div
        ref={ref}
        onScroll={onScroll}
        role="listbox"
        aria-label={label}
        className="scrollbar-hide h-full snap-y snap-mandatory overflow-y-auto overscroll-contain py-[80px]"
      >
        {items.map((item, i) => (
          <button
            key={item}
            type="button"
            role="option"
            aria-selected={i === index}
            onClick={() => onChange(i)}
            className={cn(
              "flex h-10 w-full snap-center items-center justify-center text-[16px] transition-colors",
              i === index ? "font-semibold text-ink" : "text-subtle"
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- calendar */

interface CalendarProps {
  value: string; // YYYY-MM-DD or ""
  onSelect: (ymd: string) => void;
  minYear: number;
  maxYear: number;
  /** YYYY-MM-DD bounds (inclusive). */
  min?: string;
  max?: string;
  /** Month to show when there's no value, e.g. 18 years ago for birthdays. */
  defaultView?: { y: number; m: number };
}

function CalendarBody({ value, onSelect, minYear, maxYear, min, max, defaultView }: CalendarProps) {
  const selected = parseYMD(value);
  const today = new Date();
  const start = selected ?? defaultView ?? { y: today.getFullYear(), m: today.getMonth() };
  const [view, setView] = useState({ y: start.y, m: start.m });
  const [mode, setMode] = useState<"days" | "wheels">("days");

  const years = useMemo(() => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i), [minYear, maxYear]);

  const step = (delta: number) =>
    setView(({ y, m }) => {
      const next = new Date(y, m + delta, 1);
      const ny = Math.min(maxYear, Math.max(minYear, next.getFullYear()));
      return { y: ny, m: ny === next.getFullYear() ? next.getMonth() : m };
    });

  const total = daysInMonth(view.y, view.m);
  const lead = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // Monday-first
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const isToday = (d: number) => view.y === today.getFullYear() && view.m === today.getMonth() && d === today.getDate();
  const disabled = (d: number) => {
    const ymd = toYMD(view.y, view.m, d);
    return (!!min && ymd < min) || (!!max && ymd > max);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setMode((v) => (v === "days" ? "wheels" : "days"))}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[16px] font-semibold text-ink hover:bg-surface-2"
          aria-label="Choose month and year"
        >
          {MONTHS[view.m]} {view.y}
          {mode === "days" ? <ChevronRight size={17} className="text-violet-600 dark:text-violet-400" /> : <ChevronDown size={17} className="text-violet-600 dark:text-violet-400" />}
        </button>
        {mode === "days" && (
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => step(-1)} aria-label="Previous month" className="flex h-9 w-9 items-center justify-center rounded-full text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10">
              <ChevronLeft size={19} />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next month" className="flex h-9 w-9 items-center justify-center rounded-full text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10">
              <ChevronRight size={19} />
            </button>
          </div>
        )}
      </div>

      {mode === "wheels" ? (
        <div className="mt-2 flex gap-2">
          <Wheel label="Month" items={MONTHS} index={view.m} onChange={(m) => setView((v) => ({ ...v, m }))} />
          <Wheel label="Year" items={years.map(String)} index={Math.max(0, years.indexOf(view.y))} onChange={(i) => setView((v) => ({ ...v, y: years[i] }))} />
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAYS.map((wd) => (
            <span key={wd} className="pb-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">{wd}</span>
          ))}
          {cells.map((day, i) =>
            day === null ? (
              <span key={`e${i}`} />
            ) : (
              <button
                key={day}
                type="button"
                disabled={disabled(day)}
                onClick={() => onSelect(toYMD(view.y, view.m, day))}
                className={cn(
                  "mx-auto flex h-10 w-10 items-center justify-center rounded-full text-[15px] transition-colors disabled:cursor-not-allowed disabled:opacity-30",
                  selected && selected.y === view.y && selected.m === view.m && selected.d === day
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 font-semibold text-white shadow-[0_6px_16px_-6px_rgba(124,58,237,0.7)]"
                    : isToday(day)
                      ? "font-semibold text-violet-700 ring-1 ring-violet-400 dark:text-violet-300"
                      : "text-ink-2 hover:bg-violet-50 dark:hover:bg-violet-500/10"
                )}
              >
                {day}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- time */

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 12 }, (_, i) => pad(i * 5));
const PERIODS = ["AM", "PM"];

function TimeWheels({ time, onChange }: { time: { h: number; m: number }; onChange: (t: { h: number; m: number }) => void }) {
  const h12 = time.h % 12 === 0 ? 12 : time.h % 12;
  const pm = time.h >= 12;
  const minuteIndex = Math.min(11, Math.round(time.m / 5));
  const set = (hour12: number, minuteIdx: number, isPm: boolean) =>
    onChange({ h: (hour12 % 12) + (isPm ? 12 : 0), m: minuteIdx * 5 });

  return (
    <div className="mt-3 border-t border-line-soft pt-3">
      <p className="flex items-center gap-1.5 px-1 text-[12px] font-semibold uppercase tracking-wide text-subtle">
        <Clock size={13} /> Time
      </p>
      <div className="mt-1 flex gap-1">
        <Wheel label="Hour" items={HOURS} index={h12 - 1} onChange={(i) => set(i + 1, minuteIndex, pm)} />
        <Wheel label="Minute" items={MINUTES} index={minuteIndex} onChange={(i) => set(h12, i, pm)} />
        <Wheel label="AM or PM" items={PERIODS} index={pm ? 1 : 0} onChange={(i) => set(h12, minuteIndex, i === 1)} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ shell */

interface ShellProps {
  label?: string;
  display: string;
  placeholder: string;
  error?: string;
  icon: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  onReset: () => void;
  onDone: () => void;
  children: React.ReactNode;
}

// The field + its popover (desktop) or bottom sheet (phones).
// The panel is portalled to <body> (popover and sheet alike) so it's never
// clipped by a scrolling modal or hidden under one - e.g. "Create event".
const PANEL_W = 340;
const PANEL_H_GUESS = 470;

function PickerShell({ label, display, placeholder, error, icon, open, setOpen, onReset, onDone, children }: ShellProps) {
  const isPhone = useIsPhone();
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Desktop: place the popover under the field (or above if there's no room).
  useEffect(() => {
    if (!open || isPhone) return;
    const place = () => {
      const r = triggerRef.current?.getBoundingClientRect();
      if (!r) return;
      const left = Math.max(12, Math.min(r.left, window.innerWidth - PANEL_W - 12));
      const below = r.bottom + 8;
      const top = below + PANEL_H_GUESS > window.innerHeight && r.top - PANEL_H_GUESS - 8 > 12 ? r.top - PANEL_H_GUESS - 8 : below;
      setPos({ top, left });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, isPhone]);

  useEffect(() => {
    if (!open || isPhone) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, isPhone, setOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    let previous = "";
    if (isPhone) {
      previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      if (isPhone) document.body.style.overflow = previous;
    };
  }, [open, isPhone, setOpen]);

  const footer = (
    <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
      <button type="button" onClick={onReset} className="rounded-lg px-3 py-2 text-[14.5px] font-medium text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10">
        Reset
      </button>
      <button type="button" onClick={onDone} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-[14.5px] font-semibold text-white hover:brightness-110">
        Done
      </button>
    </div>
  );

  return (
    <div ref={ref} className="relative">
      {label && <label className="mb-2 block text-[13.5px] font-medium text-ink-2">{label}</label>}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-12 w-full items-center gap-3 rounded-2xl border bg-surface-sunken px-4 text-left text-[14.5px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
          error ? "border-red-400" : open ? "border-violet-400 bg-surface" : "border-line-strong hover:border-violet-300 dark:hover:border-violet-500/40"
        )}
      >
        <span className="text-subtle">{icon}</span>
        <span className={cn("min-w-0 flex-1 truncate", display ? "font-medium text-ink" : "text-subtle")}>{display || placeholder}</span>
        <ChevronDown size={16} className={cn("shrink-0 text-subtle transition-transform", open && "rotate-180")} />
      </button>
      {error && <p className="mt-1.5 text-[12.5px] text-red-500">{error}</p>}

      {open && !isPhone && pos &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label={label ?? "Choose a date"}
            style={{ top: pos.top, left: pos.left, width: PANEL_W }}
            className="fixed z-[200] rounded-3xl border border-line bg-surface p-4 shadow-[0_24px_60px_-20px_rgba(30,20,70,0.45)]"
          >
            {children}
            {footer}
          </div>,
          document.body
        )}

      {open && isPhone &&
        createPortal(
          <div ref={panelRef} className="fixed inset-0 z-[200]" role="dialog" aria-label={label ?? "Choose a date"}>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
            <div className="absolute inset-x-0 bottom-0 rounded-t-[28px] border-t border-line bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 shadow-2xl">
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line-strong" />
              {children}
              {footer}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

/* ----------------------------------------------------------------- fields */

interface DateFieldProps {
  label?: string;
  value: string; // YYYY-MM-DD or ""
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  minYear?: number;
  maxYear?: number;
  min?: string;
  max?: string;
  defaultView?: { y: number; m: number };
}

/** Controlled date field (YYYY-MM-DD). Picking a day stages it; Done saves. */
export function DateField({ label, value, onChange, placeholder = "Select a date", error, minYear, maxYear, min, max, defaultView }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const thisYear = new Date().getFullYear();

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <PickerShell
      label={label}
      display={formatDateLabel(value)}
      placeholder={placeholder}
      error={error}
      icon={<Calendar size={17} />}
      open={open}
      setOpen={setOpen}
      onReset={() => setDraft("")}
      onDone={() => {
        onChange(draft);
        setOpen(false);
      }}
    >
      <CalendarBody
        value={draft}
        onSelect={setDraft}
        minYear={minYear ?? thisYear - 100}
        maxYear={maxYear ?? thisYear + 5}
        min={min}
        max={max}
        defaultView={defaultView}
      />
      {draft && <p className="mt-2 text-center text-[13px] font-medium text-violet-700 dark:text-violet-300">{formatDateLabel(draft)}</p>}
    </PickerShell>
  );
}

interface DateTimeFieldProps {
  label?: string;
  value: string; // YYYY-MM-DDTHH:mm (local) or ""
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  /** YYYY-MM-DD earliest selectable day. */
  min?: string;
}

const formatDateTimeLabel = (value: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
};

/** Controlled date + time field (local "YYYY-MM-DDTHH:mm", like datetime-local). */
export function DateTimeField({ label, value, onChange, placeholder = "Select date and time", error, min }: DateTimeFieldProps) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState("");
  const [time, setTime] = useState({ h: 18, m: 0 });
  const thisYear = new Date().getFullYear();

  useEffect(() => {
    if (!open) return;
    const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/.exec(value);
    if (match) {
      setDay(match[1]);
      setTime({ h: +match[2], m: +match[3] });
    } else {
      setDay("");
      setTime({ h: 18, m: 0 });
    }
  }, [open, value]);

  return (
    <PickerShell
      label={label}
      display={formatDateTimeLabel(value)}
      placeholder={placeholder}
      error={error}
      icon={<CalendarClockIcon />}
      open={open}
      setOpen={setOpen}
      onReset={() => {
        setDay("");
        setTime({ h: 18, m: 0 });
      }}
      onDone={() => {
        onChange(day ? `${day}T${pad(time.h)}:${pad(time.m)}` : "");
        setOpen(false);
      }}
    >
      <CalendarBody value={day} onSelect={setDay} minYear={thisYear - 1} maxYear={thisYear + 5} min={min} />
      <TimeWheels time={time} onChange={setTime} />
    </PickerShell>
  );
}

function CalendarClockIcon() {
  return <Calendar size={17} />;
}
