"use client";

import { useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Landmark,
  Link2,
  Loader2,
  ShieldCheck,
  Store as StoreIcon,
} from "lucide-react";

import { useQuickStartSeller } from "@/src/hooks/use-quick-start-seller";
import { useBanks } from "@/src/hooks/use-banks";
import { useSetupPayoutAccount } from "@/src/hooks/use-setup-payout-account";
import { useCategories } from "@/src/hooks/use-categories";
import { useFormDraft } from "@/src/hooks/use-form-draft";
import DraftRestoredNotice from "@/src/components/ui/draft-restored-notice";
import { CAC_COMPANY_TYPES, cacTypeFromNumber } from "@/src/lib/cac";
import { naira } from "@/src/lib/payment-link";
import Checkbox from "@/src/components/ui/checkbox";
import LinkForm from "@/src/app/(protected)/settings/marketplace/components/payment-links/link-form";
import ShareLink from "@/src/app/(protected)/settings/marketplace/components/payment-links/share-link";
import { ApiErrorResponse } from "@/src/types/api";
import { PaymentLink } from "@/src/types/payment-link";
import { CacCompanyType, SellerProfile } from "@/src/types/seller";

// Quick start: from "I want to sell" to a payment link in a buyer's DMs in
// about two minutes. Shop -> Get paid -> First link -> Share. The store is
// live after the first step; Nestly reviews it afterwards (payouts held and
// one order capped until then).

type Step = "shop" | "bank" | "link" | "share";

const STEPS: { key: Step; label: string }[] = [
  { key: "shop", label: "Your shop" },
  { key: "bank", label: "Get paid" },
  { key: "link", label: "First link" },
  { key: "share", label: "Share" },
];

const field =
  "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[16px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]";
const label = "mb-1.5 block text-[13px] font-semibold text-ink-2";
const primary =
  "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[14px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60";

const apiError = (error: unknown, fallback: string) =>
  (error as AxiosError<ApiErrorResponse>)?.response?.data?.message ?? fallback;

interface Props {
  // Set when they already have a profile (e.g. an application still pending).
  seller?: SellerProfile | null;
  // Called when the shop step is submitted - from then on the page keeps
  // this wizard on screen, though the seller now has a store.
  onBegin: () => void;
  onFinish: () => void;
}

export default function QuickStart({ seller: initialSeller, onBegin, onFinish }: Props) {
  const [step, setStep] = useState<Step>("shop");
  const [seller, setSeller] = useState<SellerProfile | null>(initialSeller ?? null);
  const [link, setLink] = useState<PaymentLink | null>(null);

  const store = seller?.store ?? null;
  const index = STEPS.findIndex((s) => s.key === step);

  return (
    <section className="mx-auto max-w-xl space-y-5">
      <header className="space-y-3 text-center">
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
          Start selling · about 2 minutes
        </p>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] leading-tight text-ink">
          {step === "shop" && "Open your shop on Nestly"}
          {step === "bank" && "Where should we pay you?"}
          {step === "link" && "Make your first payment link"}
          {step === "share" && "Send it to your buyer"}
        </h1>
        <ol className="flex items-center justify-center gap-1.5" aria-label="Progress">
          {STEPS.map((s, i) => (
            <li key={s.key} className="flex items-center gap-1.5">
              <span
                className={`flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11.5px] font-semibold ${
                  i < index
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
                    : i === index
                      ? "bg-violet-600 text-white"
                      : "bg-surface-2 text-subtle"
                }`}
                aria-current={i === index ? "step" : undefined}
              >
                {i < index && <CheckCircle2 size={12} />}
                <span className={i === index ? "" : "hidden sm:inline"}>{s.label}</span>
                {i !== index && <span className="sm:hidden">{i + 1}</span>}
              </span>
              {i < STEPS.length - 1 && <span className="h-px w-3 bg-line" aria-hidden />}
            </li>
          ))}
        </ol>
      </header>

      {step === "shop" && (
        <ShopStep
          seller={seller}
          onSubmit={onBegin}
          onDone={(profile) => {
            setSeller(profile);
            setStep("bank");
          }}
        />
      )}
      {step === "bank" && store && <BankStep slug={store.slug} storeName={store.name} onDone={() => setStep("link")} />}
      {step === "link" && (
        <LinkForm
          firstLink
          orderLimit={seller?.orderLimit ?? null}
          onDone={(created) => {
            setLink(created);
            setStep("share");
          }}
          onCancel={() => setStep("share")}
        />
      )}
      {step === "share" && <ShareStep link={link} seller={seller} onFinish={onFinish} />}

      {step !== "share" && (
        <p className="flex items-start justify-center gap-1.5 text-center text-[12px] text-subtle">
          <ShieldCheck size={14} className="mt-0.5 shrink-0" />
          Buyers pay Nestly, not you directly. You&apos;re paid once they confirm delivery - that&apos;s why they trust your link.
        </p>
      )}
    </section>
  );
}

