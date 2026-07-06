"use client";

import { ArrowUpRight, Tag } from "lucide-react";

const previewItems = [
  { emoji: "🎧", price: "$45" },
  { emoji: "📷", price: "$220" },
  { emoji: "🪴", price: "$18" },
];

export default function MarketplacePreview() {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 p-6 text-white">
      <div className="flex items-center gap-1.5 text-violet-200">
        <Tag size={14} />
        <span className="text-[12px] font-medium uppercase tracking-wide">
          Marketplace
        </span>
      </div>

      <h3 className="mt-2 text-[19px] font-semibold leading-snug">
        Buy and sell with people you trust
      </h3>

      <div className="mt-5 flex -space-x-3">
        {previewItems.map((item, i) => (
          <div
            key={i}
            className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-violet-600 bg-white/95 text-xl shadow-lg"
          >
            {item.emoji}
          </div>
        ))}
        <div className="flex h-14 items-center rounded-xl bg-white/10 px-3 font-[family-name:var(--font-mono)] text-[12px] text-violet-100 backdrop-blur">
          +240 more
        </div>
      </div>

      <button
        className="
          group mt-6 flex w-full items-center justify-center gap-1.5
          rounded-xl bg-white py-3 text-[14px] font-semibold text-violet-700
          transition-colors hover:bg-violet-50
        "
      >
        Explore marketplace
        <ArrowUpRight
          size={15}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </button>
    </div>
  );
}