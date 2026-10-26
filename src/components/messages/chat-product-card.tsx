import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

import { ChatProduct } from "@/src/types/conversation";
import { naira } from "@/src/lib/chat";

// A product shared in a chat (and its preview in the composer).
export default function ChatProductCard({
  product,
  mine = false,
  onRemove,
}: {
  product: ChatProduct;
  mine?: boolean;
  /** Composer preview: show a remove button instead of linking. */
  onRemove?: () => void;
}) {
  const image = product.images[0]?.url;
  const soldOut = product.status === "OUT_OF_STOCK";

  const body = (
    <>
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-subtle">
            <ShoppingBag size={18} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`line-clamp-2 text-[13px] font-semibold leading-snug ${mine && !onRemove ? "text-white" : "text-ink"}`}>{product.title}</p>
        <p className={`mt-0.5 text-[12.5px] font-semibold ${mine && !onRemove ? "text-white/90" : "text-violet-700 dark:text-violet-300"}`}>
          {naira(product.price)}
          {soldOut && <span className={`ml-1.5 font-medium ${mine && !onRemove ? "text-white/70" : "text-red-600"}`}>· Sold out</span>}
        </p>
        <p className={`truncate text-[11.5px] ${mine && !onRemove ? "text-white/70" : "text-subtle"}`}>{product.store.name}</p>
      </div>
    </>
  );

  if (onRemove) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5">
        {body}
        <button type="button" onClick={onRemove} aria-label="Remove product" className="rounded-full p-1.5 text-subtle hover:bg-surface-sunken hover:text-ink">
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <Link
      href={`/marketplace/product/${product.id}`}
      className={`flex w-64 max-w-full items-center gap-3 rounded-2xl p-2.5 transition-colors ${
        mine ? "bg-white/15 hover:bg-white/20" : "border border-line bg-surface hover:border-violet-300 dark:hover:border-violet-500/40"
      }`}
    >
      {body}
    </Link>
  );
}
