"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Option<T extends string> {
  label: string;
  value: T;
}

interface FormSelectProps<T extends string> {
  label?: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function FormSelect<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = "Select an option",
  fullWidth = true,
  disabled = false,
}: FormSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("group relative", fullWidth && "w-full")}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          `
          relative flex h-14 w-full items-center justify-between rounded-3xl border
          border-gray-200 bg-white px-5 text-left transition-all duration-200
          hover:border-gray-300
          dark:bg-gray-900 dark:border-gray-700
          disabled:cursor-not-allowed disabled:opacity-50
          `,
          open && "border-violet-500 ring-4 ring-violet-100 dark:ring-violet-900/30",
          error && "border-red-500 ring-4 ring-red-100"
        )}
      >
        <span className={cn("text-base", selected ? "text-gray-900 dark:text-white" : "text-gray-400")}>
          {selected ? selected.label : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-gray-400 transition-transform duration-200",
            open && "rotate-180 text-violet-500"
          )}
        />
      </button>

      {open && (
        <div
          className="
            absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto
            rounded-2xl border border-gray-200 bg-white p-1.5 shadow-[0_20px_60px_-16px_rgba(15,15,20,0.25)]
            dark:border-gray-700 dark:bg-gray-900
          "
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  `
                  flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-[14px]
                  transition-colors
                  `,
                  isSelected
                    ? "bg-violet-50 font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                )}
              >
                {option.label}
                {isSelected && <Check size={16} className="text-violet-600 dark:text-violet-300" />}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}