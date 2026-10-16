"use client";

import Link from "next/link";
import { ArrowRight, PackageOpen } from "lucide-react";
import InventoryProductRow from "./inventory-product-row";
import { useSellerInventory } from "@/src/hooks/use-seller-inventory";

export default function InventorySnapshot() {
  const { data: products, isLoading } = useSellerInventory(5);
  const items = (products ?? []).slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
            Inventory
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">
            Inventory snapshot
          </h2>
        </div>

        <Link
          href="/settings/marketplace?tab=products"
          className="group flex shrink-0 items-center gap-1 text-[13.5px] font-semibold text-violet-600 dark:text-violet-400 hover:underline"
        >
          View all
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {isLoading ? (
          <div className="h-40 animate-pulse bg-surface-2" />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PackageOpen size={28} className="text-faint" strokeWidth={1.5} />
            <p className="mt-3 text-[13.5px] font-medium text-ink">No low-stock products</p>
            <p className="mt-1 text-[12.5px] text-subtle">
              Products running low on stock will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-surface-sunken">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-subtle">
                    Product
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-subtle">
                    Price
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-subtle">
                    Stock
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-subtle">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-subtle">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((product) => (
                  <InventoryProductRow key={product.id} product={product} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
