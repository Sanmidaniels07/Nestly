"use client";

import CheckoutHeader from "./components/checkout-header";
import CheckoutStepper from "./components/checkout-stepper";
import CheckoutSummary from "./components/checkout-summary";
import CouponSection from "./components/coupon-section";
import DeliveryMethod from "./components/delivery-method";
import OrderItems from "./components/order-item";
import ShippingAddress from "./components/shipping-address";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-8">

      <CheckoutHeader />

      <CheckoutStepper step={2} />

      <div className="grid gap-8 xl:grid-cols-[1.8fr_420px]">

        <section className="space-y-6">

          <ShippingAddress />

          <DeliveryMethod />

          <CouponSection />

          <OrderItems /> 

        </section>

        <CheckoutSummary />

      </div>

    </div>
  );
}