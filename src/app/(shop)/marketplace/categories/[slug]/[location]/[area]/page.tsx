import type { Metadata } from "next";

import CategoryListing, { listingMetadata, pageFrom, resolveListing } from "../../../category-listing";

interface Props {
  params: Promise<{ slug: string; location: string; area: string }>;
  searchParams: Promise<{ page?: string }>;
}

// "Cakes & Pastries in Festac, Lagos"
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug, location, area } = await params;
  return listingMetadata(await resolveListing(slug, location, area), pageFrom((await searchParams).page));
}

export default async function CategoryInAreaPage({ params, searchParams }: Props) {
  const { slug, location, area } = await params;
  return <CategoryListing resolved={await resolveListing(slug, location, area)} page={pageFrom((await searchParams).page)} />;
}
