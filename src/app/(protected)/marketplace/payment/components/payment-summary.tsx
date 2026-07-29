"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";
import SummaryRow from "./summary-row";
import { useCart } from "@/src/hooks/use-cart";
import { useCheckoutStore } from "@/src/store/checkout-store";
import { useInitiateCheckout } from "@/src/hooks/use-initiate-checkout";
import { useVerifyCheckout } from "@/src/hooks/use-verify-checkout";
import { useSavedCards } from "@/src/hooks/use-saved-cards";
import { useChargeSavedCard } from "@/src/hooks/use-charge-saved-card";
import { payWithPaystack } from "@/src/lib/paystack";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PaymentSummary() {
  const router = useRouter();
  const { data: items } = useCart();
  const addressId = useCheckoutStore((state) => state.addressId);
  const shippingSelections = useCheckoutStore((state) => state.shippingSelections);
  const appliedCoupon = useCheckoutStore((state) => state.appliedCoupon);
  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  const { mutateAsync: initiateCheckout } = useInitiateCheckout();
  const { mutateAsync: verifyCheckout } = useVerifyCheckout();
  const { mutateAsync: chargeSavedCard } = useChargeSavedCard();
  const { data: savedCards } = useSavedCards();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string>("new");

  useEffect(() => {
    const defaultCard = savedCards?.find((card) => card.isDefault) ?? savedCards?.[0];
    if (defaultCard) setSelectedCardId(defaultCard.id);
  }, [savedCards]);

  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const subtotal = items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;
  const deliveryFee = Object.values(shippingSelections).reduce(
    (sum, selection) => sum + selection.fee,
    0
  );
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const shippingSelectionsArray = Object.entries(shippingSelections).map(
    ([storeId, selection]) => ({ storeId, shippingOptionId: selection.shippingOptionId })
  );

  const handlePay = async () => {
    if (!addressId) {
      setError("Select a delivery address on the checkout page first.");
      return;
    }

    setError("");
    setProcessing(true);

    if (selectedCardId !== "new") {
      try {
        const response = await chargeSavedCard({
          addressId,
          savedCardId: selectedCardId,
          shippingSelections: shippingSelectionsArray,
          couponCode: appliedCoupon?.code,
        });
        const order = (response as { data: { id: string } }).data;
        resetCheckout();
        router.push(`/marketplace/order-success?orderId=${order.id}`);
      } catch {
        setProcessing(false);
      }
      return;
    }

    try {
      const response = await initiateCheckout({
        addressId,
        shippingSelections: shippingSelectionsArray,
        couponCode: appliedCoupon?.code,
      });
      const { accessCode, reference } = (response as { data: { accessCode: string; reference: string } }).data;

      await payWithPaystack(accessCode, {
        onSuccess: async () => {
          try {
            const verifyResponse = await verifyCheckout(reference);
            const order = (verifyResponse as { data: { order: { id: string } } }).data.order;
            resetCheckout();
            router.push(`/marketplace/order-success?orderId=${order.id}`);
          } catch {
            setError("Payment was received but we couldn't confirm it. Check your orders page.");
            setProcessing(false);
          }
        },
        onCancel: () => {
          setProcessing(false);
        },
        onError: (message) => {
          setError(message || "Payment failed. Please try again.");
          setProcessing(false);
        },
      });
    } catch {
      setProcessing(false);
    }
  };

  return (
    <aside className="space-y-5 rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Payment summary
      </h2>

      {!!savedCards?.length && (
        <div className="space-y-2">
          <p className="text-[12.5px] font-medium text-[#334155]">Pay with</p>
          <div className="space-y-2">
            {savedCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                  selectedCardId === card.id
                    ? "border-violet-400 bg-violet-50"
                    : "border-[#ECE9F6] hover:border-violet-200"
                }`}
              >
                <CreditCard size={16} className="shrink-0 text-[#64748B]" />
                <span className="text-[13px] font-medium text-[#13131A]">
                  {card.cardType ?? "Card"} •••• {card.last4}
                </span>
              </button>
            ))}

            <button
              onClick={() => setSelectedCardId("new")}
              className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                selectedCardId === "new"
                  ? "border-violet-400 bg-violet-50"
                  : "border-[#ECE9F6] hover:border-violet-200"
              }`}
            >
              <CreditCard size={16} className="shrink-0 text-[#94A3B8]" />
              <span className="text-[13px] font-medium text-[#13131A]">Pay with a new card</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <SummaryRow label="Items" value={totalItems.toString()} />
        <SummaryRow label="Subtotal" value={money(subtotal)} />
        {deliveryFee > 0 && <SummaryRow label="Shipping" value={money(deliveryFee)} />}
        {discountAmount > 0 && (
          <SummaryRow label="Coupon discount" value={`-${money(discountAmount)}`} />
        )}

        <div className="border-t border-dashed border-[#ECE9F6] pt-3">
          <SummaryRow label="Amount to pay" value={money(estimatedTotal)} bold />
        </div>

        <p className="text-[11.5px] text-[#94A3B8]">
          The exact amount is confirmed by the server before payment.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[12.5px] text-red-600">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={processing || totalItems === 0}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-[14px] font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {processing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing payment...
          </>
        ) : (
          `Pay ${money(estimatedTotal)}`
        )}
      </button>
    </aside>
  );
}
