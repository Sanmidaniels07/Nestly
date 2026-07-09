"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Loader2, ShoppingBag } from "lucide-react";

interface Props {
  orderNumber: string;
}

export default function NextActions({ orderNumber }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadReceipt = async () => {
    setDownloading(true);
    try {
      // TODO: replace with real receipt generation/download endpoint
      await new Promise((resolve) => setTimeout(resolve, 900));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <Link
        href="/marketplace/orders"
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
      >
        View orders
      </Link>

      <Link
        href="/marketplace"
        className="flex items-center justify-center gap-2 rounded-xl border border-[#ECE9F6] py-3.5 text-[13.5px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC]"
      >
        <ShoppingBag size={16} />
        Continue shopping
      </Link>

      <button
        onClick={handleDownloadReceipt}
        disabled={downloading}
        className="flex items-center justify-center gap-2 rounded-xl border border-[#ECE9F6] py-3.5 text-[13.5px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {downloading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Preparing...
          </>
        ) : (
          <>
            <Download size={16} />
            Download receipt
          </>
        )}
      </button>
    </section>
  );
}