"use client";

import Link from "next/link";
import { Store, ArrowRight, TrendingUp, Users, Package } from "lucide-react";

const stats = [
  { icon: Package, label: "List products in minutes" },
  { icon: Users, label: "Reach nearby buyers" },
  { icon: TrendingUp, label: "Track earnings live" },
];

export default function OnboardingBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-800 p-8 text-white sm:p-10">
      {/* Ambient orb, same technique as the dashboard hero */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
          <Store size={14} />
          <span className="font-[family-name:var(--font-mono)] text-[11.5px] font-medium uppercase tracking-wide">
            Sell on Nestly
          </span>
        </div>

        <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-[32px] italic leading-[1.1] sm:text-[40px]">
          Turn your following into customers
        </h2>

        <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-violet-100">
          Open your own marketplace store, upload products, receive orders, and grow
          a real business without leaving Nestly.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 text-[12.5px] text-violet-100">
              <stat.icon size={14} />
              {stat.label}
            </div>
          ))}
        </div>

        <Link
          href="/settings/marketplace/onboarding"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-[14px] font-semibold text-violet-700 transition-colors hover:bg-violet-50"
        >
          Become a seller
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}