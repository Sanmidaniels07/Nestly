"use client";

import Link from "next/link";
import { ArrowRight, BellRing, Check, MapPinned, Wallet } from "lucide-react";

import { useMySeller } from "@/src/hooks/use-my-seller";

const PERKS = [
  { icon: Wallet, title: "Paid to your bank", body: "Your share of every sale goes straight to your account." },
  { icon: MapPinned, title: "Your delivery prices", body: "Set zones by area, or offer free pickup." },
  { icon: BellRing, title: "Instant order alerts", body: "Every paid order, by email and in the app." },
];

export default function SellCta() {
  const { data: seller, isLoading } = useMySeller();
  if (isLoading) return null;

  const hasStore = !!seller?.store;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#100D1F] px-6 py-10 text-white sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(167,139,250,.6)_1.2px,transparent_1.2px)] [background-size:24px_24px] [mask-image:linear-gradient(90deg,transparent,#000)]" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.28em] text-violet-300">
            {hasStore ? "Your store" : "Sell on Nestly"}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-[32px] leading-tight sm:text-[40px]">
            {hasStore ? (
              <>Keep your store <em className="text-violet-300">growing.</em></>
            ) : (
              <>Turn your followers into <em className="text-violet-300">customers.</em></>
            )}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#C9C5DC]">
            {hasStore
              ? "Add new products, check your orders and see how your store is doing."
              : "Open a store in minutes. Buyers pay through Paystack and every order arrives paid, verified and with the delivery address."}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={hasStore ? "/settings/marketplace" : "/marketplace/sell"}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_16px_36px_-14px_rgba(124,58,237,0.8)] transition hover:brightness-110"
            >
              {hasStore ? "Go to your seller dashboard" : "Start selling"}
              <ArrowRight size={16} />
            </Link>
            {!hasStore && (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-[#A9A4C2]">
                <Check size={15} className="text-emerald-400" /> Free to join
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {PERKS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200">
                <Icon size={19} />
              </span>
              <p className="mt-4 text-[14.5px] font-semibold">{title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[#A9A4C2]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
