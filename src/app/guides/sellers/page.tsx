import type { Metadata } from "next";
import Link from "next/link";

import GuideDocument, { GuidePart } from "@/src/components/guides/guide-document";
import { AUTO_CONFIRM_DAYS, PAYOUT_HOLD_HOURS, RETURN_WINDOW_DAYS } from "@/src/lib/legal";
import { OG_IMAGE } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Seller guide - open your store on Nestly",
  description:
    "Step by step: apply to sell on Nestly, set up your store, payout account and delivery, list products, handle orders and get paid.",
  alternates: { canonical: "/guides/sellers" },
  openGraph: { title: "How to sell on Nestly", url: "/guides/sellers", images: [OG_IMAGE] },
};

const parts: GuidePart[] = [
  {
    heading: "Get approved",
    steps: [
      {
        id: "account",
        title: "Create your Nestly account",
        where: { label: "nestlyapp.site/signup", href: "/signup" },
        body: (
          <p>
            Sign up with your name, email and a password, then open the link we email you to verify your account. Already on Nestly? Just log in -
            your seller store lives on the same account.
          </p>
        ),
      },
      {
        id: "apply",
        title: "Apply to become a seller",
        where: { label: "Marketplace → Open your store (or Dashboard → Become a seller)", href: "/marketplace/sell" },
        body: (
          <>
            <p>On the Become a seller page:</p>
            <ul>
              <li>Check the box that shows the <strong>commission</strong> Nestly takes for each category.</li>
              <li>
                Add your <strong>CAC registration number</strong> if your business is registered (optional - you can add it later).
              </li>
              <li>
                Tick <strong>I agree to the Seller Agreement</strong> (read it <Link href="/seller-terms">here</Link>) and tap{" "}
                <strong>Continue</strong>.
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "approval",
        title: "Wait for approval",
        body: (
          <p>
            The Nestly team reviews every application. You&apos;ll get a notification in the app when you&apos;re approved. If an application is
            rejected you&apos;ll see the reason, and you can apply again after 3 days.
          </p>
        ),
      },
    ],
  },
  {
    heading: "Set up your store",
    steps: [
      {
        id: "store",
        title: "Create your store",
        where: { label: "Become a seller page → Set up your store", href: "/marketplace/sell" },
        body: (
          <>
            <p>
              Only the <strong>store name</strong> is required, but a complete store sells better. Add a logo, a banner, a short description of what you
              sell, your email, phone and address, then tap <strong>Create store</strong>.
            </p>
            <ul>
              <li>Your email, phone, Instagram, Facebook and TikTok are private - only you and the Nestly team see them.</li>
              <li>Buyers talk to you through Nestly messages, so every conversation and sale stays in the app.</li>
            </ul>
          </>
        ),
        tip: "Everything you need next is in the Seller Hub (Settings → Seller Hub). Its Dashboard shows a checklist of what's left before buyers can order.",
      },
      {
        id: "payout",
        title: "Add your payout bank account",
        where: { label: "Seller Hub → Store settings → Payout details", href: "/settings/marketplace?tab=store" },
        body: (
          <p>
            Choose your <strong>bank</strong>, enter your 10-digit <strong>account number</strong> and tap <strong>Verify &amp; activate</strong>. This
            connects your account to Paystack so your money is sent to you automatically when buyers pay.
          </p>
        ),
        warning: `For your safety, changing your payout account pauses automatic payouts for ${PAYOUT_HOLD_HOURS} hours, and we email you to confirm every change.`,
      },
      {
        id: "delivery",
        title: "Set your delivery zones or pickup",
        where: { label: "Seller Hub → Store settings → Delivery zones", href: "/settings/marketplace?tab=store" },
        body: (
          <>
            <p>
              Tap <strong>Add zones</strong>. Use <strong>Suggested</strong> to pick a state and ready-made areas, or <strong>Build your own</strong>.
              For each zone set:
            </p>
            <ul>
              <li>the <strong>areas</strong> it covers and the <strong>price</strong> buyers pay for delivery (you keep the full delivery fee);</li>
              <li>an optional <strong>delivery time</strong>, e.g. &quot;Same day&quot;;</li>
              <li>
                <strong>Delivered by</strong> - bike, car or truck. A product is only offered on zones whose vehicle can carry it, so you can price
                the same area by bike and by truck.
              </li>
            </ul>
            <p>
              Customers can also collect for free: turn on <strong>Offer pickup</strong> and add the pickup address and when orders are ready.
            </p>
          </>
        ),
        warning: "Buyers can't order from a store with no delivery zones and no pickup - set up at least one.",
      },
      {
        id: "policies",
        title: "Add your store policies",
        where: { label: "Seller Hub → Store settings → Store policies", href: "/settings/marketplace?tab=store" },
        body: (
          <p>
            Write your <strong>return</strong>, <strong>shipping</strong> and <strong>warranty</strong> policies and tap <strong>Save policies</strong>.
            They appear on your store page and help buyers shop with confidence.
          </p>
        ),
      },
      {
        id: "verify",
        title: "Get your verified badge (optional)",
        where: { label: "Seller Hub → Add CAC number", href: "/settings/marketplace" },
        body: (
          <p>
            Registered with the Corporate Affairs Commission? Add your CAC number. Once Nestly checks it, your store gets a verified badge - buyers are
            more likely to order from verified sellers. Not registered yet? You can add it any time.
          </p>
        ),
      },
    ],
  },
  {
    heading: "List your products",
    steps: [
      {
        id: "product",
        title: "Add your first product",
        where: { label: "Seller Hub → Products → Add product", href: "/settings/marketplace/components/products/new" },
        body: (
          <>
            <p>The form walks you through Basic info, Pricing, Specifications, Images and Review. You&apos;ll need:</p>
            <ul>
              <li>
                a <strong>product name</strong>, <strong>category</strong>, <strong>description</strong> and a unique <strong>SKU</strong> (your own
                code for the item);
              </li>
              <li>
                a <strong>selling price</strong> and <strong>stock quantity</strong> - the form shows the commission and exactly what you&apos;ll
                receive;
              </li>
              <li>
                <strong>photos</strong> - up to 10 (PNG, JPG or WEBP, under 8MB each). At least one is needed to publish;
              </li>
              <li>
                how it&apos;s <strong>delivered</strong> - bike, car or truck - so it&apos;s only offered on zones that can carry it.
              </li>
            </ul>
            <p>Brand, condition (new, used, made to order...), highlights and specifications are optional but help buyers decide.</p>
          </>
        ),
        tip: "Clear photos on a plain background and an honest description are the biggest things that turn visitors into buyers.",
      },
      {
        id: "options",
        title: "Add options if your product comes in choices",
        body: (
          <p>
            Selling sizes, colours or flavours? Turn on <strong>This product has options</strong>, add up to 2 options (e.g. Size and Colour), and set
            the price and stock for each choice. Products without options don&apos;t need this.
          </p>
        ),
      },
      {
        id: "publish",
        title: "Publish - and edit honestly",
        body: (
          <>
            <p>
              Choose <strong>Publish immediately</strong> to go live, or <strong>Save as draft</strong> to finish later. You can edit a product any
              time.
            </p>
            <ul>
              <li>Orders already placed keep the details buyers saw when they ordered.</li>
              <li>
                If an edit turns it into a different product (new category or a mostly new name), its earlier reviews are labelled &quot;earlier
                version&quot; and stop counting towards its rating. List a new product instead.
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    heading: "Sell and get paid",
    steps: [
      {
        id: "share",
        title: "Share your store and bring buyers",
        where: { label: "Seller Hub → Dashboard → Share your store", href: "/settings/marketplace" },
        body: (
          <>
            <p>
              Copy your store link, share it to WhatsApp, Facebook or X in one tap, download a <strong>story image</strong> for Instagram and WhatsApp
              Status, or print your <strong>QR code</strong> for your shop and packaging.
            </p>
            <p>
              <strong>Referral reward:</strong> when someone joins Nestly through your link, you pay 2% less commission on their orders from your store
              for 90 days. The card shows your visits, sign-ups and commission saved.
            </p>
            <p>
              <strong>Get followers:</strong> everyone who follows your store is told when you list new products, buyers who asked are told when a
              sold-out product is back, and buyers who leave items in their cart get a reminder - so restock and list often. Your products are also
              listed for Google search and Google Shopping.
            </p>
          </>
        ),
      },
      {
        id: "payment-links",
        title: "Close DM sales with a payment link",
        where: { label: "Seller Hub → Payment links", href: "/settings/marketplace?tab=links" },
        body: (
          <>
            <p>
              When a customer on Instagram, WhatsApp or TikTok asks &quot;how do I pay?&quot;, send a <strong>Nestly payment link</strong> instead of
              your account number. Add the item, the price you agreed, how many, and your delivery fee (or pickup) - then tap WhatsApp or copy the
              link.
            </p>
            <p>
              The buyer pays through Nestly and their money is held until they receive it, so people who are scared to pay a stranger will buy. It
              becomes a normal order: you&apos;re notified, you deliver, they give you their delivery code, and you get paid - the usual commission
              applies. Set a quantity above 1 to keep one link in your bio for something you sell often. Pause or edit a link any time.
            </p>
          </>
        ),
      },
      {
        id: "orders",
        title: "Handle each new order",
        where: { label: "Seller Hub → Orders", href: "/settings/marketplace?tab=orders" },
        body: (
          <>
            <p>
              You&apos;re notified when a buyer pays. Open the order to see the buyer&apos;s name and <strong>delivery address</strong> and any note
              they left you. For delivery orders you also get the <strong>phone number to call for delivery</strong> - in the order alert, the email and
              on the order until it&apos;s delivered. Use it only to deliver; for anything else tap <strong>Message buyer</strong>. Then move each item
              along:
            </p>
            <ul>
              <li>
                <strong>Processing</strong> while you prepare it → <strong>Shipped</strong> when it leaves you (add a tracking number if you have
                one);
              </li>
              <li>
                for pickup orders: <strong>Ready for pickup</strong> → <strong>Picked up</strong>.
              </li>
            </ul>
            <p>Each order shows your breakdown: item total, commission, delivery fee (yours in full) and what you receive.</p>
          </>
        ),
      },
      {
        id: "deliver",
        title: "Confirm delivery with the buyer's code",
        body: (
          <p>
            Every order has a 6-digit <strong>delivery code</strong> that only the buyer has. When the buyer receives the item, ask for the code, enter
            it and tap <strong>Confirm delivery</strong>. If they can&apos;t give the code, you can mark it delivered without it - the buyer then has{" "}
            {AUTO_CONFIRM_DAYS} days to confirm or report a problem before it confirms automatically.
          </p>
        ),
      },
      {
        id: "paid",
        title: "Get paid",
        where: { label: "Seller Hub → Earnings", href: "/settings/marketplace?tab=earnings" },
        body: (
          <>
            <p>
              When a buyer pays, your share - <strong>item price minus commission, plus your full delivery fee</strong> - is sent automatically to your
              payout account through Paystack, usually the next business day.
            </p>
            <p>
              If automatic payouts are paused (for example right after you change bank details), the money is kept in your Earnings balance and paid
              out to you by Nestly. Nestly pays Paystack&apos;s transaction fee out of its commission, so you receive your full share.
            </p>
          </>
        ),
      },
      {
        id: "returns",
        title: "Handle returns and reviews",
        where: { label: "Seller Hub → Returns", href: "/settings/marketplace?tab=returns" },
        body: (
          <p>
            Buyers can ask for a return within {RETURN_WINDOW_DAYS} days of delivery. Review each request and tap <strong>Approve</strong> or{" "}
            <strong>Reject</strong>, then <strong>Mark as refunded</strong> once the refund is done. You can reply once to each review on your store
            page - a polite reply wins future buyers.
          </p>
        ),
      },
      {
        id: "rules",
        title: "Keep every sale on Nestly",
        body: (
          <p>
            Buyers you meet on Nestly must pay through Nestly checkout. Don&apos;t ask them to pay by transfer, cash or POS, or to finish the deal on
            WhatsApp, Instagram, phone or email - those sales aren&apos;t protected for you or the buyer. See the{" "}
            <Link href="/seller-terms#conduct">Seller Agreement</Link>.
          </p>
        ),
        warning:
          "Breaking this rule can lead to a warning, removed products, losing your verified badge and referral rewards, store suspension, or a permanent ban.",
      },
    ],
  },
];

export default function SellerGuidePage() {
  return (
    <GuideDocument
      current="/guides/sellers"
      title="Sell on Nestly, step by step"
      intro={
        <p>
          From creating your account to your first payout. Follow the steps in order - most sellers are ready to take orders the same day they&apos;re
          approved.
        </p>
      }
      parts={parts}
      finish={{ label: "Start selling", href: "/marketplace/sell" }}
    />
  );
}