// Step 1 - the store name, the agreement, and optionally CAC and socials.
function ShopStep({
  seller,
  onSubmit,
  onDone,
}: {
  seller: SellerProfile | null;
  onSubmit: () => void;
  onDone: (seller: SellerProfile) => void;
}) {
  const { data: categories } = useCategories();
  const { mutate: quickStart, isPending } = useQuickStartSeller();
  const [storeName, setStoreName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [cacNumber, setCacNumber] = useState(seller?.cacNumber ?? "");
  const [cacType, setCacType] = useState<CacCompanyType | "">(seller?.cacCompanyType ?? "");
  const [agreed, setAgreed] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [error, setError] = useState("");

  // What they typed is kept in this browser (per account) until the store is
  // opened, so a refresh or logging out brings them back here.
  const initial = {
    storeName: "",
    instagram: "",
    whatsapp: "",
    cacNumber: seller?.cacNumber ?? "",
    cacType: (seller?.cacCompanyType ?? "") as CacCompanyType | "",
    agreed: false,
  };
  const typed = { storeName, instagram, whatsapp, cacNumber, cacType, agreed };
  const fill = (values: typeof initial) => {
    setStoreName(values.storeName);
    setInstagram(values.instagram);
    setWhatsapp(values.whatsapp);
    setCacNumber(values.cacNumber);
    setCacType(values.cacType);
    setAgreed(values.agreed);
  };
  const { restored, clear: clearSaved, dismissNotice } = useFormDraft(
    "seller:quick-start",
    typed,
    (saved) => {
      fill({ ...initial, ...saved });
      if (saved.cacNumber && saved.cacNumber !== initial.cacNumber) setShowMore(true);
    },
    { isEmpty: (value) => JSON.stringify(value) === JSON.stringify(initial) }
  );

  const startOver = () => {
    fill(initial);
    setError("");
    clearSaved();
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (storeName.trim().length < 2) return setError("Give your store a name.");
    if (cacNumber.trim() && !cacType) return setError("Choose your business type for the CAC number.");
    if (!agreed) return setError("Agree to the Seller Agreement to start selling.");
    setError("");
    onSubmit();
    quickStart(
      {
        storeName: storeName.trim(),
        instagram: instagram.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        cacNumber: cacNumber.trim() || undefined,
        cacCompanyType: cacNumber.trim() && cacType ? cacType : undefined,
        agreeToSellerTerms: true,
      },
      {
        onSuccess: (response) => {
          clearSaved();
          onDone(response.data);
        },
        onError: (err) => setError(apiError(err, "Couldn't open your store. Please try again.")),
      }
    );
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-7">
      {restored && <DraftRestoredNotice what="the shop details you entered" onStartOver={startOver} onDismiss={dismissNotice} />}

      {seller?.status === "PENDING" && (
        <p className="flex items-start gap-2 rounded-xl bg-violet-50 px-3.5 py-3 text-[12.5px] text-violet-900 dark:bg-violet-400/10 dark:text-violet-100">
          <Clock size={15} className="mt-0.5 shrink-0" />
          Your application is waiting for review - no need to wait any more. Open your shop now and we&apos;ll review it alongside.
        </p>
      )}

      <div>
        <label htmlFor="qs-name" className={label}>
          Store name
        </label>
        <input
          id="qs-name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          maxLength={60}
          placeholder="e.g. Tola's Bakes"
          autoFocus
          className={field}
        />
        <p className="mt-1 text-[11.5px] text-subtle">What buyers know you as - usually your Instagram or WhatsApp business name.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="qs-ig" className={label}>
            Instagram <span className="font-normal text-subtle">(optional)</span>
          </label>
          <input id="qs-ig" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourshop" autoCapitalize="none" className={field} />
        </div>
        <div>
          <label htmlFor="qs-wa" className={label}>
            WhatsApp <span className="font-normal text-subtle">(optional)</span>
          </label>
          <input id="qs-wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="0815 967 1809" inputMode="tel" className={field} />
        </div>
      </div>

      <div className="rounded-xl border border-line">
        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          aria-expanded={showMore}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold text-ink-2">
            <BadgeCheck size={16} className="text-violet-600 dark:text-violet-400" />
            Registered with CAC? Get the verified badge
          </span>
          <ChevronDown size={16} className={`text-subtle transition-transform ${showMore ? "rotate-180" : ""}`} />
        </button>
        {showMore && (
          <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-2">
            <div>
              <label htmlFor="qs-cac" className={label}>
                CAC number
              </label>
              <input
                id="qs-cac"
                value={cacNumber}
                onChange={(e) => {
                  setCacNumber(e.target.value);
                  const fromPrefix = cacTypeFromNumber(e.target.value);
                  if (fromPrefix) setCacType(fromPrefix);
                }}
                placeholder="RC1234567 or BN1234567"
                className={field}
              />
            </div>
            <div>
              <label htmlFor="qs-cac-type" className={label}>
                Business type
              </label>
              <select id="qs-cac-type" value={cacType} onChange={(e) => setCacType(e.target.value as CacCompanyType)} className={field}>
                <option value="">Choose…</option>
                {CAC_COMPANY_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11.5px] text-subtle sm:col-span-2">We check it with the CAC register automatically. You can also add it later in settings.</p>
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="flex items-start gap-3 text-[13px] leading-relaxed text-ink-2">
          <Checkbox checked={agreed} onChange={setAgreed} ariaLabel="I agree to the Seller Agreement" className="mt-0.5" />
          <span className="cursor-pointer" onClick={() => setAgreed(!agreed)}>
            I agree to the{" "}
            <Link
              href="/seller-terms"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
            >
              Seller Agreement
            </Link>
            , including Nestly&apos;s commission on each sale and the rules on prohibited items, deliveries and refunds.
          </span>
        </div>
        {!!categories?.length && (
          <div className="pl-8">
            <button
              type="button"
              onClick={() => setShowRates(!showRates)}
              className="text-[12px] font-semibold text-violet-700 hover:underline dark:text-violet-300"
              aria-expanded={showRates}
            >
              {showRates ? "Hide commission rates" : "See commission rates"}
            </button>
            {showRates && (
              <div className="mt-2 space-y-1 rounded-xl bg-surface-sunken p-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex justify-between text-[12px]">
                    <span className="text-ink-2">{category.name}</span>
                    <span className="font-[family-name:var(--font-mono)] font-medium text-violet-700 dark:text-violet-300">
                      {category.commissionRate}%
                    </span>
                  </div>
                ))}
                <p className="pt-1 text-[11.5px] text-subtle">On item prices only - you keep your delivery fees in full.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

      <button type="submit" disabled={isPending} className={primary}>
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <StoreIcon size={16} />}
        Open my store
      </button>
    </form>
  );
}

// Step 2 - bank account (checked with the bank). Can be skipped: sales wait safely.
function BankStep({ slug, storeName, onDone }: { slug: string; storeName: string; onDone: () => void }) {
  const { data: banks, isLoading: banksLoading } = useBanks();
  const { mutate: setup, isPending } = useSetupPayoutAccount();
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Only the bank choice is kept - never the account number.
  const { clear: clearSaved } = useFormDraft("seller:quick-start:bank", { bankCode }, (saved) => setBankCode(saved.bankCode ?? ""), {
    isEmpty: (value) => !value.bankCode,
  });

  const skip = () => {
    clearSaved();
    onDone();
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!bankCode) return setError("Choose your bank.");
    if (!/^\d{10}$/.test(accountNumber)) return setError("Enter your 10-digit account number.");
    setError("");
    setup(
      { slug, data: { bankCode, accountNumber } },
      {
        onSuccess: (response) => {
          clearSaved();
          const name = (response as { data?: { payoutAccountName?: string | null } })?.data?.payoutAccountName ?? null;
          setAccountName(name ?? "your account");
        },
        onError: (err) => setError(apiError(err, "We couldn't confirm that account. Check the bank and number.")),
      }
    );
  };

  if (accountName) {
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/5 sm:p-7">
        <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <CheckCircle2 size={18} className="text-emerald-600" /> Bank account confirmed
        </p>
        <p className="text-[13.5px] text-ink-2">
          Payouts for {storeName} go to <strong className="text-ink">{accountName}</strong>. Check that&apos;s you - if not, change it later in Store settings.
        </p>
        <button type="button" onClick={onDone} className={primary}>
          Continue <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div>
        <label htmlFor="qs-bank" className={label}>
          Bank
        </label>
        <select id="qs-bank" value={bankCode} onChange={(e) => setBankCode(e.target.value)} className={field} disabled={banksLoading}>
          <option value="">{banksLoading ? "Loading banks…" : "Choose your bank"}</option>
          {banks?.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="qs-acct" className={label}>
          Account number
        </label>
        <input
          id="qs-acct"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
          inputMode="numeric"
          placeholder="0123456789"
          className={`${field} font-[family-name:var(--font-mono)] tracking-wider`}
        />
        <p className="mt-1 text-[11.5px] text-subtle">We check the name on the account with your bank before saving it.</p>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

      <button type="submit" disabled={isPending} className={primary}>
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Landmark size={16} />}
        Confirm account
      </button>
      <button type="button" onClick={skip} className="w-full text-center text-[13px] font-semibold text-muted hover:text-ink">
        Skip for now - I&apos;ll add it before my first payout
      </button>
    </form>
  );
}

// Step 4 - the link, ready to send, and what happens next.
function ShareStep({ link, seller, onFinish }: { link: PaymentLink | null; seller: SellerProfile | null; onFinish: () => void }) {
  const store = seller?.store;
  const underReview = !!store?.underReview;

  return (
    <div className="space-y-5">
      {link ? (
        <div className="space-y-4 rounded-2xl border border-violet-200 bg-surface p-5 dark:border-violet-500/30 sm:p-7">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <Link2 size={17} className="text-violet-600 dark:text-violet-400" /> {link.title} · {naira(link.price)}
          </p>
          <p className="text-[13px] text-muted">Paste it in your DMs or WhatsApp. You&apos;ll get a notification the moment they pay.</p>
          <ShareLink link={link} />
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
          <p className="text-[14.5px] font-semibold text-ink">{store?.name ?? "Your store"} is open</p>
          <p className="mt-1 text-[13px] text-muted">
            Make a payment link whenever a buyer is ready - Seller Hub → Payment links.
          </p>
        </div>
      )}

      {underReview && (
        <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[13px] text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          <p className="flex items-center gap-2 font-semibold">
            <Clock size={16} /> Nestly is reviewing your new store
          </p>
          <ul className="list-disc space-y-1 pl-5 text-[12.5px] leading-relaxed">
            <li>You can sell right now. Reviews usually take about a day.</li>
            <li>Until then, your earnings are held safely and paid out once you&apos;re reviewed and the buyer has received their order.</li>
            {seller?.orderLimit ? <li>One order can be up to {naira(seller.orderLimit)} for now.</li> : null}
          </ul>
        </div>
      )}

      <button type="button" onClick={onFinish} className={primary}>
        Go to Seller Hub <ArrowRight size={16} />
      </button>
    </div>
  );
}
