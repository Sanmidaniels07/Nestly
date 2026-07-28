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
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
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
              label={shipment.optionName}
              value={money(shipment.fee)}
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

        <div className="flex items-center justify-between border-t border-dashed border-[#ECE9F6] pt-3">
          <span className="text-[14px] font-semibold text-[#13131A]">Total</span>
          <span className="font-[family-name:var(--font-mono)] text-[17px] font-semibold text-violet-700">
            {money(order.total)}
          </span>
        </div>
      </div>

      {order.trackingNumber && (
        <div className="mt-4 rounded-xl bg-[#F7F7FB] px-4 py-3">
          <p className="text-[12px] text-[#94A3B8]">Tracking number</p>
          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13.5px] font-semibold text-[#13131A]">
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
      <span className="text-[13px] text-[#64748B]">{label}</span>
      <span className="font-[family-name:var(--font-mono)] text-[13.5px] font-semibold text-[#334155]">
        {value}
      </span>
    </div>
  );
}
