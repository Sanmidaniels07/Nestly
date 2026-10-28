import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

import CategoryCard from "@/src/app/(protected)/marketplace/components/category-card";
import { serverGet } from "@/src/lib/server-api";
import { stateLabel } from "@/src/lib/locations";
import { OG_IMAGE, SITE_NAME } from "@/src/lib/site";
import { Catalogue } from "@/src/types/catalogue";
import { categoryPath } from "./category-listing";

const title = "Shop by category";
const description = `Browse everything sold on ${SITE_NAME} - cakes, food, fashion, electronics and more from trusted local sellers across Nigeria, with secure Paystack checkout.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/marketplace/categories" },
  openGraph: { title: `${title} · ${SITE_NAME}`, description, url: "/marketplace/categories", type: "website", images: [OG_IMAGE] },
};

// Public hub linking every category page, and each state's categories.
export default async function CategoriesPage() {
  const catalogue = (await serverGet<Catalogue>("/seo/catalogue", 900).catch(() => null))?.data;
  const categories = catalogue?.categories ?? [];

  // Categories with listings first, then the rest.
  const sorted = [...categories].sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name));

  // State -> its categories with listings.
  const byState = new Map<string, { slug: string; name: string; count: number }[]>();
  for (const category of categories) {
    for (const state of category.states) {
      const list = byState.get(state.name) ?? [];
      list.push({ slug: category.slug, name: category.name, count: state.productCount });
      byState.set(state.name, list);
    }
  }
  const states = Array.from(byState, ([name, list]) => ({
    name,
    total: list.reduce((sum, c) => sum + c.count, 0),
    categories: list.sort((a, b) => b.count - a.count),
  })).sort((a, b) => b.total - a.total);

  return (
    <div className="mx-auto max-w-[1600px] space-y-10 px-1 py-6 sm:px-3 lg:px-4">
      <header>
        <p className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Marketplace
        </p>
        <h1 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[36px] italic text-ink sm:text-[42px]">All categories</h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-muted">{description}</p>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface py-16 text-center text-[13.5px] text-subtle">
          Categories are loading slowly - please refresh in a moment.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((category) => (
            <CategoryCard
              key={category.slug}
              category={{ id: category.slug, name: category.name, slug: category.slug, icon: category.icon, productCount: category.productCount, commissionRate: 0 }}
            />
          ))}
        </div>
      )}

      {states.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-[family-name:var(--font-fraunces)] text-[24px] italic text-ink">Shop by state</h2>
            <Link href="/marketplace/locations" className="text-[13px] font-medium text-violet-700 hover:underline dark:text-violet-300">
              Shop by area (Lekki, Ikeja, Wuse…) →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {states.map((state) => (
              <div key={state.name} className="rounded-2xl border border-line bg-surface p-5">
                <p className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
                  <MapPin size={15} className="text-violet-600 dark:text-violet-400" />
                  {stateLabel(state.name)}
                  <span className="font-[family-name:var(--font-mono)] text-[12px] font-normal text-subtle">{state.total} listings</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {state.categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={categoryPath(category.slug, state.name)}
                      className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
                    >
                      {category.name} in {stateLabel(state.name)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
