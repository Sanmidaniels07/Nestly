"use client";

import Link from "next/link";
import { Download, Plus } from "lucide-react";

import { useExportProductsCsv } from "@/src/hooks/use-export-products-csv";

export default function ProductsHeader() {
  const { mutate: exportCsv, isPending: isExporting } = useExportProductsCsv();

  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Catalog
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[34px] italic text-ink sm:text-[40px]">
          Products
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <button
          onClick={() => exportCsv()}
          disabled={isExporting}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line-strong px-4 text-[13.5px] font-medium text-ink-2 transition-colors hover:border-violet-200 dark:hover:border-violet-500/30 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-50"
        >
          <Download size={15} />
          {isExporting ? "Exporting..." : "Export CSV"}
        </button>

        <Link
          href="/settings/marketplace/components/products/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
        >
          <Plus size={16} />
          Add product
        </Link>
      </div>
    </section>
  );
}
