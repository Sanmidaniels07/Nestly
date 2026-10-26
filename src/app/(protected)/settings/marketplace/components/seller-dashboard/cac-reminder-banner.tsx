"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BadgeCheck, ExternalLink } from "lucide-react";

import { useUpdateMySeller } from "@/src/hooks/use-update-my-seller";

// Shown to every approved seller who hasn't added a CAC number yet - on all
// Seller Hub tabs and the home dashboard - until they add one. There's no
// dismiss on purpose; the form opens right here, so it works with or
// without a store. Reminder links add ?cac=1 to open it straight away.
export default function CacReminderBanner() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(searchParams.get("cac") === "1");
  const [value, setValue] = useState("");
  const { mutate: save, isPending } = useUpdateMySeller();

  const cleaned = value.replace(/[\s-]+/g, "").toUpperCase();
  const submit = () => cleaned && save({ cacNumber: cleaned });

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-5 dark:border-emerald-500/30 dark:from-emerald-500/10 dark:to-teal-500/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <BadgeCheck size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-ink">Add your CAC registration number</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
            Registered with the CAC? Add your number to get a verified badge - buyers are more likely to order from verified sellers.
          </p>
        </div>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-4 text-[13px] font-semibold text-white hover:bg-emerald-700"
          >
            Add CAC number
          </button>
        )}
      </div>

      {open && (
        <div className="mt-4 border-t border-emerald-200/70 pt-4 dark:border-emerald-500/20">
          <label htmlFor="cac-banner-number" className="mb-1.5 block text-[12.5px] font-medium text-ink-2">
            CAC registration number
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="cac-banner-number"
              value={value}
              onChange={(e) => setValue(e.target.value.slice(0, 20))}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. RC1234567"
              autoCapitalize="characters"
              autoFocus
              className="h-11 flex-1 rounded-xl border border-emerald-200 bg-surface px-4 font-mono text-[14px] uppercase tracking-wide text-ink outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-subtle focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-emerald-500/30"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 rounded-xl px-4 text-[13px] font-medium text-muted hover:bg-white/60 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!cleaned || isPending}
                className="h-11 flex-1 rounded-xl bg-emerald-600 px-5 text-[13px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 sm:flex-none"
              >
                {isPending ? "Saving..." : "Submit for checking"}
              </button>
            </div>
          </div>
          <p className="mt-2 text-[11.5px] text-subtle">
            Find it on your CAC certificate, or look your business up on{" "}
            <a href="https://search.cac.gov.ng" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-medium text-emerald-700 hover:underline dark:text-emerald-300">
              search.cac.gov.ng <ExternalLink size={10} />
            </a>
            . Not registered yet? You can keep selling as usual.
          </p>
        </div>
      )}
    </div>
  );
}
