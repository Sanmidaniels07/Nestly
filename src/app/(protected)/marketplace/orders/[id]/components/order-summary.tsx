"use client";

import { Order } from "@/src/types/order";

interface Props {
  order: Order;
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrderSummary({ order }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Order summary
      </h2>

      <div className="mt-5 space-y-3">
        {order.subtotal !== undefined && (
          <SummaryRow label="Subtotal" value={money(order.subtotal)} />
        )}

        {order.shipping && order.shipping.length > 0 ? (
          order.shipping.map((shipment) => (
            <SummaryRow
              key={shipment.id}
              label={shipment.type === "PICKUP" ? "Pickup" : shipment.optionName}
              value={shipment.fee === 0 ? "Free" : money(shipment.fee)}
            />
          ))
        ) : (
          order.deliveryFee !== undefined && (
            <SummaryRow
              label="Delivery"
              value={order.deliveryFee === 0 ? "Free" : money(order.deliveryFee)}
            />
          )
        )}

        {order.tax !== undefined && order.tax > 0 && (
          <SummaryRow label="Tax" value={money(order.tax)} />
        )}

        {!!order.discountAmount && order.discountAmount > 0 && (
          <SummaryRow
            label={order.couponCode ? `Coupon (${order.couponCode})` : "Discount"}
            value={`-${money(order.discountAmount)}`}
          />
        )}

        <div className="flex items-center justify-between border-t border-dashed border-line pt-3">
          <span className="text-[14px] font-semibold text-ink">Total</span>
          <span className="font-[family-name:var(--font-mono)] text-[17px] font-semibold text-violet-700 dark:text-violet-300">
            {money(order.total)}
          </span>
        </div>
      </div>

      {order.trackingNumber && (
        <div className="mt-4 rounded-xl bg-surface-2 px-4 py-3">
          <p className="text-[12px] text-subtle">Tracking number</p>
          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13.5px] font-semibold text-ink">
            {order.trackingNumber}
          </p>
        </div>
      )}
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="font-[family-name:var(--font-mono)] text-[13.5px] font-semibold text-ink-2">
        {value}
      </span>
    </div>
  );
}
