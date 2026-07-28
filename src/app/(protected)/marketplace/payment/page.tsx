"use client";

import PaymentHeader from "./components/payment-header";
import CheckoutStepper from "../checkout/components/checkout-stepper";
import PaymentSummary from "./components/payment-summary";
import PaymentSecurity from "./components/payment-security";

export default function PaymentPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-5 lg:px-8">
      <PaymentHeader />
      <CheckoutStepper step={3} />

      <PaymentSummary />

      <PaymentSecurity />
    </div>
  );
}
