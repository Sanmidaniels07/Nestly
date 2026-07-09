"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketplaceOrder } from "@/src/mocks/order";

interface Props {
  order: MarketplaceOrder;
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrderedProducts({ order }: Props) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Ordered products
      </h2>

      <div className="mt-6 space-y-4">
        {order.items.map((item, index) => (
          <article
            key={index}
            className="flex flex-col gap-5 rounded-2xl border border-[#ECE9F6] p-5 transition-colors hover:border-violet-200 sm:flex-row"
          >
            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#F8F8FC] sm:w-28">
              <Image
                fill
                src={item.product.images[0]}
                alt={item.product.name}
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-violet-600">
                  {item.product.brand}
                </p>
                <h3 className="mt-0.5 truncate text-[15px] font-semibold text-[#13131A]">
                  {item.product.name}
                </h3>
                <p className="mt-1.5 text-[12.5px] text-[#64748B]">
                  Sold by{" "}
                  <span className="font-medium text-[#334155]">
                    {item.product.seller.name}
                  </span>
                </p>

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
                      {money(item.product.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#94A3B8]">Total</p>
                    <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700">
                      {money(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 gap-2.5 sm:flex-col">
                <Link
                  href={`/marketplace/product/${item.product.id}`}
                  className="flex h-10 flex-1 items-center justify-center rounded-xl border border-[#ECE9F6] px-4 text-[12.5px] font-semibold text-[#334155] transition-colors hover:bg-[#F8F7FC] sm:flex-none"
                >
                  View product
                </Link>

                <button
                  onClick={() =>
                    router.push(`/marketplace/product/${item.product.id}`)
                  }
                  className="flex h-10 flex-1 items-center justify-center rounded-xl bg-violet-600 px-4 text-[12.5px] font-semibold text-white transition-all hover:brightness-110 sm:flex-none"
                >
                  Buy again
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
