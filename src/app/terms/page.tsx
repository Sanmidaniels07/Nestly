import type { Metadata } from "next";
import Link from "next/link";

import LegalDocument, { LegalSection } from "@/src/components/legal/legal-document";
import {
  AUTO_CONFIRM_DAYS,
  LEGAL_EMAIL,
  OPERATED_BY,
  LEGAL_WHATSAPP_DISPLAY,
  LEGAL_WHATSAPP_URL,
  MIN_AGE,
  RETURN_WINDOW_DAYS,
  PERISHABLE_REPORT_HOURS,
  PREVIOUS_RETURN_WINDOW_DAYS,
  RETURN_POLICY_EFFECTIVE,
} from "@/src/lib/legal";
import { OG_IMAGE } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules for using Nestly - accounts, content, buying, payments, delivery, returns and refunds.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Nestly Terms of Service", url: "/terms", images: [OG_IMAGE] },
};

const sections: LegalSection[] = [
  {
    id: "about",
    heading: "About Nestly and these terms",
    body: (
      <>
        <p>
          Nestly (&ldquo;Nestly&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a social marketplace at nestlyapp.site{OPERATED_BY}, based in Nigeria.
          Nestly lets you connect with people, join communities and events, get birthday reminders, and buy from or sell to other users.
        </p>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) are an agreement between you and Nestly. By creating an account or using Nestly you agree to them,
          to our <Link href="/privacy">Privacy Policy</Link> and, if you sell, to our <Link href="/seller-terms">Seller Agreement</Link>. If you don&apos;t agree, please don&apos;t use Nestly.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    heading: "Who can use Nestly",
    body: (
      <>
        <p>
          You must be at least {MIN_AGE} years old to create an account. To buy or sell on the marketplace you must be at least 18, or have the
          permission and supervision of a parent or guardian who accepts these Terms for you.
        </p>
        <p>You must not use Nestly if we have previously banned you, or if the law prevents you from doing so.</p>
      </>
    ),
  },
  {
    id: "account",
    heading: "Your account",
    body: (
      <>
        <p>
          Give us accurate information and keep it up to date. You are responsible for everything done through your account, so keep your password
          private and use two-factor authentication if you can. Tell us straight away if you think someone else has access to your account.
        </p>
        <p>
          You can delete your account at any time from <strong>Settings → Account</strong>. Some records (for example completed orders, which sellers and
          payment providers rely on) are kept as described in our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "content",
    heading: "Your content and how you behave",
    body: (
      <>
        <p>
          You own the posts, photos, comments, messages and product listings you share (&ldquo;your content&rdquo;). You give Nestly a non-exclusive,
          royalty-free licence to host, display and share your content within Nestly and in Nestly&apos;s promotion of the service, for as long as it is on
          Nestly. You are responsible for your content and confirm you have the right to share it.
        </p>
        <p>You must not use Nestly to:</p>
        <ul>
          <li>harass, bully, threaten or impersonate anyone, or share hateful, violent, sexual or exploitative content;</li>
          <li>share other people&apos;s personal information without their permission;</li>
          <li>post spam, scams, fake reviews or misleading information;</li>
          <li>infringe anyone&apos;s copyright, trademark or other rights;</li>
          <li>buy, sell or promote anything illegal or listed as prohibited in the <Link href="/seller-terms#prohibited">Seller Agreement</Link>;</li>
          <li>arrange payment outside Nestly for a purchase you found on Nestly, to avoid fees or buyer protection;</li>
          <li>hack, overload, scrape or interfere with Nestly or other users&apos; accounts.</li>
        </ul>
        <p>
          You can report content, users and stores from within the app, and block people. We may remove content, limit features, or suspend or
          ban accounts and stores that break these Terms or the law.
        </p>
      </>
    ),
  },
  {
    id: "marketplace",
    heading: "How the marketplace works",
    body: (
      <>
        <p>
          Products on Nestly are sold by independent sellers, not by Nestly. When you buy, your contract for the item is with the seller. Nestly
          provides the platform, takes payment on the seller&apos;s behalf through Paystack, and helps resolve problems.
        </p>
        <p>
          Sellers are responsible for their listings being accurate and lawful, and for the quality and safety of what they sell. We review seller
          applications and may verify some businesses, but we don&apos;t inspect products and can&apos;t guarantee them.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    heading: "Prices and payment",
    body: (
      <>
        <p>
          Prices are set by sellers and shown in Naira. At checkout you see the item prices, any delivery fee (set by each seller for your area) and any
          discount before you pay. Pickup orders have no delivery fee.
        </p>
        <p>
          Payments are processed by <strong>Paystack</strong> (card, bank transfer and other methods Paystack offers). Nestly never sees or stores your full
          card number. An order is only confirmed once Paystack confirms the payment. If payment fails or is abandoned, no order is placed.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    heading: "Delivery, pickup and your delivery code",
    body: (
      <>
        <p>
          Each seller handles their own delivery or pickup and gives an estimated time. You can follow your order&apos;s progress in <strong>My orders</strong>.
        </p>
        <p>
          Every order comes with a private <strong>delivery code</strong>. Only give it to the seller when you have your items in hand: entering the code
          confirms the delivery. Never share it in advance, and Nestly staff will never ask for it.
        </p>
        <p>
          If a seller marks an order as delivered and you don&apos;t confirm or report a problem within {AUTO_CONFIRM_DAYS} days, it is confirmed
          automatically. If something is wrong, report it before then.
        </p>
      </>
    ),
  },
  {
    id: "cancellations",
    heading: "Cancellations",
    body: (
      <>
        <p>
          You can cancel an order from <strong>My orders</strong> until the seller starts preparing it. After that, contact the seller or Nestly Support.
          Sellers may cancel an order they can&apos;t fulfil.
        </p>
        <p>If a paid order is cancelled, you are entitled to a full refund (see Refunds).</p>
      </>
    ),
  },
  {
    id: "returns",
    heading: "Returns",
    body: (
      <>
        <p>
          One returns policy - Nestly&apos;s - applies to every order, whichever store you buy from. If something is wrong with what you received, report
          it from <strong>My orders</strong> within <strong>{RETURN_WINDOW_DAYS} days</strong> of delivery being confirmed, or within{" "}
          <strong>{PERISHABLE_REPORT_HOURS} hours</strong> for perishable items such as food, cakes and groceries. You can also report an item that was
          marked delivered but never reached you.
        </p>
        <p>
          You can report an item that arrived <strong>damaged</strong>, <strong>spoiled or expired</strong>, <strong>faulty</strong>, the{" "}
          <strong>wrong item</strong>, or <strong>significantly different from its description</strong>. Returns because you changed your mind are not
          accepted.
        </p>
        <p>
          For perishable items, add a photo of the problem - you don&apos;t send the item back. The seller has 48 hours (24 for perishables) to refund
          you or send a replacement; if they don&apos;t answer in time or disagree, Nestly reviews the evidence and decides. For non-perishable items
          the seller may ask for the item back as part of a refund or replacement. A refund is the full price you paid for the item - there are no
          partial refunds. You can choose to keep the item at any time, which closes your report. Nestly holds the seller&apos;s payment until
          reports are settled, so approved refunds are paid from it.
        </p>
        <p>
          Items whose delivery was confirmed before {RETURN_POLICY_EFFECTIVE} keep the {PREVIOUS_RETURN_WINDOW_DAYS}-day window that applied then.
          Nothing in this policy takes away rights you have under Nigerian consumer protection law.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    heading: "Refunds",
    body: (
      <>
        <p>
          When a cancellation or refund is approved, Nestly sends it back to your original payment method (or, if that isn&apos;t possible, to a bank
          account in your name). Refunds usually arrive within 5-10 business days, depending on your bank. The delivery fee is refunded too when the
          order is cancelled or when nothing you bought from that seller is kept.
        </p>
        <p>
          If you haven&apos;t received an approved refund in that time, contact Nestly Support with your order number. Contacting your bank to reverse a
          Nestly payment while we are handling your request may delay it.
        </p>
      </>
    ),
  },
  {
    id: "live",
    heading: "Live selling",
    body: (
      <p>
        Sellers can host live video sales on Nestly. Anyone with the link can watch a short preview; you need a free account to keep watching, chat
        and buy. Orders placed during a live are normal Nestly orders, with the same checkout, delivery code, returns and refunds. A live-only price
        applies only to orders placed during the live and for 30 minutes after it ends. Keep the chat respectful - sellers can remove messages and block
        people from chatting, and Nestly may end a live that breaks these Terms. Lives aren&apos;t recorded by Nestly, but chat messages are kept with the
        live.
      </p>
    ),
  },
  {
    id: "fees",
    heading: "Fees",
    body: (
      <p>
        Creating an account and buying on Nestly is free; you pay only what you see at checkout. Sellers pay Nestly a commission on their sales, as set
        out in the <Link href="/seller-terms#fees">Seller Agreement</Link>.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Our responsibility to you",
    body: (
      <>
        <p>
          We work hard to keep Nestly available and secure, but it is provided &ldquo;as is&rdquo; and may sometimes be unavailable. To the extent the law
          allows, Nestly is not liable for indirect or unforeseeable losses, for the acts of buyers, sellers or other users, or for the products sellers
          supply. Where we are liable, our total liability for a purchase is limited to the amount you paid for it on Nestly.
        </p>
        <p>
          Nothing in these Terms limits your rights under Nigerian consumer protection law, including the Federal Competition and Consumer Protection
          Act, or any liability that can&apos;t legally be limited.
        </p>
      </>
    ),
  },
  {
    id: "disputes",
    heading: "Complaints and disputes",
    body: (
      <>
        <p>
          If something goes wrong, contact Nestly Support first; most issues are resolved quickly. If you are not satisfied, you can escalate your
          complaint to the Federal Competition and Consumer Protection Commission (FCCPC).
        </p>
        <p>These Terms are governed by the laws of the Federal Republic of Nigeria, and Nigerian courts have jurisdiction over disputes.</p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to Nestly and these Terms",
    body: (
      <p>
        We may update Nestly and these Terms. If a change is significant, we will tell you in the app or by email before it takes effect. Continuing to
        use Nestly after that means you accept the updated Terms.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact us",
    body: (
      <p>
        Nestly Support: WhatsApp <a href={LEGAL_WHATSAPP_URL}>{LEGAL_WHATSAPP_DISPLAY}</a> or email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Terms of Service"
      intro={
        <p>
          The short version: be kind, be honest, only sell what you&apos;re allowed to, pay through Nestly, and keep your delivery code until your order is
          in your hands. The full terms are below.
        </p>
      }
      sections={sections}
    />
  );
}
