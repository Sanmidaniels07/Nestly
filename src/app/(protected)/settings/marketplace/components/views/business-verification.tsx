"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Clock, ExternalLink, ShieldCheck } from "lucide-react";

import { useMySeller } from "@/src/hooks/use-my-seller";
import { useUpdateMySeller } from "@/src/hooks/use-update-my-seller";

const CAC_SEARCH_URL = "https://search.cac.gov.ng";

// Add or update the CAC registration number any time after joining. A
// checked number earns the store's verified badge; changing it sends it
// back for checking.
export default function BusinessVerification() {
  const { data: seller } = useMySeller();
  if (!seller) return null;
  // Starts fresh whenever the saved number changes.
  return <BusinessVerificationCard key={seller.cacNumber ?? ""} saved={seller.cacNumber ?? ""} isVerified={!!seller.isVerified} />;
}

function BusinessVerificationCard({ saved, isVerified }: { saved: string; isVerified: boolean }) {
  const { mutate: save, isPending } = useUpdateMySeller();
  const sectionRef = useRef<HTMLElement>(null);
  const [value, setValue] = useState(saved);
  const [editing, setEditing] = useState(false);

  // Reminders link straight here (#business-verification).
  useEffect(() => {
    if (window.location.hash === "#business-verification") {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const status: "none" | "pending" | "verified" = !saved ? "none" : isVerified ? "verified" : "pending";
  const showForm = status === "none" || editing;
  const cleaned = value.replace(/[\s-]+/g, "").toUpperCase();
  const changed = cleaned !== saved;

  const submit = () => {
    if (!cleaned || !changed) return;
    save({ cacNumber: cleaned }, { onSuccess: () => setEditing(false) });
  };

  return (
    <section ref={sectionRef} id="business-verification" className="scroll-mt-24 rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">Business verification</h2>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
            Registered with the CAC? Add your registration number and we&apos;ll check it on the CAC public register. Verified stores get a
            badge buyers trust. Not registered yet? You can keep selling and add it whenever you&apos;re ready.
          </p>
        </div>
        <StatusPill status={status} />
      </div>

      {status === "verified" && !editing && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-500/10">
          <BadgeCheck size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="flex-1 text-[13px] text-emerald-900 dark:text-emerald-100">
            <span className="font-mono font-semibold">{saved}</span> is verified - your store shows the verified badge.
          </p>
          <button type="button" onClick={() => setEditing(true)} className="text-[12.5px] font-semibold text-emerald-800 hover:underline dark:text-emerald-200">
            Change
          </button>
        </div>
      )}

      {status === "pending" && !editing && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-500/10">
          <Clock size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="flex-1 text-[13px] text-amber-900 dark:text-amber-100">
            <span className="font-mono font-semibold">{saved}</span> is waiting to be checked - usually within a couple of days.
          </p>
          <button type="button" onClick={() => setEditing(true)} className="text-[12.5px] font-semibold text-amber-800 hover:underline dark:text-amber-200">
            Change
          </button>
        </div>
      )}

      {showForm && (
        <div className="mt-5">
          <label htmlFor="cac-number" className="mb-1.5 block text-[13px] font-medium text-ink-2">
            CAC registration number
          </label>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              id="cac-number"
              value={value}
              onChange={(e) => setValue(e.target.value.slice(0, 20))}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. RC1234567"
              autoCapitalize="characters"
              className="h-12 flex-1 rounded-xl border border-line bg-surface px-4 font-mono text-[14px] uppercase tracking-wide text-ink outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
            />
            <div className="flex gap-2">
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setValue(saved);
                  }}
                  className="h-12 rounded-xl px-4 text-[13px] font-medium text-muted hover:bg-surface-2"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={submit}
                disabled={!cleaned || !changed || isPending}
                className="h-12 flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-[13.5px] font-semibold text-white transition-opacity disabled:opacity-50 sm:flex-none"
              >
                {isPending ? "Saving..." : "Submit for checking"}
              </button>
            </div>
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-[12px] text-subtle">
            {editing && status === "verified"
              ? "Changing it removes the badge until the new number is checked."
              : "Find it on your CAC certificate, or look your business up on"}
            {!(editing && status === "verified") && (
              <a href={CAC_SEARCH_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-medium text-violet-700 hover:underline dark:text-violet-300">
                search.cac.gov.ng <ExternalLink size={11} />
              </a>
            )}
          </p>
        </div>
      )}
    </section>
  );
}

function StatusPill({ status }: { status: "none" | "pending" | "verified" }) {
  const styles = {
    none: { label: "Not added", tone: "bg-surface-2 text-ink-2", icon: ShieldCheck },
    pending: { label: "Waiting for check", tone: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300", icon: Clock },
    verified: { label: "Verified", tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300", icon: BadgeCheck },
  }[status];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${styles.tone}`}>
      <styles.icon size={13} /> {styles.label}
    </span>
  );
}
