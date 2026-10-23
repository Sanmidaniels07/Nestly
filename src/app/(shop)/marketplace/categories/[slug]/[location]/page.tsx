import type { Metadata } from "next";

import CategoryListing, { listingMetadata, pageFrom, resolveListing } from "../../category-listing";

interface Props {
  params: Promise<{ slug: string; location: string }>;
  searchParams: Promise<{ page?: string }>;
}

// "Cakes & Pastries in Lagos"
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug, location } = await params;
  return listingMetadata(await resolveListing(slug, location), pageFrom((await searchParams).page));
}

export default async function CategoryInStatePage({ params, searchParams }: Props) {
  const { slug, location } = await params;
  return <CategoryListing resolved={await resolveListing(slug, location)} page={pageFrom((await searchParams).page)} />;
}
