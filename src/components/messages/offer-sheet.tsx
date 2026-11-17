"use client";

import { useState } from "react";
import { HandCoins, Loader2, ShieldCheck, X } from "lucide-react";
import { AxiosError } from "axios";

import { useCreateOffer } from "@/src/hooks/use-offers";
import { useStoreProducts } from "@/src/hooks/use-store-products";
import { naira } from "@/src/lib/payment-link";
import { ApiErrorResponse } from "@/src/types/api";
import { ChatProduct } from "@/src/types/conversation";

const SOMETHING_ELSE = "__other__";
const parseAmount = (value: string) => (value.trim() ? Number(value.replace(/[,\s₦]/g, "")) : NaN);

// The buyer's "Make an offer" in a chat with a seller: one of the store's
// listings (or the product the chat is about), or something described.
export default function OfferSheet({
  conversationId,
  storeSlug,
  storeName,
  initialProduct,
  onClose,
}: {
  conversationId: string;
  storeSlug: string;
  storeName: string;
  initialProduct: ChatProduct | null;
  onClose: () => void;
}) {
  const { data: productsData } = useStoreProducts(storeSlug, { limit: 50 });
  const { mutate: createOffer, isPending } = useCreateOffer();
  const products = productsData?.products ?? [];

  const [productId, setProductId] = useState(initialProduct?.id ?? "");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const picked = products.find((p) => p.id === productId) ?? (initialProduct && initialProduct.id === productId ? initialProduct : null);
  const describing = productId === SOMETHING_ELSE || (!productId && products.length === 0);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const amount = parseAmount(price);
    const count = Number(quantity);
    if (!describing && !picked) return setError("Choose what you'd like to buy.");
    if (describing && title.trim().length < 2) return setError("Say what you'd like to buy.");
    if (!(amount > 0)) return setError("Enter your price, e.g. 15000.");
    if (!Number.isInteger(count) || count < 1) return setError("Enter how many, e.g. 1.");
    setError("");
    createOffer(
      {
        conversationId,
        ...(describing ? { title: title.trim() } : { productId: picked!.id }),
        price: amount,
        quantity: count,
        note: note.trim() || undefined,
      },
      {
        onSuccess: onClose,
        onError: (err) => setError((err as AxiosError<ApiErrorResponse>).response?.data?.message ?? "Couldn't send the offer."),
      }
    );
  };

  const field =
    "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[16px] text-ink outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]";
  const label = "mb-1.5 block text-[12.5px] font-semibold text-ink-2";

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-md sm:rounded-3xl sm:p-6"
        role="dialog"
        aria-label="Make an offer"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-[family-name:var(--font-fraunces)] text-[21px] text-ink">
              <HandCoins size={20} className="text-violet-600 dark:text-violet-400" /> Make an offer
            </h2>
            <p className="mt-0.5 text-[12.5px] text-muted">To {storeName}. If they accept, you&apos;ll get a link to pay safely right here.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {products.length > 0 && (
            <label className="block">
              <span className={label}>What are you buying?</span>
              <select value={productId} onChange={(e) => setProductId(e.target.value)} className={field}>
                <option value="">Choose…</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title} - {naira(product.price)}
                  </option>
                ))}
                <option value={SOMETHING_ELSE}>Something else (describe it)</option>
              </select>
            </label>
          )}
          {describing && (
            <label className="block">
              <span className={label}>Describe it</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Red velvet cake, 8 inch" className={field} />
            </label>
          )}
          {picked && <p className="-mt-2 text-[12px] text-muted">Listed at {naira(picked.price)}.</p>}

          <div className="grid grid-cols-[1fr_96px] gap-3">
            <label className="block">
              <span className={label}>Your price per item (₦)</span>
              <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="e.g. 15000" className={field} />
            </label>
            <label className="block">
              <span className={label}>How many</span>
              <input value={quantity} onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))} inputMode="numeric" className={field} />
            </label>
          </div>

          <label className="block">
            <span className={label}>
              Note <span className="font-normal text-subtle">(optional)</span>
            </span>
            <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="e.g. Can you deliver by Friday?" className={field} />
          </label>

          {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="whitespace-nowrap flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[14px] font-semibold text-white hover:brightness-110 disabled:opacity-60"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />} Send offer
          </button>
          <p className="flex items-start gap-1.5 text-[11.5px] text-subtle">
            <ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            Offers last 48 hours. You only pay once the seller accepts - and Nestly holds your money until you receive it.
          </p>
        </div>
      </form>
    </div>
  );
}
