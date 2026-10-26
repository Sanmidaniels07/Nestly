"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { useMyStore } from "@/src/hooks/use-my-store";
import { useMyProducts } from "@/src/hooks/use-my-products";
import { SellerProfile } from "@/src/types/seller";

interface Props {
  seller: SellerProfile;
}

interface Step {
  title: string;
  description: string;
  done: boolean;
  href: string;
  cta: string;
  // Optional steps are shown but don't count towards finishing setup.
  optional?: boolean;
}

// Shown to approved sellers until their store is fully ready to sell -
// tells them exactly what's left instead of a generic "Become a seller" pitch.
export default function SetupChecklist({ seller }: Props) {
  const hasStore = !!seller.store;

  const { data: store, isLoading: isStoreLoading } = useMyStore(hasStore);
  const { data: productsData, isLoading: isProductsLoading } = useMyProducts(
    { limit: 1 },
    { enabled: hasStore }
  );

  if (hasStore && (isStoreLoading || isProductsLoading)) return null;

  const steps: Step[] = [
    {
      title: "Seller application approved",
      description: "You're approved to sell on Nestly.",
      done: true,
      href: "/marketplace/sell",
      cta: "",
    },
    {
      title: "Set up your store",
      description: "Add your store name, logo and location so buyers know who you are.",
      done: hasStore,
      href: "/marketplace/sell",
      cta: "Set up store",
    },
    {
      title: "Add your payout bank account",
      description: "So your earnings from each sale are paid straight to your bank.",
      done: !!store?.paystackSubaccountCode,
      href: "/settings/marketplace?tab=store",
      cta: "Add bank account",
    },
    {
      title: "Add shipping options",
      description: "Let buyers choose how their orders get delivered.",
      done: !!store?.shippingOptions?.length,
      href: "/settings/marketplace?tab=store",
      cta: "Add shipping",
    },
    {
      title: "List your first product",
      description: "Publish a product so buyers can start ordering.",
      done: (productsData?.total ?? 0) > 0,
      href: "/settings/marketplace/components/products/new",
      cta: "Add product",
    },
    {
      title: "Add your CAC number",
      description: "Registered business? Get a verified badge buyers trust.",
      done: !!seller.cacNumber,
      href: "/settings/marketplace?cac=1",
      cta: "Add CAC number",
      optional: true,
    },
  ];

  const required = steps.filter((step) => !step.optional);
  const completed = required.filter((step) => step.done).length;
  if (completed === required.length) return null;

  const nextStep = required.find((step) => !step.done);

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
            Finish setting up
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[24px] italic leading-tight text-ink sm:text-[28px]">
            {hasStore ? "A few steps before you can start selling" : "Next: set up your store"}
          </h2>
        </div>
        <p className="font-[family-name:var(--font-mono)] text-[12.5px] text-subtle">
          {completed} of {required.length} done
        </p>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-track">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all"
          style={{ width: `${(completed / required.length) * 100}%` }}
        />
      </div>

      <ol className="mt-6 space-y-2.5">
        {steps.map((step, index) => {
          const isNext = step === nextStep;

          return (
            <li
              key={step.title}
              className={`flex flex-col gap-3 rounded-xl p-3.5 sm:flex-row sm:items-center ${
                isNext ? "border border-violet-200 dark:border-violet-500/30 bg-violet-50/60" : ""
              }`}
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-mono)] text-[11px] font-semibold ${
                    step.done
                      ? "bg-emerald-500 text-white"
                      : isNext
                        ? "bg-violet-600 text-white"
                        : "bg-track text-subtle"
                  }`}
                >
                  {step.done ? <Check size={13} /> : index + 1}
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-[14px] font-semibold ${
                      step.done ? "text-subtle line-through" : "text-ink"
                    }`}
                  >
                    {step.title}
                    {step.optional && !step.done && (
                      <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 align-middle text-[10.5px] font-medium uppercase tracking-wide text-subtle">
                        Optional
                      </span>
                    )}
                  </p>
                  {!step.done && (
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Only the next step is actionable until the store exists - the
                  later ones depend on it. Once it does, any open step can be done. */}
              {!step.done && (isNext || hasStore) && (
                <Link
                  href={step.href}
                  className={`flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-[13px] font-semibold transition-all sm:ml-auto ${
                    isNext
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:brightness-110"
                      : "border border-line-strong text-ink-2 hover:border-violet-200 dark:hover:border-violet-500/30 hover:text-violet-700 dark:hover:text-violet-300"
                  }`}
                >
                  {step.cta}
                  <ArrowRight size={14} />
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
