import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { NotFoundError, serverGet } from "@/src/lib/server-api";
import { STORE_SLUG } from "@/src/lib/store-link";

interface Props {
  params: Promise<{ store: string }>;
}

// The store short link sellers share: nestlyapp.site/{slug}. Every page of
// the site with its own name (/login, /feed...) wins over this one; any
// other name is looked up as a store - its current name or one it had
// before a rename - and opens the store page, tagged with the store's
// referral code so buyers who join through it count as the seller's.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default async function StoreShortLink({ params }: Props) {
  const slug = decodeURIComponent((await params).store).toLowerCase();
  if (!STORE_SLUG.test(slug) || slug.length > 120) notFound();

  let link: Awaited<ReturnType<typeof serverGet<{ slug: string; referralCode: string | null }>>>;
  try {
    link = await serverGet<{ slug: string; referralCode: string | null }>(`/stores/${slug}/link`, 60);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
  // API unreachable: the store page tries again in the browser.
  if (!link) redirect(`/marketplace/seller/${slug}`);

  const { slug: current, referralCode } = link.data;
  redirect(`/marketplace/seller/${current}${referralCode ? `?ref=${encodeURIComponent(referralCode)}` : ""}`);
}
