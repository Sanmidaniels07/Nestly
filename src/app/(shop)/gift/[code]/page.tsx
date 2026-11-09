import type { Metadata } from "next";

import { NotFoundError, serverGet } from "@/src/lib/server-api";
import { OG_IMAGE, SITE_NAME } from "@/src/lib/site";
import { Gift } from "@/src/types/gift";
import GiftPage from "./gift-page";

interface Props {
  params: Promise<{ code: string }>;
}

const loadGift = async (code: string) => {
  try {
    return await serverGet<Gift>(`/gifts/${encodeURIComponent(code)}`, 30);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
};

// Shared on WhatsApp: the preview says who it's from, never what it is -
// the gift stays a surprise until it's opened. Never indexed.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const response = await loadGift(code).catch(() => null);
  const robots = { index: false, follow: false };
  if (!response) return { title: "A gift for you", robots };

  const gift = response.data;
  const title = `🎁 ${gift.sender.name} sent ${gift.recipientName} a gift`;
  const description = `Open it on ${SITE_NAME} to see what it is and tell us where to deliver it.`;

  return {
    title,
    description,
    robots,
    openGraph: { title, description, url: `/gift/${gift.code}`, type: "website", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

export default async function GiftLinkPage({ params }: Props) {
  const { code } = await params;
  return <GiftPage code={code} />;
}
