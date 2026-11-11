import type { Metadata } from "next";

import { NotFoundError, serverGet } from "@/src/lib/server-api";
import { OG_IMAGE, SITE_NAME } from "@/src/lib/site";
import { PublicLive } from "@/src/types/live";
import LivePage from "./live-page";

interface Props {
  params: Promise<{ code: string }>;
}

// Short cache - status changes when the seller goes live. The page refetches
// in the browser anyway.
const loadLive = async (code: string) => {
  try {
    return await serverGet<PublicLive>(`/lives/${encodeURIComponent(code)}`, 30);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
};

const LAGOS = new Intl.DateTimeFormat("en-NG", {
  timeZone: "Africa/Lagos",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

// Shared on WhatsApp and Instagram, so the preview carries the store, the
// time and the cover photo. Not indexed - lives come and go.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const response = await loadLive(code).catch(() => null);
  const robots = { index: false, follow: true };
  if (!response) return { title: "Live", robots };

  const live = response.data;
  const when = live.status === "LIVE" ? "🔴 Live now" : live.status === "SCHEDULED" ? LAGOS.format(new Date(live.scheduledAt)) : "Live replay of products";
  const title = `${live.store.name} live: ${live.title}`;
  const deals = live.products.some((product) => product.discountPercent) ? " Live-only prices." : "";
  const description = `${when} on ${SITE_NAME}. Watch, ask questions and shop ${live.products.length} product${live.products.length === 1 ? "" : "s"}.${deals}`;
  const cover = live.coverImage ?? live.products.find((product) => product.image)?.image ?? null;

  return {
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      url: `/live/${live.code}`,
      type: "website",
      images: cover ? [{ url: cover, alt: live.title }] : [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: cover ? [cover] : [OG_IMAGE.url] },
  };
}

export default async function LiveRoutePage({ params }: Props) {
  const { code } = await params;
  const response = await loadLive(code).catch(() => null);
  return <LivePage code={code} initialLive={response ?? undefined} />;
}
