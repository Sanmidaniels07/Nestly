"use client";

import { Minus, Plus } from "lucide-react";

interface Props {
  quantity: number;
  stock: number;
  setQuantity: (value: number) => void;
}

export default function QuantitySelector({ quantity, stock, setQuantity }: Props) {
  const atMin = quantity <= 1;
  const atMax = quantity >= stock;

  return (
    <div>
      <p className="mb-2.5 text-[13px] font-semibold text-[#13131A]">Quantity</p>

      <div className="flex items-center justify-between rounded-xl border border-[#ECE9F6] px-4 py-2.5">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={atMin}
          aria-label="Decrease quantity"
          className="text-[#64748B] transition-colors hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#64748B]"
        >
          <Minus size={17} />
        </button>

        <span className="font-[family-name:var(--font-mono)] text-[15px] font-semibold text-[#13131A]">
          {quantity}
        </span>

        <button
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
          disabled={atMax}
          aria-label="Increase quantity"
          className="text-[#64748B] transition-colors hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#64748B]"
        >
          <Plus size={17} />
        </button>
      </div>

      {atMax && (
        <p className="mt-1.5 text-[11.5px] text-amber-600">Max available stock reached</p>
      )}
    </div>
  );
}