"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { Bank } from "@/src/types/store";
import { cn } from "@/src/lib/utils";

interface Props {
  banks: Bank[] | undefined;
  value: string;
  onChange: (bankCode: string) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  // id for the trigger, so an outside <label htmlFor> points at it.
  id?: string;
  // Classes for the closed field, to match the form it sits in.
  className?: string;
}

// The banks most sellers use, shown first before anything is typed.
const POPULAR = [
  /^opay/i,
  /^moniepoint/i,
  /^palmpay/i,
  /^guaranty trust/i,
  /^access bank$/i,
  /^first bank of nigeria/i,
  /^united bank for africa/i,
  /^zenith bank/i,
  /^kuda/i,
];

// Short names people actually type.
const ALIASES: Record<string, string> = {
  gtb: "guaranty trust bank",
  gtbank: "guaranty trust bank",
  gtco: "guaranty trust bank",
  uba: "united bank for africa",
  fbn: "first bank of nigeria",
  firstbank: "first bank of nigeria",
  fcmb: "first city monument bank",
  stanbic: "stanbic ibtc",
  alat: "alat by wema",
  diamond: "access bank (diamond)",
};

const simplify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Every typed word must appear in the bank's name (or its short name).
function matches(bank: Bank, query: string) {
  const name = simplify(bank.name);
  const compactName = name.replace(/ /g, "");
  return simplify(query)
    .split(" ")
    .filter(Boolean)
    .every((word) => {
      const alias = ALIASES[word];
      if (alias && name.includes(simplify(alias))) return true;
      return name.includes(word) || compactName.includes(word);
    });
}

// A bank dropdown you can type into: Nigeria has hundreds of banks and
// microfinance banks, too many to scroll through.
export default function BankPicker({
  banks,
  value,
  onChange,
  loading = false,
  disabled = false,
  placeholder = "Choose your bank",
  id,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = banks?.find((bank) => bank.code === value);

  const { popular, results } = useMemo(() => {
    const all = banks ?? [];
    if (query.trim()) return { popular: [] as Bank[], results: all.filter((bank) => matches(bank, query)) };
    const top = POPULAR.map((pattern) => all.find((bank) => pattern.test(bank.name))).filter((bank): bank is Bank => !!bank);
    const topCodes = new Set(top.map((bank) => bank.code));
    return { popular: top, results: all.filter((bank) => !topCodes.has(bank.code)) };
  }, [banks, query]);

  // One list for the keyboard: popular first, then the rest.
  const ordered = useMemo(() => [...popular, ...results], [popular, results]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const openPicker = () => {
    if (disabled || loading) return;
    setActive(Math.max(0, ordered.findIndex((bank) => bank.code === value)));
    setOpen(true);
  };

  const choose = (bank: Bank) => {
    onChange(bank.code);
    close();
  };

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open]);

  // Keep the highlighted bank in view while using the arrow keys.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, ordered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      // Never submit the form from the search box.
      e.preventDefault();
      if (ordered[active]) choose(ordered[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const renderBank = (bank: Bank, index: number) => {
    const isSelected = bank.code === value;
    return (
      // Code + name: Paystack lists a few different banks under one code.
      <li key={`${bank.code}:${bank.name}`} role="presentation">
        <button
          type="button"
          role="option"
          id={`${listId}-${index}`}
          data-index={index}
          aria-selected={isSelected}
          onMouseEnter={() => setActive(index)}
          onClick={() => choose(bank)}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14px] transition-colors",
            index === active && "bg-surface-2",
            isSelected ? "font-semibold text-violet-700 dark:text-violet-300" : "text-ink-2"
          )}
        >
          <span className="min-w-0 truncate">{bank.name}</span>
          {isSelected && <Check size={16} className="shrink-0 text-violet-600 dark:text-violet-400" />}
        </button>
      </li>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => (open ? close() : openPicker())}
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-60",
          className,
          open && "border-violet-400"
        )}
      >
        <span className={cn("min-w-0 truncate", selected ? "text-ink" : "text-subtle")}>
          {loading ? "Loading banks…" : selected ? selected.name : placeholder}
        </span>
        <ChevronDown size={17} className={cn("shrink-0 text-subtle transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-[70] mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_20px_60px_-16px_rgba(15,15,20,0.25)]">
          <div className="flex items-center gap-2 border-b border-line px-3.5">
            <Search size={16} className="shrink-0 text-subtle" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
              placeholder="Search banks, e.g. GTB, OPay"
              aria-label="Search banks"
              aria-controls={listId}
              aria-activedescendant={ordered[active] ? `${listId}-${active}` : undefined}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="h-12 w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-subtle sm:text-[14px]"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActive(0);
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
                className="shrink-0 rounded-full p-1 text-subtle hover:text-ink"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <ul ref={listRef} id={listId} role="listbox" aria-label="Banks" className="max-h-72 overflow-y-auto p-1.5">
            {ordered.length === 0 && (
              <li className="px-3.5 py-6 text-center text-[13px] text-muted">
                No bank matches &ldquo;{query.trim()}&rdquo;. Try a shorter name.
              </li>
            )}
            {popular.length > 0 && (
              <li role="presentation" className="px-3.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                Popular
              </li>
            )}
            {popular.map((bank, i) => renderBank(bank, i))}
            {popular.length > 0 && results.length > 0 && (
              <li role="presentation" className="px-3.5 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                All banks
              </li>
            )}
            {results.map((bank, i) => renderBank(bank, popular.length + i))}
          </ul>
        </div>
      )}
    </div>
  );
}
