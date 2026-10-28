import type { Metadata } from "next";
import Link from "next/link";

import LegalDocument, { LegalSection } from "@/src/components/legal/legal-document";
import CookieSettingsLink from "@/src/components/consent/cookie-settings-link";
import { LEGAL_EMAIL, OPERATED_BY, LEGAL_WHATSAPP_DISPLAY, LEGAL_WHATSAPP_URL, MIN_AGE } from "@/src/lib/legal";
import { OG_IMAGE } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What personal data Nestly collects, why, who we share it with, and your rights under the Nigeria Data Protection Act 2023.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Nestly Privacy Policy", url: "/privacy", images: [OG_IMAGE] },
};

const sections: LegalSection[] = [
  {
    id: "who",
    heading: "Who we are",
    body: (
      <p>
        Nestly{OPERATED_BY}, based in Nigeria, is the data controller for the personal data described here. This policy follows the
        Nigeria Data Protection Act 2023 (NDPA). Questions or requests: email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> (marked
        &ldquo;Data protection&rdquo;) or WhatsApp <a href={LEGAL_WHATSAPP_URL}>{LEGAL_WHATSAPP_DISPLAY}</a>.
      </p>
    ),
  },
  {
    id: "collect",
    heading: "What we collect",
    body: (
      <>
        <p><strong>Your account and profile:</strong> name, email address, password (stored only as a secure hash), and optionally a username, profile and cover photos, bio, location, occupation, company, education, website, social links, skills, interests, languages and date of birth.</p>
        <p><strong>What you share:</strong> posts, stories, comments, likes, messages, communities and events you join or create, reviews, reports, and who you follow or block.</p>
        <p><strong>Shopping:</strong> delivery addresses (including a contact phone number), cart, saved items, orders, delivery codes, delivery confirmations, returns, and coupons used. Card details are entered on Paystack&apos;s secure checkout; Nestly never sees or stores your full card number.</p>
        <p><strong>Selling:</strong> your seller application (including a CAC number if you give one), store details, products, delivery zones and pickup address, and the bank account you want to be paid into.</p>
        <p><strong>Location (optional):</strong> if you tap &ldquo;detect my location&rdquo; when setting up delivery zones, your device&apos;s approximate coordinates are used once to suggest your state and areas.</p>
        <p><strong>Technical data:</strong> the IP address and device/browser type of each login session (so you can see and sign out of your sessions), and which profiles and stores were viewed (used for view counts and store analytics).</p>
      </>
    ),
  },
  {
    id: "use",
    heading: "Why we use it",
    body: (
      <>
        <ul>
          <li><strong>To provide Nestly</strong> (contract): running your account, feed, messages, communities, events and the marketplace, taking orders and payments, and paying sellers.</li>
          <li><strong>To keep Nestly safe</strong> (legitimate interests and legal obligation): verifying sellers, preventing fraud and abuse, handling reports, protecting accounts and resolving disputes.</li>
          <li><strong>To keep you informed</strong> (contract and legitimate interests): emails and in-app notifications about your account, orders, deliveries, payouts, fee changes and birthdays of people you follow. You can turn notification types off in Settings.</li>
          <li><strong>To meet the law</strong> (legal obligation): keeping transaction records for tax and accounting, and responding to lawful requests.</li>
          <li><strong>Optional features</strong> (consent): your date of birth and detected location are only used because you chose to give them, and you can remove them.</li>
          <li><strong>Advertising Nestly</strong> (consent): only if you allow advertising cookies - see <a href="#cookies">Cookies</a>.</li>
        </ul>
        <p>We do not sell your personal data, and we do not show third-party advertising on Nestly.</p>
      </>
    ),
  },
  {
    id: "visible",
    heading: "What other people can see",
    body: (
      <ul>
        <li>Your public profile (name, username, photos, bio and the profile details you add), your posts and your follower counts are visible to other users.</li>
        <li><strong>Your date of birth is never shown.</strong> People who follow you only see the day and month of your birthday, in their reminders. Your age stays private.</li>
        <li>When you buy, the seller sees your name, the delivery address for that order and the items ordered - and, for delivery orders, the phone number you give at checkout, so they can call you to deliver (it&apos;s removed from their view once your items are delivered). Sellers never see your email address, delivery code or payment details. Sellers&apos; email addresses and phone numbers aren&apos;t shown to buyers, and in chats with sellers phone numbers, emails and social media handles are hidden automatically, so you talk and pay through Nestly.</li>
        <li>Messages are visible only to the people in the conversation, and to Nestly when investigating a report.</li>
      </ul>
    ),
  },
  {
    id: "share",
    heading: "Who we share data with",
    body: (
      <>
        <p>We use trusted service providers who process data only on our instructions:</p>
        <ul>
          <li><strong>Paystack</strong> - payments, refunds and seller payouts (including sellers&apos; bank details).</li>
          <li><strong>Resend</strong> - sending emails.</li>
          <li><strong>Cloudinary</strong> - storing and serving the photos you upload.</li>
          <li><strong>Supabase</strong> - our database; <strong>Render</strong> and <strong>Vercel</strong> - hosting the Nestly app and API.</li>
          <li><strong>Vercel Web Analytics</strong> - anonymous visit counts (which pages are viewed, the referring site, and country and device type) so we know how people find Nestly. It uses no cookies and doesn&apos;t identify you.</li>
          <li><strong>Google</strong> - only if you choose Continue with Google: Google confirms your name, email address and profile photo to us.</li>
          <li><strong>Meta, TikTok and Google (advertising)</strong> - only if you allow advertising cookies: their tags record which public Nestly pages you visit and whether you create an account, so we can show Nestly ads to people who visited and see which ads work. They never see account pages such as your orders, messages or settings.</li>
          <li><strong>OpenStreetMap (Nominatim)</strong> - turning detected coordinates into a state and area name, only when you use location detection.</li>
          <li><strong>Verification</strong> - we may check a seller&apos;s CAC number against the Corporate Affairs Commission&apos;s public register.</li>
        </ul>
        <p>We also share data when the law requires it, to protect people from harm or fraud, or as part of a sale or reorganisation of Nestly (with this policy continuing to apply).</p>
      </>
    ),
  },
  {
    id: "transfers",
    heading: "International transfers",
    body: (
      <p>
        Some of our providers store or process data outside Nigeria (for example in Europe or the United States). Where this happens we rely on the
        safeguards allowed by the NDPA, such as the provider&apos;s contractual data protection commitments and security standards.
      </p>
    ),
  },
  {
    id: "retention",
    heading: "How long we keep data",
    body: (
      <>
        <p>We keep your data while your account is open. When you delete your account, sign-in is disabled, your email address is released and your sessions are ended straight away.</p>
        <p>
          Records of orders and payments are kept for as long as Nigerian tax and accounting rules require (generally six years), because buyers, sellers
          and payment providers rely on them. You can ask us to erase or anonymise any other remaining personal data after deleting your account.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    heading: "Your rights",
    body: (
      <>
        <p>Under the NDPA you have the right to:</p>
        <ul>
          <li>access the personal data we hold about you and get a copy;</li>
          <li>correct inaccurate data (most of it you can edit yourself in Settings);</li>
          <li>have your data erased, or its use restricted;</li>
          <li>object to processing based on our legitimate interests;</li>
          <li>receive your data in a portable format;</li>
          <li>withdraw consent at any time (for example removing your date of birth); and</li>
          <li>complain to the Nigeria Data Protection Commission (NDPC).</li>
        </ul>
        <p>To use these rights, contact us as shown above. We will respond within 30 days and may need to confirm your identity first.</p>
      </>
    ),
  },
  {
    id: "security",
    heading: "Security",
    body: (
      <p>
        Data is sent over encrypted connections (HTTPS), passwords are hashed, payments are handled by Paystack, and access to personal data is
        restricted to people who need it. You can protect your account further with two-factor authentication and by reviewing your active sessions.
        If a breach is likely to put you at risk, we will notify the NDPC within 72 hours and tell you without undue delay.
      </p>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies and local storage",
    body: (
      <>
        <p>
          Nestly uses one essential cookie to keep you signed in securely, and your browser&apos;s local storage for small preferences such as light or
          dark mode, dismissed prompts and your cookie choice. Our visit counts are cookieless and anonymous.
        </p>
        <p>
          <strong>Advertising cookies</strong> (Meta Pixel, TikTok Pixel and the Google Ads tag) are only used if you say yes in our cookie banner. They
          let us show Nestly ads on Facebook, Instagram, TikTok and Google to people who have visited Nestly, and count sign-ups that came from those
          ads. They only run on public pages - never your orders, messages or settings. Saying no changes nothing on Nestly. You can change your mind
          at any time with &quot;Cookie settings&quot;; we ask again after a year.
        </p>
        <p>
          <CookieSettingsLink className="font-medium text-violet-700 underline underline-offset-2 dark:text-violet-300" />
        </p>
      </>
    ),
  },
  {
    id: "children",
    heading: "Children",
    body: (
      <p>
        Nestly is not for children under {MIN_AGE}. If you believe a child under {MIN_AGE} has an account, contact us and we will delete it. Users under 18
        may only buy or sell with a parent or guardian&apos;s permission (see the <Link href="/terms#eligibility">Terms of Service</Link>).
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: <p>We will update this page when our practices change and tell you in the app or by email about significant changes.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Privacy Policy"
      intro={
        <p>
          Nestly only collects what it needs to run your account and the marketplace, never sells your data, and keeps your age private. This page
          explains exactly what we collect, why, who helps us process it, and how you can control it.
        </p>
      }
      sections={sections}
    />
  );
}
