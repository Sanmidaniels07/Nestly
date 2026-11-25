import type { Metadata } from "next";
import Link from "next/link";

import GuideDocument, { GuidePart } from "@/src/components/guides/guide-document";
import { AUTO_CONFIRM_DAYS, PERISHABLE_REPORT_HOURS, RETURN_WINDOW_DAYS } from "@/src/lib/legal";
import { OG_IMAGE } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Buyer guide - shop safely on Nestly",
  description:
    "Step by step: find products from Nigerian sellers, buy with or without an account, pay securely with Paystack, track delivery with your delivery code, and get returns and refunds.",
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
        where: { label: "Shop → Categories", href: "/marketplace/categories" },
        body: (
          <p>
            Look through categories, see what&apos;s sold in your state, search for something specific, or open a store to see everything it sells.
            Product pages show photos, price, options, delivery and reviews.
          </p>
        ),
      },
      {
        id: "account",
        title: "Buy with or without an account",
        where: { label: "nestlyapp.site/signup", href: "/signup" },
        body: (
          <p>
            You can buy as a guest - just your name, email and phone at checkout, and we email your receipt and delivery code. A free account lets you
            save items, follow stores, see all your orders in one place and check out faster. After a guest order we offer to set one up for you -
            or tap <strong>No thanks</strong>.
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
            alerts off under Me → Settings → Notifications → Shopping updates.
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
        id: "links",
        title: "Bought from a link a seller sent you?",
        body: (
          <p>
            Sellers often share a <strong>pay link</strong> (one item) or a <strong>collection</strong> (a few of their products on one page). On a
            collection, tap <strong>Add</strong> on what you want, choose sizes and quantities, then <strong>Check out</strong> - one payment for
            everything, with the same protection as any Nestly order.
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
            Everything is on one page: check your address and delivery, then tap <strong>Pay</strong>. Pay by card, bank transfer or USSD through
            Paystack - Nestly never sees your card number. With an account you can save a card for faster checkout next time. Your money is held by
            Nestly until you have your order.
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
        where: { label: "Orders (in the menu)", href: "/marketplace/orders" },
        body: (
          <p>
            Open an order and the <strong>What&apos;s next</strong> card at the top tells you where it is - placed, being prepared, on its way (or
            ready for pickup), delivered - and the one thing to do now. You&apos;re notified at each step. Bought as a guest? Use the link in your
            email.
          </p>
        ),
      },
      {
        id: "code",
        title: "Give your delivery code only when you have the item",
        body: (
          <p>
            Each order has a 6-digit <strong>delivery code</strong> - tap <strong>Show my code</strong> on the order page. Give it to the person
            delivering only once the item is in your hands - it tells Nestly you received it.
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
        title: `Report a problem within ${RETURN_WINDOW_DAYS} days`,
        where: { label: "Order page → Request return", href: "/marketplace/orders" },
        body: (
          <p>
            If an item arrives damaged, faulty, the wrong item or significantly not as described, tap <strong>Request return</strong> within{" "}
            {RETURN_WINDOW_DAYS} days of delivery and choose what&apos;s wrong. For food, cakes and groceries you have {PERISHABLE_REPORT_HOURS} hours -
            add a photo and you don&apos;t need to send it back. There are no change-of-mind returns. Follow your requests under{" "}
            <Link href="/marketplace/returns">Me → Returns &amp; refunds</Link>: the seller has 48 hours to refund you or send a replacement, and
            if you can&apos;t agree, Nestly decides. Refunds go back to your original payment method, usually within 5-10 business days. Bought as a
            guest? Returns go through a free account - set a password and you land right on the form - or message Nestly on WhatsApp.
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
