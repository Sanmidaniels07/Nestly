"use client";

import { Controller, useFormContext } from "react-hook-form";

import { DateField, toYMD } from "./calendar-picker";

interface DateOfBirthPickerProps {
  name?: string;
  label?: string;
  placeholder?: string;
  minAge?: number;
  maxAge?: number;
}

// Date of birth inside a react-hook-form form (signup, Edit profile), built
// on Nestly's DateField. Only offers dates for ages minAge-maxAge; the
// value stays a "YYYY-MM-DD" string.
export default function DateOfBirthPicker({
  name = "dateOfBirth",
  label = "Date of birth",
  placeholder = "Select your date of birth",
  minAge = 13,
  maxAge = 100,
}: DateOfBirthPickerProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = (errors[name]?.message as string) || undefined;

  const today = new Date();
  const maxYear = today.getFullYear() - minAge;
  const minYear = today.getFullYear() - maxAge;
  const latest = toYMD(maxYear, today.getMonth(), today.getDate());
  const earliest = toYMD(minYear, today.getMonth(), today.getDate());

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DateField
          label={label}
          value={field.value ?? ""}
          onChange={field.onChange}
          placeholder={placeholder}
          error={error}
          minYear={minYear}
          maxYear={maxYear}
          min={earliest}
          max={latest}
          // Open around a typical adult birthday rather than 13 years ago.
          defaultView={{ y: today.getFullYear() - 25, m: today.getMonth() }}
        />
      )}
    />
  );
}
