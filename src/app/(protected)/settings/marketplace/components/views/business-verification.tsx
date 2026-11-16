"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, BadgeCheck, Clock, ExternalLink, ShieldCheck } from "lucide-react";

import { useMySeller } from "@/src/hooks/use-my-seller";
import { useUpdateMySeller } from "@/src/hooks/use-update-my-seller";
import { CAC_COMPANY_TYPES, cacTypeFromNumber, cacTypeLabel } from "@/src/lib/cac";
import { CacCompanyType, SellerProfile } from "@/src/types/seller";

const CAC_SEARCH_URL = "https://search.cac.gov.ng";

type Status = "none" | "pending" | "not-found" | "verified";

// Add or update the CAC registration number any time after joining. It's
// looked up on the CAC register straight away: an active business whose
// name matches the store is verified on the spot, anything else is checked
// by the Nestly team. Changing it sends it back for checking.
export default function BusinessVerification() {
  const { data: seller } = useMySeller();
  if (!seller) return null;
  // Starts fresh whenever the saved number or business type changes.
  return <BusinessVerificationCard key={`${seller.cacNumber ?? ""}:${seller.cacCompanyType ?? ""}`} seller={seller} />;
}

function BusinessVerificationCard({ seller }: { seller: SellerProfile }) {
  const saved = seller.cacNumber ?? "";
  const savedType = seller.cacCompanyType ?? (saved ? cacTypeFromNumber(saved) : undefined);
  const { mutate: save, isPending } = useUpdateMySeller();
  const sectionRef = useRef<HTMLElement>(null);
  const [value, setValue] = useState(saved);
  const [type, setType] = useState<CacCompanyType | "">(savedType ?? "");
  const [editing, setEditing] = useState(false);

  // Reminders link straight here (#business-verification).
  useEffect(() => {
    if (window.location.hash === "#business-verification") {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const result = seller.cacCheckResult;
  const status: Status = !saved
    ? "none"
    : seller.isVerified
      ? "verified"
      : result === "NOT_FOUND"
        ? "not-found"
        : "pending";
  const showForm = status === "none" || editing;
  const cleaned = value.replace(/[\s-]+/g, "").toUpperCase();
  const changed = cleaned !== saved || (type || undefined) !== (seller.cacCompanyType ?? undefined);

  const onNumberChange = (next: string) => {
    setValue(next.slice(0, 20));
    // RC... is a company, BN... a business name - pick it for them.
    const fromPrefix = cacTypeFromNumber(next);
    if (fromPrefix) setType(fromPrefix);
  };

  const submit = () => {
    if (!cleaned || !type || !changed) return;
    save({ cacNumber: cleaned, cacCompanyType: type }, { onSuccess: () => setEditing(false) });
  };

  const registered = seller.cacCheckedName ? <strong className="font-semibold">{seller.cacCheckedName}</strong> : null;
  const change = (tone: string) => (
    <button type="button" onClick={() => setEditing(true)} className={`text-[12.5px] font-semibold hover:underline ${tone}`}>
      Change
    </button>
  );

  return (
    <section ref={sectionRef} id="business-verification" className="scroll-mt-24 rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] text-ink">Business verification</h2>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
            Registered with the CAC? Add your registration number and we&apos;ll check it on the CAC register. Verified stores get a
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
          {change("text-emerald-800 dark:text-emerald-200")}
        </div>
      )}

      {status === "pending" && !editing && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-500/10">
          <Clock size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-amber-900 dark:text-amber-100">
            <span className="font-mono font-semibold">{saved}</span>{" "}
            {result === "AWAITING_STORE" && registered ? (
              <>is registered to {registered}. Create your store with this name and it&apos;s verified automatically.</>
            ) : result === "NAME_MISMATCH" && registered ? (
              <>is registered to {registered}, which doesn&apos;t match your store name - our team will check it, usually within a couple of days.</>
            ) : result === "INACTIVE" ? (
              <>isn&apos;t active on the CAC register{registered ? <> ({registered})</> : null}. Our team will take a look.</>
            ) : (
              <>is waiting to be checked - usually within a couple of days.</>
            )}
          </p>
          {change("text-amber-800 dark:text-amber-200")}
        </div>
      )}

      {status === "not-found" && !editing && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-red-50 px-4 py-3 dark:bg-red-500/10">
          <AlertCircle size={18} className="shrink-0 text-red-600 dark:text-red-400" />
          <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-red-900 dark:text-red-100">
            We couldn&apos;t find <span className="font-mono font-semibold">{saved}</span>
            {savedType ? <> as a {cacTypeLabel(savedType)?.toLowerCase()}</> : null} on the CAC register. Check the number and business type.
          </p>
          {change("text-red-800 dark:text-red-200")}
        </div>
      )}

      {showForm && (
        <div className="mt-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_15rem]">
            <div>
              <label htmlFor="cac-number" className="mb-1.5 block text-[13px] font-medium text-ink-2">
                CAC registration number
              </label>
              <input
                id="cac-number"
                value={value}
                onChange={(e) => onNumberChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="e.g. RC1234567"
                autoCapitalize="characters"
                className="h-12 w-full rounded-xl border border-line bg-surface px-4 font-mono text-[14px] uppercase tracking-wide text-ink outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
              />
            </div>
            <div>
              <label htmlFor="cac-type" className="mb-1.5 block text-[13px] font-medium text-ink-2">
                Business type
              </label>
              <select
                id="cac-type"
                value={type}
                onChange={(e) => setType(e.target.value as CacCompanyType)}
                className="h-12 w-full rounded-xl border border-line bg-surface px-3 text-[14px] text-ink outline-none transition-colors focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
              >
                <option value="" disabled>
                  Choose...
                </option>
                {CAC_COMPANY_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {type && <p className="-mt-1 text-[12px] text-subtle">{CAC_COMPANY_TYPES.find((option) => option.value === type)?.hint}</p>}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setValue(saved);
                  setType(savedType ?? "");
                }}
                className="h-12 rounded-xl px-4 text-[13px] font-medium text-muted hover:bg-surface-2"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={!cleaned || !type || !changed || isPending}
              className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-[13.5px] font-semibold text-white transition-opacity disabled:opacity-50"
            >
              {isPending ? "Checking..." : "Submit for checking"}
            </button>
          </div>
          <p className="flex flex-wrap items-center gap-1 text-[12px] text-subtle">
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

function StatusPill({ status }: { status: Status }) {
  const styles = {
    none: { label: "Not added", tone: "bg-surface-2 text-ink-2", icon: ShieldCheck },
    pending: { label: "Being checked", tone: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300", icon: Clock },
    "not-found": { label: "Not found", tone: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300", icon: AlertCircle },
    verified: { label: "Verified", tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300", icon: BadgeCheck },
  }[status];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${styles.tone}`}>
      <styles.icon size={13} /> {styles.label}
    </span>
  );
}
