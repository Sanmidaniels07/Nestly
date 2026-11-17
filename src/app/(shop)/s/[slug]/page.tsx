import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, PackageCheck, ShieldCheck, Store, Truck, Wallet } from "lucide-react";

import { NotFoundError, serverGet } from "@/src/lib/server-api";
import { SITE_NAME } from "@/src/lib/site";
import { stateLabel } from "@/src/lib/locations";
import { TRUST_LEVEL, trustSummary } from "@/src/lib/trust";
import { StoreTrust } from "@/src/types/trust";
import TrustRecord from "@/src/components/trust/trust-record";

interface Props {
  params: Promise<{ slug: string }>;
}

// nestlyapp.site/s/{slug} - the link a seller puts in their Instagram or
// WhatsApp bio: who they are and their track record on Nestly, with a way
// to shop them. Short on purpose, and indexable, so searching a seller's
// name can find their record.

const loadTrust = async (slug: string) => {
  try {
    return await serverGet<StoreTrust>(`/stores/${encodeURIComponent(slug)}/trust`, 600);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const response = await loadTrust(slug).catch(() => null);
  if (!response) return { title: "Seller on Nestly" };
  const trust = response.data;
  const title = `${trust.store.name} on ${SITE_NAME} – ${TRUST_LEVEL[trust.level].label}`;
  const description = `${trustSummary(trust)}. Pay ${trust.store.name} through ${SITE_NAME}: your money is held until you receive your order.`;
  return {
    title,
    description,
    alternates: { canonical: `/s/${trust.store.slug}` },
    openGraph: { title, description, url: `/s/${trust.store.slug}`, type: "profile" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TrustPage({ params }: Props) {
  const { slug } = await params;
  const response = await loadTrust(slug).catch(() => null);
  if (!response) notFound();
  const trust = response.data;
  const location = [...new Set([trust.store.city, trust.store.state ? stateLabel(trust.store.state) : null].filter(Boolean))].join(", ");

  const steps = [
    { icon: Wallet, text: "You pay Nestly, not the seller directly." },
    { icon: Truck, text: "The seller delivers and you get a delivery code." },
    { icon: PackageCheck, text: "The seller is paid only after you have your order." },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 pb-20 pt-6 sm:pt-10">
      <header className="flex items-center gap-4">
        <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-violet-700 ring-4 ring-surface dark:bg-violet-500/15 dark:text-violet-300">
          {trust.store.logo ? <Image src={trust.store.logo} alt="" fill sizes="64px" className="object-cover" priority /> : <Store size={26} />}
        </span>
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-mono)] text-[11.5px] font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Seller on {SITE_NAME}
          </p>
          <h1 className="truncate font-[family-name:var(--font-fraunces)] text-[28px] leading-tight text-ink">{trust.store.name}</h1>
          {location && (
            <p className="flex items-center gap-1 text-[13px] text-muted">
              <MapPin size={13} /> {location}
            </p>
          )}
        </div>
      </header>

      <TrustRecord slug={trust.store.slug} initial={response} />

      <Link
        href={`/marketplace/seller/${trust.store.slug}`}
        className="whitespace-nowrap flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[14px] font-semibold text-white transition-all hover:brightness-110"
      >
        <Store size={16} /> Shop {trust.store.name}
      </Link>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/5">
        <h2 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
          <ShieldCheck size={17} className="text-emerald-600" /> Buying from {trust.store.name} on Nestly
        </h2>
        <ul className="mt-3 space-y-2">
          {steps.map((step) => (
            <li key={step.text} className="flex items-start gap-2.5 text-[13px] text-ink-2">
              <step.icon size={15} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" /> {step.text}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-muted">
          If they send you a Nestly payment link, you&apos;re protected the same way. Never pay a seller directly by bank transfer for a Nestly order.
        </p>
      </section>
    </div>
  );
}
