import { redirect } from "next/navigation";

// Paying is part of the checkout page now (one page: details, then Pay).
export default function PaymentPage() {
  redirect("/marketplace/checkout");
}
