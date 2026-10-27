import type { Metadata } from "next";

import { NotFoundError, serverGet } from "@/src/lib/server-api";
import { OG_IMAGE, SITE_NAME } from "@/src/lib/site";
import { naira } from "@/src/lib/payment-link";
import { PublicPaymentLink } from "@/src/types/payment-link";
import PayLinkPage from "./pay-link-page";

interface Props {
  params: Promise<{ code: string }>;
}

// Short cache - availability changes when someone pays. The page refetches
// in the browser anyway.
const loadLink = async (code: string) => {
  try {
    return await serverGet<PublicPaymentLink>(`/payment-links/${encodeURIComponent(code)}`, 30);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
};

// Shared in DMs and WhatsApp, so the preview carries the item, price and
// the protection promise. Never indexed - links are private deals.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const response = await loadLink(code).catch(() => null);
  const robots = { index: false, follow: false };
  if (!response) return { title: "Payment link", robots };

  const link = response.data;
  const title = `Pay ${naira(link.price)} – ${link.title}`;
  const description = `Sold by ${link.store.name}. Pay securely on ${SITE_NAME}: your money is held until you receive your order.`;
  const cover = link.images.find((image) => image.isPrimary)?.url ?? link.images[0]?.url;

  return {
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      url: `/pay/${link.code}`,
      type: "website",
      images: cover ? [{ url: cover, alt: link.title }] : [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: cover ? [cover] : [OG_IMAGE.url] },
  };
}

export default async function PayPage({ params }: Props) {
  const { code } = await params;
  const response = await loadLink(code).catch(() => null);

  return <PayLinkPage code={code} initialLink={response ?? undefined} />;
}
