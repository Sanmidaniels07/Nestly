import type { Metadata } from "next";
import Link from "next/link";

import LegalDocument, { LegalSection } from "@/src/components/legal/legal-document";
import {
  AUTO_CONFIRM_DAYS,
  LEGAL_EMAIL,
  OPERATED_BY,
  LEGAL_WHATSAPP_DISPLAY,
  LEGAL_WHATSAPP_URL,
  PAYOUT_HOLD_HOURS,
  RETURN_WINDOW_DAYS,
  PERISHABLE_REPORT_HOURS,
  RETURN_POLICY_EFFECTIVE,
} from "@/src/lib/legal";
import { OG_IMAGE } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Seller Agreement",
  description: "Terms for selling on Nestly - approval, listings, prohibited items, fulfilment, commission, payouts, returns and verification.",
  alternates: { canonical: "/seller-terms" },
  openGraph: { title: "Nestly Seller Agreement", url: "/seller-terms", images: [OG_IMAGE] },
};

const sections: LegalSection[] = [
  {
    id: "scope",
    heading: "This agreement",
    body: (
      <p>
        This Seller Agreement applies when you apply to sell or sell on Nestly{OPERATED_BY}. It adds to our{" "}
        <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>, which also apply to you. By applying to become a
        seller you accept it.
      </p>
    ),
  },
  {
    id: "approval",
    heading: "Becoming a seller",
    body: (
      <>
        <p>
          You must be at least 18 and give accurate information. Nestly reviews every application and may approve or reject it. If an application is
          rejected you can reapply after a short waiting period shown in the app.
        </p>
        <p>
          Once approved you set up one store, with a payout bank account <strong>in your own name or your business&apos;s registered name</strong>.
        </p>
      </>
    ),
  },
  {
    id: "verification",
    heading: "Business verification",
    body: (
      <p>
        You can add your CAC registration number (business name or company). Nestly may check it against the Corporate Affairs Commission&apos;s public
        register; if it matches an active business, your store shows a <strong>verified</strong> badge. If you change the number, the badge is removed
        until it is checked again. Giving a false or someone else&apos;s registration number will lead to suspension.
      </p>
    ),
  },
  {
    id: "listings",
    heading: "Your listings",
    body: (
      <>
        <p>
          Listings must be accurate and honest: real photos of what you sell, the correct price in Naira, condition, quantity in stock and a fair
          description. Keep stock up to date so buyers don&apos;t order items you don&apos;t have. You confirm you own, or have the right to sell, everything
          you list.
        </p>
        <p>
          Food, cosmetics, drugs, medical and similar regulated products must meet Nigerian rules, including NAFDAC registration and labelling where
          required, and be safe, hygienically prepared and within date.
        </p>
      </>
    ),
  },
  {
    id: "prohibited",
    heading: "Prohibited items",
    body: (
      <>
        <p>You must not list or sell:</p>
        <ul>
          <li>anything illegal in Nigeria, stolen, or obtained without the right to sell it;</li>
          <li>counterfeit, fake or replica branded goods;</li>
          <li>weapons, ammunition, explosives or fireworks;</li>
          <li>illegal drugs, prescription-only medicines, or drug paraphernalia;</li>
          <li>alcohol or tobacco/vaping products to anyone under 18;</li>
          <li>adult or sexually explicit products and content;</li>
          <li>live animals, protected wildlife or wildlife products;</li>
          <li>hazardous chemicals, or recalled or unsafe products;</li>
          <li>personal data, accounts, government documents or IDs;</li>
          <li>regulated products without the licence or registration the law requires.</li>
        </ul>
        <p>Nestly may remove listings, cancel orders and suspend stores that break these rules, and may report illegal activity to the authorities.</p>
      </>
    ),
  },
  {
    id: "fulfilment",
    heading: "Orders, delivery and pickup",
    body: (
      <>
        <p>
          You receive orders only after the buyer&apos;s payment is confirmed. Process them promptly, keep the order status up to date in your seller
          dashboard, and deliver within the time you advertise, or contact the buyer if there is a delay.
        </p>
        <p>
          You set your own delivery zones and fees, and can offer free pickup. You are responsible for getting the order to the buyer in good condition.
        </p>
        <p>
          At handover, ask the buyer for their <strong>delivery code</strong> and enter it in the app: this confirms the delivery. Never ask for the code
          before the buyer has the items. If you mark an order delivered without the code, the buyer has {AUTO_CONFIRM_DAYS} days to confirm or report a
          problem before it is confirmed automatically.
        </p>
      </>
    ),
  },
  {
    id: "fees",
    heading: "Commission and fees",
    body: (
      <>
        <ul>
          <li>
            <strong>Commission:</strong> Nestly charges a commission on the price of each item sold. The rate depends on the product&apos;s category and is shown
            on the <Link href="/marketplace/sell">Sell on Nestly</Link> page and when you add or edit a product, together with what you will receive.
          </li>
          <li>
            The rate that applies is the one in force <strong>when the order is placed</strong>; later rate changes never affect existing orders.
          </li>
          <li>
            <strong>Delivery fees are yours in full</strong> - no commission is taken on them.
          </li>
          <li>
            <strong>Payment processing:</strong> Nestly currently pays Paystack&apos;s transaction fee on your sales out of its commission - you
            receive your full share. On the rare order where Nestly&apos;s commission is smaller than the fee, that order&apos;s fee is shared between you and
            Nestly in proportion to the amount each receives. We&apos;ll give you notice before changing this.
          </li>
          <li>
            <strong>Referral reward:</strong> when someone creates a Nestly account after opening your store&apos;s share link, your commission on their
            orders from your store is 2 percentage points lower (never below 0%) for 90 days from when they joined. It is applied automatically when the
            order is placed and doesn&apos;t apply to purchases from your own account. Nestly may end or change this reward for future referrals with notice.
          </li>
          <li>There is no fee to join, list products or keep a store open.</li>
        </ul>
        <p>
          If we change a category&apos;s commission, every seller with products in that category is notified in the app and by email. For increases we aim to
          give at least 14 days&apos; notice. If you don&apos;t accept a change you can stop selling at any time.
        </p>
        <p>Each order in your seller dashboard shows the breakdown: item total, commission, delivery fee and what you receive.</p>
      </>
    ),
  },
  {
    id: "payouts",
    heading: "Payouts",
    body: (
      <>
        <p>
          When a buyer pays, Nestly holds the payment until the buyer has the item and the return window has closed - {RETURN_WINDOW_DAYS} days after
          delivery is confirmed, or {PERISHABLE_REPORT_HOURS} hours for perishable categories. Your share (item price minus commission, plus your full
          delivery fee) is then paid to your payout bank account, normally by bank transfer within one business day. You can see what&apos;s coming
          and when under Seller Hub → Earnings.
        </p>
        <p>
          If a buyer reports a problem with an order, the payout for that order waits until the report is closed. Payouts also wait for{" "}
          {PAYOUT_HOLD_HOURS} hours after you change your bank details, a security measure. Earnings from orders placed before payouts worked this way
          are paid out by Nestly from your Earnings balance.
        </p>
        <p>You are told by email whenever your payout bank account is changed. If you didn&apos;t make the change, contact us immediately.</p>
      </>
    ),
  },
  {
    id: "returns",
    heading: "Cancellations, returns and refunds",
    body: (
      <>
        <p>
          Nestly&apos;s returns policy in the <Link href="/terms#returns">Terms of Service</Link> applies to every order and replaces any return policy
          of your own (stores no longer set one). Buyers may report an item that is damaged, spoiled or expired, faulty, the wrong item, or
          significantly not as described within <strong>{RETURN_WINDOW_DAYS} days</strong> of delivery being confirmed - or within{" "}
          <strong>{PERISHABLE_REPORT_HOURS} hours</strong> for perishable categories such as food, cakes and groceries, where the buyer sends a photo
          instead of returning the item. There are no change-of-mind returns. You may not refuse a valid report.
        </p>
        <p>
          You must answer a report within <strong>48 hours</strong> ({PERISHABLE_REPORT_HOURS} hours for perishables) in Seller Hub → Returns: refund the
          buyer, send a replacement, or tell Nestly why you disagree. If you don&apos;t answer in time, or you disagree, Nestly reviews the evidence and
          decides. A refund is the full price the buyer paid for the item (plus the delivery fee if they kept nothing else from you) - there are no
          partial refunds. The buyer may also choose to keep the item, which closes the report.
        </p>
        <p>
          This policy applies to items delivered from {RETURN_POLICY_EFFECTIVE}. By continuing to sell on Nestly after that date you accept it.
        </p>
        <p>
          If an order is cancelled before fulfilment or a refund is agreed, the buyer is refunded from the payment Nestly is holding for that order, so
          it is not taken from money already paid to you. Where you have already been paid for that order (for example orders paid out before this
          policy), the refunded amount may be deducted from your future earnings, or you agree to repay it to Nestly. Where you and a buyer disagree, Nestly&apos;s
          decision after reviewing the evidence is final for purposes of the marketplace.
        </p>
      </>
    ),
  },
  {
    id: "buyer-data",
    heading: "Buyers' personal data",
    body: (
      <p>
        You receive buyers&apos; names, delivery addresses and, for delivery orders, a phone number to call only to deliver their orders - for anything else, talk to buyers through Nestly messages (contact details there are hidden automatically). Use them for nothing else - no marketing, sharing or selling
        without the buyer&apos;s permission - keep them secure, and delete them when no longer needed. This is required by the Nigeria Data Protection Act.
      </p>
    ),
  },
  {
    id: "conduct",
    heading: "Fair trading",
    body: (
      <ul>
        <li>
          <strong>Keep sales on Nestly.</strong> Every sale with a buyer you met on Nestly must be paid through Nestly checkout. Don&apos;t ask or encourage
          buyers to pay you by bank transfer, cash, POS or any other way outside Nestly, or to finish the deal on WhatsApp, Instagram, phone or email.
          Buyers who pay outside Nestly lose Nestly&apos;s buyer protection, and you lose seller protection and dispute support.
        </li>
        <li>
          If you break this rule, Nestly may, depending on how serious or repeated it is: send you a warning; remove the products involved; withdraw
          your verified badge and referral rewards; suspend your store; or permanently end your seller access. Buyers can report sellers who ask for
          payment outside Nestly.
        </li>
        <li>Don&apos;t post or buy fake reviews, or review your own products.</li>
        <li>Communicate politely and honestly with buyers, through Nestly messages where possible.</li>
        <li>You are responsible for your own taxes and any business registration, licences and permits your business needs.</li>
      </ul>
    ),
  },
  {
    id: "live",
    heading: "Live selling",
    body: (
      <ul>
        <li>You can go live once your store is fully set up (payout account, delivery zones or pickup, and at least one published product). Lives have a time limit (shown in your Lives tab) and end by themselves when it&apos;s reached.</li>
        <li>
          Only show and sell products you&apos;re allowed to list on Nestly, and only feature your own products. What you say on camera about price,
          condition and delivery must match your listing - buyers can rely on it in a return or dispute.
        </li>
        <li>
          A live-only discount you set is a promise: it applies to orders placed during the live and for 30 minutes after it ends, and you bear it (Nestly&apos;s
          commission is worked out on the discounted price).
        </li>
        <li>
          All sales from a live go through Nestly checkout. Asking viewers to pay you directly, or sharing phone numbers or account details on camera or in the
          chat, breaks the &ldquo;Keep sales on Nestly&rdquo; rule below.
        </li>
        <li>No nudity, hate, harassment, dangerous activities or misleading giveaways. Nestly may end a live, and suspend live selling for your store, if these rules are broken.</li>
      </ul>
    ),
  },
  {
    id: "suspension",
    heading: "Suspension and ending",
    body: (
      <p>
        Nestly may suspend your store (hiding it and your products from buyers) or end your seller access if you break this agreement, receive repeated
        valid complaints, or put buyers at risk. Where possible we tell you why and give you a chance to respond. Open orders must still be fulfilled or
        refunded. You can close your store at any time by contacting us, after open orders are completed.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Responsibility",
    body: (
      <p>
        You are responsible for the products you sell and for your dealings with buyers. You agree to cover Nestly for losses caused by your listings,
        products or breach of this agreement. Nestly&apos;s liability to you is limited to the fees we received from your sales in the three months before
        a claim, except where the law doesn&apos;t allow such a limit.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Seller support: WhatsApp <a href={LEGAL_WHATSAPP_URL}>{LEGAL_WHATSAPP_DISPLAY}</a> or email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    ),
  },
];

export default function SellerTermsPage() {
  return (
    <LegalDocument
      eyebrow="For sellers"
      title="Seller Agreement"
      intro={
        <p>
          In short: list honestly, never sell prohibited items, deliver what you promise and confirm handover with the buyer&apos;s code. Nestly takes a
          category commission on item prices only - delivery fees are yours - and pays you through Paystack.
        </p>
      }
      sections={sections}
    />
  );
}
