"use client";

import { useState } from "react";
import { Heart, Share2, ShieldCheck, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Product } from "@/src/types/product";
import { useToggleWishlist } from "@/src/hooks/use-toggle-wishlist";
import { useAddToCart } from "@/src/hooks/use-add-to-cart";
import QuantitySelector from "./buy-box-components/quantity-selector";
import DeliveryEstimate from "./buy-box-components/delivery-estimate";
import PaymentMethods from "./buy-box-components/payment-methods";
import OptionPicker from "./buy-box-components/option-picker";
import { useRequireLogin } from "@/src/hooks/use-session";

interface Props {
  product: Product;
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

  const router = useRouter();

  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const requireLogin = useRequireLogin();
  const { isSaved: saved, toggle: toggleSaved } = useToggleWishlist(product.id);

  // Products with options (e.g. Size, Colour) are bought as one combination.
  const options = product.options ?? [];
  const variations = product.variations ?? [];
  const hasOptions = options.length > 0 && variations.length > 0;
  const [picked, setPicked] = useState<string[]>(() =>
    options.map((option) => (option.values.length === 1 ? option.values[0] : ""))
  );
  const match = hasOptions
    ? variations.find(
        (variation) =>
          variation.option1 === picked[0] && (options.length < 2 || variation.option2 === picked[1])
      )
    : undefined;
  const choiceMade = !hasOptions || (!!match && match.isActive);
  const missing = hasOptions ? options.find((option, i) => !picked[i]) : undefined;

  const prices = variations.filter((v) => v.isActive).map((v) => v.price ?? product.price);
  const lowest = prices.length > 0 ? Math.min(...prices) : product.price;
  const price = match ? match.price ?? product.price : product.price;
  const showFrom = hasOptions && !match && prices.some((p) => p !== lowest);

  const stock = match ? (match.isActive ? match.stock : 0) : product.stock;
  // The seller has no delivery zone or pickup point yet - can't be bought.
  const noDelivery = product.store?.canDeliver === false;
  const outOfStock = stock === 0 || noDelivery;
  const lowStock = stock > 0 && stock <= 5;

  const pick = (position: number, value: string) => {
    setPicked((current) => current.map((v, i) => (i === position ? (v === value ? "" : value) : v)));
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (outOfStock || !choiceMade) return;
    if (!requireLogin("Log in or create a free account to buy from Nestly sellers.")) return;

    addToCart(
      { productId: product.id, quantity, variationId: match?.id },
      {
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        },
      }
    );
  };

  const handleBuyNow = () => {
    if (outOfStock || !choiceMade) return;
    if (!requireLogin("Log in or create a free account to buy from Nestly sellers.")) return;

    addToCart(
      { productId: product.id, quantity, variationId: match?.id },
      { onSuccess: () => router.push("/marketplace/checkout") }
    );
  };

  return (
    <aside className="sticky top-24 max-h-[calc(100vh-6rem)] space-y-5 overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-[0_20px_60px_-24px_rgba(124,58,237,0.15)]">
      <div>
        <div className="flex flex-wrap items-end gap-2">
          <p className="font-[family-name:var(--font-mono)] text-[28px] font-bold text-violet-700 dark:text-violet-300">
            {showFrom && <span className="mr-1.5 text-[14px] font-medium text-muted">From</span>}
            {money(showFrom ? lowest : price)}
          </p>
          {product.originalPrice && price === product.price && !showFrom && (
            <p className="font-[family-name:var(--font-mono)] text-[14px] text-subtle line-through">
              {money(product.originalPrice)}
            </p>
          )}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              outOfStock ? "bg-red-500" : lowStock ? "bg-amber-500" : "bg-emerald-500"
            }`}
          />
          <span
            className={`text-[13px] font-medium ${
              outOfStock ? "text-red-600 dark:text-red-400" : lowStock ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {noDelivery
              ? "Not available yet"
              : outOfStock
              ? match
                ? "This option is sold out"
                : "Out of stock"
              : lowStock
                ? `Only ${stock} left`
                : "In stock"}
          </span>
        </div>
      </div>

      {noDelivery && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          This seller hasn&apos;t set up delivery or pickup yet, so it can&apos;t be ordered right now. Check back soon or message the seller.
        </p>
      )}

      {hasOptions && <OptionPicker options={options} variations={variations} picked={picked} onPick={pick} />}

      {!outOfStock && choiceMade && (
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} stock={stock} />
      )}

      <DeliveryEstimate product={product} />

      <div className="space-y-2.5">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock || !choiceMade || added || isAdding}
          className={`
            flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-semibold text-white
            transition-all disabled:cursor-not-allowed disabled:opacity-40
            ${added ? "bg-emerald-500" : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110"}
          `}
        >
          {added ? (
            <>
              <Check size={16} />
              Added to cart
            </>
          ) : missing ? (
            `Choose ${/^[aeiou]/i.test(missing.name) ? "an" : "a"} ${missing.name.toLowerCase()}`
          ) : (
            "Add to cart"
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={outOfStock || !choiceMade || isAdding}
          className="w-full rounded-xl border border-violet-600 py-3.5 text-[14px] font-semibold text-violet-700 dark:text-violet-300 transition-colors hover:bg-violet-50 dark:hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:border-line-strong disabled:text-subtle disabled:hover:bg-transparent"
        >
          Buy now
        </button>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={toggleSaved}
          className={`flex flex-1 items-center justify-center rounded-xl border py-2.5 transition-colors ${
            saved ? "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10" : "border-line hover:bg-surface-sunken"
          }`}
          aria-label={saved ? "Remove from saved" : "Save item"}
        >
          <Heart size={17} className={saved ? "fill-red-500 text-red-500" : "text-muted"} />
        </button>

        <button
          className="flex flex-1 items-center justify-center rounded-xl border border-line py-2.5 transition-colors hover:bg-surface-sunken"
          aria-label="Share product"
        >
          <Share2 size={17} className="text-muted" />
        </button>
      </div>

      <PaymentMethods />

      <div className="rounded-2xl bg-surface-2 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
            <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-ink">Buyer protection</p>
            <p className="text-[11.5px] text-muted">
              Secure payment and refund support.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
