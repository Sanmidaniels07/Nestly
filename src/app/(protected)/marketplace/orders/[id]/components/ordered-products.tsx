"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquarePlus, RotateCcw } from "lucide-react";
import { Order, OrderItem } from "@/src/types/order";
import WriteReviewForm from "./write-review-form";
import RequestReturnForm from "./request-return-form";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

interface Props {
  order: Order;
}

export default function OrderedProducts({ order }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Ordered products
      </h2>

      <div className="mt-6 space-y-4">
        {order.items.map((item) => (
          <OrderedProductItem key={item.id} item={item} orderStatus={order.status} />
        ))}
      </div>
    </section>
  );
}

function OrderedProductItem({
  item,
  orderStatus,
}: {
  item: OrderItem;
  orderStatus: string;
}) {
  const [reviewing, setReviewing] = useState(false);
  const [returning, setReturning] = useState(false);

  const primaryImage =
    item.product.images.find((image) => image.isPrimary)?.url ?? item.product.images[0]?.url;

  const isDelivered = (item.status ?? orderStatus).toLowerCase() === "delivered";

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-[#ECE9F6] p-5 transition-colors hover:border-violet-200 sm:flex-row">
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#F8F8FC] sm:w-28">
        {primaryImage && (
          <Image fill src={primaryImage} alt={item.product.title} className="object-cover" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            {item.product.brand && (
              <p className="text-[12px] font-medium text-violet-600">{item.product.brand}</p>
            )}
            <h3 className="mt-0.5 truncate text-[15px] font-semibold text-[#13131A]">
              {item.product.title}
            </h3>
            {item.product.store && (
              <p className="mt-1.5 text-[12.5px] text-[#64748B]">
                Sold by{" "}
                <span className="font-medium text-[#334155]">{item.product.store.name}</span>
              </p>
            )}

            <div className="mt-3 flex gap-6">
              <div>
                <p className="text-[11px] text-[#94A3B8]">Quantity</p>
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[#13131A]">
                  {item.quantity}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">Unit price</p>
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[#13131A]">
                  {money(item.price)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#94A3B8]">Total</p>
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700">
                  {money(item.price * item.quantity)}
                </p>
              </div>
            </div>

            {item.status && (
              <p className="mt-2 text-[11.5px] font-medium text-[#94A3B8]">
                Item status: <span className="capitalize text-[#334155]">{item.status.toLowerCase()}</span>
              </p>
            )}
          </div>

          <div className="flex shrink-0 gap-2.5 sm:flex-col">
            <Link
              href={`/marketplace/product/${item.productId}`}
              className="flex h-10 items-center justify-center rounded-xl border border-[#ECE9F6] px-4 text-[12.5px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC]"
            >
              View product
            </Link>

            {isDelivered && !reviewing && (
              <button
                onClick={() => setReviewing(true)}
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-violet-50 px-4 text-[12.5px] font-semibold text-violet-700 transition-colors hover:bg-violet-100"
              >
                <MessageSquarePlus size={14} />
                Write a review
              </button>
            )}

            {isDelivered && !returning && (
              <button
                onClick={() => setReturning(true)}
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-amber-200 px-4 text-[12.5px] font-semibold text-amber-700 transition-colors hover:bg-amber-50"
              >
                <RotateCcw size={14} />
                Request return
              </button>
            )}
          </div>
        </div>

        {reviewing && (
          <WriteReviewForm productId={item.productId} onDone={() => setReviewing(false)} />
        )}

        {returning && (
          <RequestReturnForm orderItemId={item.id} onDone={() => setReturning(false)} />
        )}
      </div>
    </article>
  );
}
