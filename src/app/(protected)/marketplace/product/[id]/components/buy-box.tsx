"use client";

import { useState } from "react";
import { Heart, Share2, ShieldCheck, Check } from "lucide-react";

import { MarketplaceProduct } from "@/src/mocks/marketplace";
import QuantitySelector from "./buy-box-components/quantity-selector";
import DeliveryEstimate from "./buy-box-components/delivery-estimate";
import PaymentMethods from "./buy-box-components/payment-methods";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/src/store/cart-store";

interface Props {
  product: MarketplaceProduct;
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BuyBox({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);

  const router = useRouter();

  const addToCart = useCartStore((state) => state.addToCart);

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (outOfStock) return;

    addToCart(product, quantity);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;

    addToCart(product, quantity);

    router.push("/marketplace/checkout");
  };

  return (
    <aside className="sticky top-24 max-h-[calc(100vh-6rem)] space-y-5 overflow-y-auto rounded-2xl border border-[#ECE9F6] bg-white p-6 shadow-[0_20px_60px_-24px_rgba(124,58,237,0.15)]">
      <div>
        <div className="flex flex-wrap items-end gap-2">
          <p className="font-[family-name:var(--font-mono)] text-[28px] font-bold text-violet-700">
            {money(product.price)}
          </p>
          {product.originalPrice && (
            <p className="font-[family-name:var(--font-mono)] text-[14px] text-[#94A3B8] line-through">
              {money(product.originalPrice)}
            </p>
          )}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              outOfStock
                ? "bg-red-500"
                : lowStock
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
          />
          <span
            className={`text-[13px] font-medium ${
              outOfStock
                ? "text-red-600"
                : lowStock
                  ? "text-amber-600"
                  : "text-emerald-600"
            }`}
          >
            {outOfStock
              ? "Out of stock"
              : lowStock
                ? `Only ${product.stock} left`
                : "In stock"}
          </span>
        </div>
      </div>

      {!outOfStock && (
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          stock={product.stock}
        />
      )}

      <DeliveryEstimate product={product} />

      <div className="space-y-2.5">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock || added}
          className={`
            flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-semibold text-white
            transition-all disabled:cursor-not-allowed disabled:opacity-40
            ${
              added
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110"
            }
          `}
        >
          {added ? (
            <>
              <Check size={16} />
              Added to cart
            </>
          ) : (
            "Add to cart"
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="w-full rounded-xl border border-violet-600 py-3.5 text-[14px] font-semibold text-violet-700 transition-colors hover:bg-violet-50 disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:text-[#94A3B8] disabled:hover:bg-transparent"
        >
          Buy now
        </button>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={() => setSaved(!saved)}
          className={`flex flex-1 items-center justify-center rounded-xl border py-2.5 transition-colors ${
            saved
              ? "border-red-200 bg-red-50"
              : "border-[#ECE9F6] hover:bg-[#F8F7FC]"
          }`}
          aria-label={saved ? "Remove from saved" : "Save item"}
        >
          <Heart
            size={17}
            className={saved ? "fill-red-500 text-red-500" : "text-[#64748B]"}
          />
        </button>

        <button
          className="flex flex-1 items-center justify-center rounded-xl border border-[#ECE9F6] py-2.5 transition-colors hover:bg-[#F8F7FC]"
          aria-label="Share product"
        >
          <Share2 size={17} className="text-[#64748B]" />
        </button>
      </div>

      <PaymentMethods />

      <div className="rounded-2xl bg-[#F7F8FD] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50">
            <ShieldCheck size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#13131A]">
              Buyer protection
            </p>
            <p className="text-[11.5px] text-[#64748B]">
              Secure payment and refund support.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
