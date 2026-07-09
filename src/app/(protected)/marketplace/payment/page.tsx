"use client";

import { AnimatePresence, motion } from "framer-motion";
import PaymentHeader from "./components/payment-header";
import CheckoutStepper from "../checkout/components/checkout-stepper";
import PaymentMethods from "./components/payment-methods";
// import CardPaymentForm from "./components/card-payment-form";
// import BankTransfer from "./components/bank-transfer";
// import WalletPayment from "./components/wallet-payment";
// import PaymentSummary from "./components/payment-summary";
import { useCheckoutStore } from "@/src/store/checkout-store";
import PaymentContent from "./components/payment-content";
import PaymentSummary from "./components/payment-summary";

export default function PaymentPage() {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-5 lg:px-8">
      <PaymentHeader />
      <CheckoutStepper step={3} />

      <div className="grid gap-6 xl:grid-cols-[1.8fr_420px]">
        <section className="space-y-5">
          <PaymentMethods />

          <PaymentContent />

          <AnimatePresence mode="wait">
            <motion.div
              key={paymentMethod}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {/* {paymentMethod === "card" && <CardPaymentForm />}
              {paymentMethod === "bank" && <BankTransfer />}
              {paymentMethod === "wallet" && <WalletPayment />} */}
            </motion.div>
          </AnimatePresence>
        </section>
        <aside>
          <PaymentSummary />
        </aside>{" "}
      </div>
    </div>
  );
}
