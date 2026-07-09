"use client";

import Link from "next/link";
import { ArrowRight, PackageOpen } from "lucide-react";
import InventoryProductRow from "./inventory-product-row";
import { sellerProducts } from "@/src/mocks/seller-products";

export default function InventorySnapshot() {
  const products = sellerProducts.slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
            Inventory
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
            Inventory snapshot
          </h2>
        </div>

        <Link
          href="/settings/marketplace/products"
          className="group flex shrink-0 items-center gap-1 text-[13.5px] font-semibold text-violet-600 hover:underline"
        >
          View all
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PackageOpen size={28} className="text-[#C4C0DC]" strokeWidth={1.5} />
            <p className="mt-3 text-[13.5px] font-medium text-[#13131A]">No products yet</p>
            <p className="mt-1 text-[12.5px] text-[#94A3B8]">
              Products you add will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-[#FBFAFE]">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                    Product
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                    Price
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                    Stock
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-[#94A3B8]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
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