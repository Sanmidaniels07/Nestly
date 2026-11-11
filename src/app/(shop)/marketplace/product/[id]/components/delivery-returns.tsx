"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, RotateCcw, Store as StoreIcon, Truck } from "lucide-react";
import { PERISHABLE_REPORT_HOURS, RETURN_WINDOW_DAYS } from "@/src/lib/legal";
import { ProductDelivery, regionLabel } from "@/src/lib/product-delivery";

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

const feeText = (min: number, max: number) => (min === max ? naira(min) : `${naira(min)} – ${naira(max)}`);

const AREAS_SHOWN = 14;

/**
 * Where the seller delivers, what it costs, and how returns work - written
 * out on the page so buyers (and search engines) see it before checkout.
 */
export default function DeliveryReturns({ delivery }: { delivery: ProductDelivery }) {
  const [showAll, setShowAll] = useState(false);
  const { regions, flatRate, pickup } = delivery;
  const nothing = !regions.length && !flatRate && !pickup;

  return (
    <section className="mt-8 rounded-2xl border border-line bg-surface p-6" aria-labelledby="delivery-returns">
      <h2 id="delivery-returns" className="font-[family-name:var(--font-fraunces)] text-[22px] text-ink">
        Delivery &amp; returns
      </h2>

      <div className="mt-5 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 text-[14px] font-semibold text-ink">
            <Truck size={16} className="text-violet-600 dark:text-violet-400" /> Delivery
          </h3>

          {nothing && <p className="mt-2 text-[14px] text-muted">This seller hasn&apos;t set up delivery yet.</p>}

          {regions.map((region) => {
            const areas = showAll ? region.areas : region.areas.slice(0, AREAS_SHOWN);
            const hidden = region.areas.length - areas.length;
            return (
              <div key={region.state ?? "any"} className="mt-3">
                <p className="text-[14px] text-ink-3">
                  Delivers to <span className="font-medium text-ink">{region.areas.length} {region.areas.length === 1 ? "area" : "areas"} in {regionLabel(region.state)}</span>{" "}
                  for {feeText(region.minFee, region.maxFee)}
                  {region.eta ? ` · usually ${region.eta}` : ""}.
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  <MapPin size={13} className="mr-1 inline -translate-y-px" />
                  {areas.join(", ")}
                  {hidden > 0 && (
                    <>
                      {" "}
                      <button onClick={() => setShowAll(true)} className="font-semibold text-violet-600 hover:underline dark:text-violet-400">
                        +{hidden} more
                      </button>
                    </>
                  )}
                </p>
              </div>
            );
          })}

          {flatRate && (
            <p className="mt-3 text-[14px] text-ink-3">
              Delivers {regions.length ? "elsewhere" : "anywhere"} for <span className="font-medium text-ink">{naira(flatRate.fee)}</span>
              {flatRate.eta ? ` · usually ${flatRate.eta}` : ""}.
            </p>
          )}

          {pickup && (
            <p className="mt-3 flex items-center gap-2 text-[14px] text-ink-3">
              <StoreIcon size={14} className="text-muted" /> Free pickup{pickup.city ? ` in ${pickup.city}` : ""}.
            </p>
          )}

          {!nothing && <p className="mt-3 text-[13px] text-muted">Pick your area at checkout to see the exact fee.</p>}
          {delivery.shippingPolicy && <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-ink-3">{delivery.shippingPolicy}</p>}
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-[14px] font-semibold text-ink">
            <RotateCcw size={16} className="text-violet-600 dark:text-violet-400" />{" "}
            {delivery.perishable ? `Report a problem within ${PERISHABLE_REPORT_HOURS} hours` : `${RETURN_WINDOW_DAYS}-day returns`}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-3">
            {delivery.perishable
              ? `If it arrives damaged, spoiled, wrong or not as described, report it within ${PERISHABLE_REPORT_HOURS} hours of delivery with a photo - you don't send it back, and you're refunded or sent a replacement.`
              : `If it arrives damaged, faulty, wrong or significantly not as described, report it within ${RETURN_WINDOW_DAYS} days of delivery for a refund.`}{" "}
            No change-of-mind returns. Nestly&apos;s policy covers every store.
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-3">
            Pay securely with Paystack checkout, then confirm delivery with your delivery code when the item arrives.
          </p>
          <Link href="/guides/buyers" className="mt-3 inline-block text-[13px] font-semibold text-violet-600 hover:underline dark:text-violet-400">
            How returns and refunds work
          </Link>
        </div>
      </div>
    </section>
  );
}
