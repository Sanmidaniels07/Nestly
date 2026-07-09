"use client";

import { useCheckoutStore } from "@/src/store/checkout-store";
import CardPaymentForm from "./card-payment-form";

// import CardPaymentForm from "./card-payment-form";
// import BankTransfer from "./bank-transfer";
// import WalletPayment from "./wallet-payment";

export default function PaymentContent() {
  const paymentMethod = useCheckoutStore(
    (state) => state.paymentMethod
  );

  switch (paymentMethod) {
    case "bank":
    //   return <BankTransfer />;

    case "wallet":
    //   return <WalletPayment />;

    default:
      return <CardPaymentForm />;
  }
}