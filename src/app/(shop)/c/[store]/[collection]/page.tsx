import type { Metadata } from "next";

import { NotFoundError, serverGet } from "@/src/lib/server-api";
import { OG_IMAGE, SITE_NAME } from "@/src/lib/site";
import { ApiResponse } from "@/src/types/api";
import { PublicCollection } from "@/src/types/collection";
import CollectionPage from "./collection-page";

interface Props {
  params: Promise<{ store: string; collection: string }>;
}

// Short cache - stock and what's in the collection change. The page
// refetches in the browser anyway.
const loadCollection = async (store: string, slug: string): Promise<ApiResponse<PublicCollection> | null> => {
  try {
    return await serverGet<PublicCollection>(`/collections/${encodeURIComponent(store)}/${encodeURIComponent(slug)}`, 30);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
};

// Shared on WhatsApp and Instagram, so the preview shows the collection's
// name, the store and the first product photo.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store, collection } = await params;
  const response = await loadCollection(store, collection).catch(() => null);
  if (!response) return { title: "Collection", robots: { index: false, follow: false } };

  const data = response.data;
  const title = `${data.name} – ${data.store.name}`;
  const count = data.products.length;
  const description =
    data.description ||
    `${count} item${count === 1 ? "" : "s"} from ${data.store.name}. Pick what you want and pay once on ${SITE_NAME} - your money is held until you get your order.`;
  const cover = data.products[0]?.images[0]?.url;
  const url = `/c/${data.store.slug}/${data.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images: cover ? [{ url: cover, alt: data.name }] : [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: cover ? [cover] : [OG_IMAGE.url] },
  };
}

export default async function Page({ params }: Props) {
  const { store, collection } = await params;
  const response = await loadCollection(store, collection);
  return <CollectionPage store={store} slug={collection} initial={response ?? undefined} />;
}
