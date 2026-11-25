"use client";

import { useMySeller } from "@/src/hooks/use-my-seller";

// Short, so the five sections sit near the top of the screen.
export default function SellerDashboardHeader() {
  const { data: seller } = useMySeller();
  return (
    <section>
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
        Seller Hub
      </p>
      <h1 className="mt-1 truncate font-[family-name:var(--font-fraunces)] text-[28px] leading-tight text-ink sm:text-[36px]">
        {seller?.store?.name ?? "Your shop"}
      </h1>
    </section>
  );
}
