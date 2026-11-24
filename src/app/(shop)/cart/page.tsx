import type { Metadata } from "next";

import GuestCartPage from "./guest-cart-page";

export const metadata: Metadata = { title: "Your cart", robots: { index: false, follow: false } };

export default function Page() {
  return <GuestCartPage />;
}
