import type { Metadata } from "next";

import CategoryListing, { listingMetadata, pageFrom, resolveListing } from "../category-listing";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// "Cakes & Pastries in Nigeria"
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  return listingMetadata(await resolveListing(slug), pageFrom((await searchParams).page));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  return <CategoryListing resolved={await resolveListing(slug)} page={pageFrom((await searchParams).page)} />;
}
