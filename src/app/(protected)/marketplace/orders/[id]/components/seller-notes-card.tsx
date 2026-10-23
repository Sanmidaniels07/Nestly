import { MessageSquareText } from "lucide-react";

import { Order } from "@/src/types/order";

// The notes the buyer left for each seller at checkout.
export default function SellerNotesCard({ order }: { order: Order }) {
  const notes = order.sellerNotes?.filter((entry) => entry.note) ?? [];
  if (notes.length === 0) return null;

  const storeName = (storeId?: string) =>
    order.items.find((item) => item.product?.store?.id === storeId)?.product?.store?.name ?? "the seller";

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <MessageSquareText size={16} className="text-violet-600 dark:text-violet-400" />
        </div>
        <h2 className="text-[15px] font-semibold text-ink">{notes.length > 1 ? "Your notes to the sellers" : "Your note to the seller"}</h2>
      </div>

      <div className="space-y-3">
        {notes.map((entry) => (
          <div key={entry.storeId ?? entry.note} className="rounded-xl border-l-[3px] border-violet-500 bg-violet-50 px-4 py-3 dark:bg-violet-500/10">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
              To {storeName(entry.storeId)}
            </p>
            <p className="mt-1 whitespace-pre-line text-[13.5px] leading-relaxed text-ink [overflow-wrap:anywhere]">{entry.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
