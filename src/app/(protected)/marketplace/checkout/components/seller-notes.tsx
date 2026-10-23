"use client";

import { useMemo, useState } from "react";
import { MessageSquareText, Plus, X } from "lucide-react";

import { useCart } from "@/src/hooks/use-cart";
import { useCheckoutStore } from "@/src/store/checkout-store";

export const SELLER_NOTE_MAX = 500;

// Quick starters - tapping one adds it on a new line, ready to finish.
const STARTERS = ["Size: ", "Colour: ", "Gift message: ", "Delivery instructions: "];

// Optional note per seller in the cart (extras, sizes, a message for the
// cake). Each seller only ever sees their own note.
export default function SellerNotes() {
  const { data: items } = useCart();

  const stores = useMemo(() => {
    const map = new Map<string, string>();
    items?.forEach((item) => {
      if (!map.has(item.product.storeId)) map.set(item.product.storeId, item.product.store?.name ?? "the seller");
    });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [items]);

  if (stores.length === 0) return null;

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <MessageSquareText size={16} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-ink">
            {stores.length > 1 ? "Notes for the sellers" : "Note for the seller"}{" "}
            <span className="text-[12px] font-medium text-subtle">(optional)</span>
          </h2>
          <p className="text-[13px] text-muted">Sizes, colours, extras or a message to include. The seller gets it with your order.</p>
        </div>
      </div>

      <div className="space-y-3">
        {stores.map((store) => (
          <StoreNote key={store.id} storeId={store.id} storeName={store.name} />
        ))}
      </div>
    </section>
  );
}

function StoreNote({ storeId, storeName }: { storeId: string; storeName: string }) {
  const note = useCheckoutStore((state) => state.sellerNotes[storeId] ?? "");
  const setSellerNote = useCheckoutStore((state) => state.setSellerNote);
  const [open, setOpen] = useState(note.length > 0);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2.5 rounded-xl border border-dashed border-line-strong px-4 py-3 text-left text-[13.5px] font-medium text-violet-700 transition-colors hover:border-violet-300 hover:bg-violet-50/60 dark:text-violet-300 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/5"
      >
        <Plus size={16} className="shrink-0" />
        <span className="min-w-0 truncate">Add a note for {storeName}</span>
      </button>
    );
  }

  const fieldId = `seller-note-${storeId}`;
  const addStarter = (starter: string) => {
    const next = note && !note.endsWith("\n") ? `${note}\n${starter}` : `${note}${starter}`;
    setSellerNote(storeId, next.slice(0, SELLER_NOTE_MAX));
    requestAnimationFrame(() => {
      const field = document.getElementById(fieldId) as HTMLTextAreaElement | null;
      field?.focus();
      field?.setSelectionRange(field.value.length, field.value.length);
    });
  };

  return (
    <div className="rounded-xl border border-line bg-surface-sunken p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={fieldId} className="min-w-0 truncate text-[13.5px] font-semibold text-ink">
          Note for {storeName}
        </label>
        <button
          type="button"
          onClick={() => {
            setSellerNote(storeId, "");
            setOpen(false);
          }}
          aria-label={`Remove note for ${storeName}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <X size={15} />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {STARTERS.map((starter) => (
          <button
            key={starter}
            type="button"
            onClick={() => addStarter(starter)}
            className="whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:border-violet-500/40 dark:hover:text-violet-300"
          >
            + {starter.replace(": ", "")}
          </button>
        ))}
      </div>

      <textarea
        id={fieldId}
        value={note}
        autoFocus={note.length === 0}
        onChange={(e) => setSellerNote(storeId, e.target.value.slice(0, SELLER_NOTE_MAX))}
        rows={3}
        maxLength={SELLER_NOTE_MAX}
        placeholder={`e.g. Please write "Happy birthday Tolu" on the cake, or call when you're at the gate.`}
        className="mt-2.5 block w-full resize-y rounded-xl border border-line bg-surface px-3.5 py-3 text-[14px] leading-relaxed text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
      />

      <div className="mt-1.5 flex items-start justify-between gap-3 text-[11.5px] text-subtle">
        <p>Only {storeName} sees this. Never share card details or passwords.</p>
        <p
          className={`shrink-0 font-[family-name:var(--font-mono)] ${
            note.length >= SELLER_NOTE_MAX - 50 ? "text-amber-600 dark:text-amber-400" : ""
          }`}
        >
          {note.length}/{SELLER_NOTE_MAX}
        </p>
      </div>
    </div>
  );
}
