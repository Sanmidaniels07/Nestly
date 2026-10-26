import type { Metadata } from "next";
import Link from "next/link";

import GuideDocument, { GuidePart } from "@/src/components/guides/guide-document";
import { AUTO_CONFIRM_DAYS, RETURN_WINDOW_DAYS } from "@/src/lib/legal";
import { OG_IMAGE } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Buyer guide - shop safely on Nestly",
  description:
    "Step by step: find products from Nigerian sellers, check out securely with Paystack, track delivery with your delivery code, and get returns and refunds.",
  alternates: { canonical: "/guides/buyers" },
  openGraph: { title: "How to buy on Nestly", url: "/guides/buyers", images: [OG_IMAGE] },
};

const parts: GuidePart[] = [
  {
    heading: "Find what you love",
    steps: [
      {
        id: "browse",
        title: "Browse - no account needed",
        where: { label: "Marketplace → Categories", href: "/marketplace/categories" },
        body: (
          <p>
            Look through categories, see what&apos;s sold in your state, search for something specific, or open a store to see everything it sells.
            Product pages show photos, price, options, delivery and reviews.
          </p>
        ),
      },
      {
        id: "account",
        title: "Create your free account",
        where: { label: "nestlyapp.site/signup", href: "/signup" },
        body: (
          <p>
            You&apos;ll need an account to buy, save items or follow stores. Sign up with your name, email and a password and verify your email. If
            you started from a product, we bring you straight back to it.
          </p>
        ),
      },
      {
        id: "save",
        title: "Save items and follow stores",
        body: (
          <p>
            Tap <strong>Save item</strong> on anything you like - it waits for you in <strong>Saved products</strong>. <strong>Follow</strong> stores you
            love and we&apos;ll tell you when they list something new. Sold out? Tap <strong>Notify me when it&apos;s back</strong>. You can turn these
            alerts off under Settings → Notifications → Shopping updates.
          </p>
        ),
      },
      {
        id: "ask",
        title: "Ask the seller a question",
        body: (
          <p>
            Tap <strong>Message</strong> on the store page to chat with the seller in the app - about sizes, colours, delivery times or anything
            else.
          </p>
        ),
        warning:
          "Keep payments on Nestly. Only pay through Nestly checkout - money sent straight to a seller (bank transfer, cash, POS) isn't covered by buyer protection. If a seller asks you to pay outside Nestly, please report them. Phone numbers, emails and social handles are hidden in chats with sellers.",
      },
    ],
  },
  {
    heading: "Check out",
    steps: [
      {
        id: "cart",
        title: "Add to cart or Buy now",
        body: (
          <p>
            Choose any options (size, colour...) and quantity, then tap <strong>Add to cart</strong> to keep shopping or <strong>Buy now</strong> to go
            straight to checkout. You can buy from several stores in one checkout.
          </p>
        ),
      },
      {
        id: "address",
        title: "Add your delivery address",
        body: <p>Enter your full name, phone number, address, city and state, then check the <strong>phone number for delivery</strong> - change it if someone else is receiving the order. The seller (who delivers) gets your name, address and that number only to deliver; your email is never shared.</p>,
      },
      {
        id: "delivery",
        title: "Choose delivery or pickup for each store",
        body: (
          <>
            <p>
              For each store, pick delivery to your area (search your area to find its price) or <strong>pickup</strong>, which is free where offered.
            </p>
            <p>You can also leave each seller a note, e.g. &quot;Please call before delivery&quot; or a message for a gift.</p>
          </>
        ),
      },
      {
        id: "coupon",
        title: "Apply a coupon (if you have one)",
        body: <p>Enter the code under Coupon. Some coupons have an expiry date, a usage limit or a minimum order.</p>,
      },
      {
        id: "pay",
        title: "Pay securely with Paystack",
        body: (
          <p>
            Pay with your debit or credit card (Visa, Mastercard, Verve) through Paystack - Nestly never sees your card number. You can save a card for
            faster checkout next time. When payment goes through you&apos;ll see <strong>Payment successful</strong>.
          </p>
        ),
      },
    ],
  },
  {
    heading: "After you pay",
    steps: [
      {
        id: "track",
        title: "Track your order",
        where: { label: "Marketplace → Orders", href: "/marketplace/orders" },
        body: (
          <p>
            Follow each order from <strong>Payment confirmed</strong> to <strong>Being prepared</strong>, <strong>Shipped</strong> and{" "}
            <strong>Delivered</strong>. You&apos;re notified at each step.
          </p>
        ),
      },
      {
        id: "code",
        title: "Give your delivery code only when you have the item",
        body: (
          <p>
            Each order has a 6-digit <strong>delivery code</strong> on its order page. Give it to the person delivering only once the item is in your
            hands - it tells Nestly you received it.
          </p>
        ),
        warning: "Never share your delivery code before you receive your order.",
      },
      {
        id: "confirm",
        title: "Confirm you received it - or report a problem",
        body: (
          <p>
            If the seller marks your order delivered without your code, tap <strong>Yes, I received it</strong>, or <strong>Report a problem</strong>{" "}
            if it didn&apos;t arrive, arrived damaged or is the wrong item. If you do nothing, it&apos;s confirmed automatically after{" "}
            {AUTO_CONFIRM_DAYS} days.
          </p>
        ),
      },
      {
        id: "cancel",
        title: "Need to cancel?",
        body: (
          <p>
            You can tap <strong>Cancel order</strong> while the seller hasn&apos;t started on it yet. Once it&apos;s being prepared, message the seller
            or contact Nestly Support.
          </p>
        ),
      },
      {
        id: "returns",
        title: `Return an item within ${RETURN_WINDOW_DAYS} days`,
        where: { label: "Order page → Request return", href: "/marketplace/orders" },
        body: (
          <p>
            Tap <strong>Request return</strong> within {RETURN_WINDOW_DAYS} days of delivery and tell the seller what&apos;s wrong. Follow your requests
            under <Link href="/marketplace/returns">Returns</Link>. Approved refunds are made within 7 business days to your original payment method.
          </p>
        ),
      },
      {
        id: "review",
        title: "Leave a review",
        body: (
          <p>
            After delivery, tap <strong>Write a review</strong> and rate the product from 1 to 5 stars. Honest reviews help other buyers and good
            sellers.
          </p>
        ),
        tip: "See something wrong - a fake product, a scam or a seller asking for payment outside Nestly? Use Report on the product, store or profile.",
      },
    ],
  },
];

export default function BuyerGuidePage() {
  return (
    <GuideDocument
      current="/guides/buyers"
      title="Shop on Nestly, step by step"
      intro={<p>Find things you love from sellers across Nigeria, pay securely, and know exactly where your order is - from browsing to your door.</p>}
      parts={parts}
      finish={{ label: "Start shopping", href: "/marketplace/categories" }}
    />
  );
}
