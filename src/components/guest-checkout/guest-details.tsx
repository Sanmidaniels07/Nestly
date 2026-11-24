"use client";

import Link from "next/link";
import { MapPin, UserRound } from "lucide-react";

import { rememberReturnTo } from "@/src/lib/return-to";
import { NIGERIAN_STATES } from "@/src/lib/google-maps";
import { PHONE_PATTERN } from "@/src/lib/phone";

// Checking out without an account (a payment link, or the shop cart):
// who they are, and where it goes unless everything is picked up.

export interface GuestDetailsValue {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export const emptyGuest: GuestDetailsValue = { name: "", email: "", phone: "", address: "", city: "", state: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** What's missing or wrong in the guest's details, or null when they can pay. */
export const guestProblem = (value: GuestDetailsValue, needsAddress: boolean) => {
  if (value.name.trim().length < 2) return "Enter your name.";
  if (!EMAIL_PATTERN.test(value.email.trim())) return "Enter a valid email - your receipt and delivery code go there.";
  if (!PHONE_PATTERN.test(value.phone.trim())) return "Enter a valid phone number, e.g. 0803 123 4567.";
  if (needsAddress) {
    if (value.address.trim().length < 5) return "Enter your street address.";
    if (value.city.trim().length < 2) return "Enter your city or area.";
    if (!value.state) return "Choose your state.";
  }
  return null;
};

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]";

// Pay without an account: contact details, and the delivery address
// unless they're picking it up. The seller gets the name, address and
// phone to deliver, as with any order.
export default function GuestDetails({
  value,
  onChange,
  needsAddress,
  returnTo,
}: {
  value: GuestDetailsValue;
  onChange: (value: GuestDetailsValue) => void;
  needsAddress: boolean;
  // Where "Have an account? Log in" comes back to.
  returnTo: string;
}) {
  const set = (key: keyof GuestDetailsValue) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...value, [key]: event.target.value });

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <UserRound size={16} className="text-violet-600 dark:text-violet-400" /> Your details
        </p>
        <Link
          href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
          onClick={() => rememberReturnTo(returnTo)}
          className="text-[12.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300"
        >
          Have an account? Log in
        </Link>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-2">Full name</span>
          <input value={value.name} onChange={set("name")} autoComplete="name" placeholder="e.g. Tola Adebayo" className={inputClass} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-2">Email</span>
          <input
            type="email"
            value={value.email}
            onChange={set("email")}
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            className={inputClass}
          />
          <span className="text-[11.5px] text-subtle">Your receipt, delivery code and order updates go here.</span>
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-2">Phone number</span>
          <input
            type="tel"
            value={value.phone}
            onChange={set("phone")}
            autoComplete="tel"
            inputMode="tel"
            placeholder="0803 123 4567"
            className={inputClass}
          />
          <span className="text-[11.5px] text-subtle">The seller calls this number to deliver.</span>
        </label>
      </div>

      {needsAddress && (
        <div className="grid gap-3 border-t border-dashed border-line pt-4">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
            <MapPin size={15} className="text-violet-600 dark:text-violet-400" /> Delivery address
          </p>
          <label className="grid gap-1.5">
            <span className="text-[12.5px] font-medium text-ink-2">Street address</span>
            <input
              value={value.address}
              onChange={set("address")}
              autoComplete="street-address"
              placeholder="House number, street, nearest bus stop or landmark"
              className={inputClass}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-2">City / area</span>
              <input value={value.city} onChange={set("city")} autoComplete="address-level2" placeholder="e.g. Ikeja" className={inputClass} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-2">State</span>
              <select value={value.state} onChange={set("state")} autoComplete="address-level1" className={inputClass}>
                <option value="">Choose…</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state === "Federal Capital Territory" ? "Abuja (FCT)" : state}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
