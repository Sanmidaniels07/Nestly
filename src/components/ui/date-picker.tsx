"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Input from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

interface DateOfBirthPickerProps {
  name?: string;
  label?: string;
  placeholder?: string;
  minAge?: number;
  maxAge?: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDisplay(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function DateOfBirthPicker({
  name = "dateOfBirth",
  label = "Date of birth",
  placeholder = "Select your date of birth",
  minAge = 13,
  maxAge = 100,
}: DateOfBirthPickerProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = (errors[name]?.message as string) || undefined;

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - maxAge;
  const maxYear = currentYear - minAge;

  const years = useMemo(() => {
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  }, [minYear, maxYear]);

  const [viewYear, setViewYear] = useState(maxYear);
  const [viewMonth, setViewMonth] = useState(0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const parsed = field.value ? new Date(field.value + "T00:00:00") : null;

        const openPicker = () => {
          if (parsed) {
            setViewYear(parsed.getFullYear());
            setViewMonth(parsed.getMonth());
          }
          setOpen((prev) => !prev);
        };

        const selectDay = (day: number) => {
          const mm = String(viewMonth + 1).padStart(2, "0");
          const dd = String(day).padStart(2, "0");
          field.onChange(`${viewYear}-${mm}-${dd}`);
          setOpen(false);
        };

        const totalDays = daysInMonth(viewMonth, viewYear);
        const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
        const cells = [
          ...Array(firstWeekday).fill(null),
          ...Array.from({ length: totalDays }, (_, i) => i + 1),
        ];

        const goPrevMonth = () => {
          if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
          } else {
            setViewMonth((m) => m - 1);
          }
        };

        const goNextMonth = () => {
          if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
          } else {
            setViewMonth((m) => m + 1);
          }
        };

        const isSelected = (day: number) =>
          parsed &&
          parsed.getFullYear() === viewYear &&
          parsed.getMonth() === viewMonth &&
          parsed.getDate() === day;

        return (
          <div ref={containerRef} className="relative">
            <div onClick={openPicker} className="cursor-pointer">
              <Input
                label={label}
                readOnly
                value={formatDisplay(field.value)}
                placeholder={placeholder}
                icon={<Calendar size={17} />}
                error={error}
                className="cursor-pointer"
              />
            </div>

            {open && (
              <div className="absolute z-50 mt-2 w-[300px] rounded-3xl border border-gray-200 bg-white p-5 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goPrevMonth}
                    className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-500"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={viewMonth}
                      onChange={(e) => setViewMonth(Number(e.target.value))}
                      className="rounded-lg border border-transparent bg-white px-1 text-sm font-medium text-gray-700 outline-none hover:border-gray-200"
                    >
                      {MONTHS.map((m, i) => (
                        <option key={m} value={i} className="bg-white text-gray-900">
                          {m}
                        </option>
                      ))}
                    </select>

                    <select
                      value={viewYear}
                      onChange={(e) => setViewYear(Number(e.target.value))}
                      className="rounded-lg border border-transparent bg-white px-1 text-sm font-medium text-gray-700 outline-none hover:border-gray-200"
                    >
                      {years.map((y) => (
                        <option key={y} value={y} className="bg-white text-gray-900">
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={goNextMonth}
                    className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-500"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-y-1.5 text-center">
                  {WEEKDAYS.map((wd) => (
                    <span key={wd} className="text-xs font-medium text-gray-400">
                      {wd}
                    </span>
                  ))}

                  {cells.map((day, idx) =>
                    day === null ? (
                      <span key={`empty-${idx}`} />
                    ) : (
                      <button
                        key={day}
                        type="button"
                        onClick={() => selectDay(day)}
                        className={cn(
                          "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                          isSelected(day)
                            ? "bg-violet-500 text-white"
                            : "text-gray-700 hover:bg-violet-50"
                        )}
                      >
                        {day}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}