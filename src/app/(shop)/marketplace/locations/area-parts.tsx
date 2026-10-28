import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ChevronRight, MapPin, Star, Store } from "lucide-react";

import { serverGet } from "@/src/lib/server-api";
import { areaFromSlug, areaSlug, stateFromSlug, stateSlug } from "@/src/lib/locations";
import { SITE_NAME } from "@/src/lib/site";
import { AreaIndex, AreaSeller, AreaSellers } from "@/src/types/areas";

// Shared by the area pages ("Shop in Festac, Lagos") and the category-in-area
// pages ("Cakes & Pastries in Festac, Lagos"): the sellers serving the area
// and a short FAQ written as plain facts, which search engines and AI
// assistants can quote.

export const areaPath = (state: string, area: string) => `/marketplace/locations/${stateSlug(state)}/${areaSlug(area)}`;

export const loadAreaIndex = async () => (await serverGet<AreaIndex>("/seo/areas", 900).catch(() => null))?.data ?? null;

/** The state and area a URL points at, from the areas that have sellers. */
export const findAreaInIndex = (index: AreaIndex | null, stateParam: string, areaParam: string) => {
  if (!index) return null;
  const state = stateFromSlug(stateParam, index.states.map((s) => s.name));
  const inState = index.states.find((s) => s.name === state);
  const name = inState ? areaFromSlug(areaParam, inState.areas.map((a) => a.name)) : null;
  const area = inState?.areas.find((a) => a.name === name);
  return state && area ? { state, area } : null;
};

export const loadAreaSellers = async (state: string, area: string, category?: string) => {
  const query = new URLSearchParams({ state, area });
  if (category) query.set("category", category);
  return (await serverGet<AreaSellers>(`/seo/areas/sellers?${query}`, 900).catch(() => null))?.data ?? null;
};

const listNames = (names: string[]) =>
  names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

export interface Faq {
  question: string;
  answer: string;
}

/** Questions people ask about buying in an area, answered from the listings. */
export const areaFaq = ({ place, what, sellers }: { place: string; what: string; sellers: AreaSellers | null }): Faq[] => {
  const total = sellers?.total ?? 0;
  const named = (sellers?.sellers ?? []).slice(0, 3).map((s) => s.name);
  const based = (sellers?.sellers ?? []).filter((s) => s.basedHere).length;
  return [
    {
      question: `Where can I buy ${what} in ${place}?`,
      answer: total
        ? `On ${SITE_NAME}, ${total} ${total === 1 ? "seller sells" : "sellers sell"} ${what} to ${place}${named.length ? `, including ${listNames(named)}` : ""}.${based ? ` ${based} of them ${based === 1 ? "is" : "are"} based in ${place.split(",")[0]}.` : ""} You can compare prices, delivery fees and reviews, then order online.`
        : `Sellers on ${SITE_NAME} list ${what} for ${place} - check back soon for new listings.`,
    },
    {
      question: `How do I pay a seller in ${place} on ${SITE_NAME}?`,
      answer: `Checkout runs on Paystack (card, bank transfer or USSD). Your payment is held until you confirm delivery, and card details never reach the seller.`,
    },
    {
      question: `Do sellers deliver in ${place}?`,
      answer: `Each seller sets their own delivery areas and fees. Sellers listed here are based in ${place.split(",")[0]} or deliver there - the delivery fee and pickup options show at checkout.`,
    },
    {
      question: "What if my order doesn't arrive?",
      answer: `You get a delivery code with every order and only hand it over when your order is in your hands. If something is wrong you can ask for a return or refund from your order page.`,
    },
  ];
};

export const faqJsonLd = (faq: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
});

export function FaqSection({ faq }: { faq: Faq[] }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="text-[15px] font-semibold text-ink">Questions shoppers ask</h2>
      <div className="mt-2 divide-y divide-line">
        {faq.map((item) => (
          <details key={item.question} className="group py-3">
            <summary className="cursor-pointer list-none text-[14px] font-medium text-ink-2 marker:hidden group-open:text-violet-700 dark:group-open:text-violet-300">
              {item.question}
            </summary>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function SellerCards({ sellers, title }: { sellers: AreaSellers; title: string }) {
  if (sellers.sellers.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-semibold text-ink">
        {title} <span className="font-[family-name:var(--font-mono)] text-[12px] font-normal text-subtle">{sellers.total}</span>
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sellers.sellers.map((seller) => (
          <SellerCard key={seller.slug} seller={seller} area={sellers.area} />
        ))}
      </div>
    </section>
  );
}

function SellerCard({ seller, area }: { seller: AreaSeller; area: string }) {
  const home = [...new Set([seller.city, seller.state].filter(Boolean))].join(", ");
  return (
    <Link
      href={`/marketplace/seller/${encodeURIComponent(seller.slug)}`}
      className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-violet-300"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-sunken">
        {seller.logo ? <Image src={seller.logo} alt="" fill sizes="48px" className="object-cover" /> : <Store size={20} className="text-faint" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 truncate text-[14px] font-semibold text-ink">
          <span className="truncate">{seller.name}</span>
          {seller.isVerified && <BadgeCheck size={14} className="shrink-0 text-violet-600 dark:text-violet-400" aria-label="Verified" />}
        </span>
        <span className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-muted">
          <MapPin size={11} className="shrink-0" />
          {seller.basedHere ? `Based in ${area}` : home ? `${home} · delivers to ${area}` : `Delivers to ${area}`}
        </span>
        <span className="mt-0.5 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">
          {seller.reviewCount > 0 && (
            <span className="flex items-center gap-0.5">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {seller.rating.toFixed(1)} ({seller.reviewCount})
            </span>
          )}
          <span>
            {seller.productCount} {seller.productCount === 1 ? "listing" : "listings"}
          </span>
        </span>
      </span>
    </Link>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: { name: string; url: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-[13px] scrollbar-hide">
      {crumbs.map((crumb, index) => (
        <span key={crumb.url} className="flex items-center gap-1">
          {index > 0 && <ChevronRight size={13} className="shrink-0 text-faint" />}
          {index === crumbs.length - 1 ? (
            <span className="font-medium text-ink">{crumb.name}</span>
          ) : (
            <Link href={crumb.url} className="text-muted hover:text-violet-700 dark:hover:text-violet-300">
              {crumb.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
