import type { Metadata } from "next";
import { Suspense } from "react";

import GuestCheckoutPage from "./guest-checkout-page";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GuestCheckoutPage />
    </Suspense>
  );
}
