"use client";

import { Fragment, Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronDown, MapPin } from "lucide-react";

import { useGoBack } from "@/src/hooks/use-go-back";
import { useAddresses } from "@/src/hooks/use-addresses";
import { useCategories } from "@/src/hooks/use-categories";
import { useNearbyProducts } from "@/src/hooks/use-nearby-products";
import { stateLabel } from "@/src/lib/locations";
import Pagination from "@/src/components/ui/pagination";
import { CardGridSkeleton } from "@/src/components/skeletons/card-grid-skeleton";
import { NearbyPlace } from "@/src/types/location";
import { NearbyProduct, NearbyProductsResult, NearbyTier } from "@/src/types/product";
import ProductCard from "../components/product-card";
import LocationPicker from "./location-picker";

// The buyer's last place, so "Shop near you" opens where they shop.
const SAVED_KEY = "nestly:nearby-place";

const readSaved = (): NearbyPlace | null => {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_KEY) ?? "null");
    return saved && typeof saved.state === "string" ? saved : null;
  } catch {
    return null;
  }
};

const save = (place: NearbyPlace) => {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(place));
  } catch {
    // Storage blocked - the place still applies for this visit.
  }
};

const money = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

type Location = NearbyProductsResult["location"];

// Section headings, closest first.
const tierHeading = (tier: NearbyTier, location: Location) => {
  const here = location.area ?? location.city ?? stateLabel(location.state);
  switch (tier) {
    case "AREA":
      return { title: `In ${here}`, hint: "Sellers based in your area" };
    case "DELIVERS":
      return { title: `Delivers to ${here}`, hint: "Sellers nearby with delivery to you" };
    case "CITY":
      return location.area
        ? { title: `Elsewhere in ${location.city}`, hint: "Sellers in your city" }
        : { title: `In ${location.city}`, hint: "Sellers based in your city" };
    case "STATE":
      return location.area || location.city
        ? { title: `Elsewhere in ${stateLabel(location.state)}`, hint: "Ask the seller about delivery to you" }
        : { title: `In ${stateLabel(location.state)}`, hint: "Sellers in your state" };
  }
};

const deliveryNote = (product: NearbyProduct, location: Location) => {
  const fee = product.nearby.deliveryFee;
  if (fee === null) return undefined;
  const price = fee === 0 ? "free" : money(fee);
  return product.nearby.tier === "AREA"
    ? `Delivers in ${location.area} · ${price}`
    : `Delivers to ${location.area ?? location.city} · ${price}`;
};

function NearbyContent() {
  // Back to wherever the user came from; /marketplace if they landed here directly.
  const goBack = useGoBack("/marketplace");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // The place lives in the URL, so Back from a product returns to the same results.
  const place = {
    state: params.get("state") ?? undefined,
    city: params.get("city") ?? undefined,
    area: params.get("area") ?? undefined,
  };
  const category = params.get("category") ?? undefined;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const hasPlace = !!(place.state || place.city || place.area);

  const [picking, setPicking] = useState(false);
  const { data: addresses, isFetched: addressesLoaded } = useAddresses();
  const { data: categories } = useCategories();
  const { data, isLoading, isError, isFetching, error } = useNearbyProducts({ ...place, category, page, limit: 12 });

  const setQuery = (next: Record<string, string | null | undefined>) => {
    const query = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) query.set(key, value);
      else query.delete(key);
    }
    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  };

  const pick = (next: NearbyPlace) => {
    save(next);
    setPicking(false);
    setQuery({ state: next.state, city: next.city, area: next.area, page: null });
  };

  // No place in the URL: use the last one, else the default delivery address, else ask.
  useEffect(() => {
    if (hasPlace) return;
    const saved = readSaved();
    if (saved) {
      setQuery({ state: saved.state, city: saved.city, area: saved.area });
      return;
    }
    if (!addressesLoaded) return;
    const address = addresses?.find((a) => a.isDefault) ?? addresses?.[0];
    if (address?.state) setQuery({ state: address.state, city: address.city });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPlace, addressesLoaded]);

  // Remember the place as the server understood it ("festac" -> "Festac, Lagos").
  useEffect(() => {
    if (data?.location) save(data.location);
  }, [data?.location]);

  const location = data?.location;
  const products = data?.products ?? [];
  const label = location?.label ?? [place.area, place.city, place.state].filter(Boolean).join(", ");
  const notFound = isError && (error as { response?: { status?: number } })?.response?.status === 404;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-5 py-8 lg:px-8">
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => goBack()}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-violet-600 dark:text-violet-400 hover:underline"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
            Marketplace
          </p>
          <h1 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[36px] text-ink sm:text-[42px]">
            Shop near you
          </h1>
          <p className="mt-2 max-w-xl text-[14px] text-muted">
            Sellers in your area come first, then sellers who deliver to you, then the rest of your city and state.
          </p>
        </div>
      </div>

      {/* Where the buyer is shopping */}
      <div className="max-w-2xl">
        {picking || !hasPlace ? (
          <LocationPicker onPick={pick} onClose={hasPlace ? () => setPicking(false) : undefined} />
        ) : (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 text-left transition-colors hover:border-violet-300 dark:hover:border-violet-500/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <MapPin size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11.5px] text-subtle">Shopping near</span>
              <span className="block truncate text-[15px] font-semibold text-ink">{label}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-violet-600 dark:text-violet-400">
              Change <ChevronDown size={15} />
            </span>
          </button>
        )}
      </div>

      {/* Category filter */}
      {hasPlace && !!categories?.length && (
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          {[{ slug: "", name: "All" }, ...categories].map((c) => {
            const active = (category ?? "") === c.slug;
            return (
              <button
                key={c.slug || "all"}
                type="button"
                onClick={() => setQuery({ category: c.slug || null, page: null })}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                  active
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-line bg-surface text-muted hover:border-violet-300 hover:text-ink"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      {hasPlace && isLoading && <CardGridSkeleton count={8} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />}

      {hasPlace && isError && (
        <div className="rounded-2xl border border-line bg-surface py-16 text-center">
          <p className="text-[13.5px] text-muted">
            {notFound ? "We couldn't find that place. Try your area, city or state." : "Couldn't load products near you. Please try again."}
          </p>
          {notFound && (
            <button type="button" onClick={() => setPicking(true)} className="mt-3 text-[13.5px] font-semibold text-violet-600 hover:underline dark:text-violet-400">
              Change location
            </button>
          )}
        </div>
      )}

      {hasPlace && !isLoading && !isError && location && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-6 py-16 text-center">
          <p className="text-[14px] font-medium text-ink">
            {category ? "No products in this category near" : "No sellers near"} {location.label} yet
          </p>
          <p className="mt-1.5 text-[13px] text-subtle">
            {category ? "Try all categories, or another place." : "Try a nearby area or city - new sellers join every week."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {category && (
              <button
                type="button"
                onClick={() => setQuery({ category: null, page: null })}
                className="rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-semibold text-ink hover:border-violet-300"
              >
                All categories
              </button>
            )}
            <button
              type="button"
              onClick={() => setPicking(true)}
              className="rounded-full bg-violet-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-violet-700"
            >
              Change location
            </button>
          </div>
        </div>
      )}

      {hasPlace && !isError && data && location && products.length > 0 && (
        <div className={`space-y-8 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          <p className="text-[13px] text-muted">
            {data.total} product{data.total === 1 ? "" : "s"} near {location.label}
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => {
              const startsGroup = i === 0 || products[i - 1].nearby.tier !== product.nearby.tier;
              const heading = tierHeading(product.nearby.tier, location);
              const count = data.tierCounts[product.nearby.tier] ?? 0;
              return (
                <Fragment key={product.id}>
                  {startsGroup && (
                    <div className={`col-span-full ${i === 0 ? "" : "mt-4"}`}>
                      <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] text-ink">
                        {heading.title}{" "}
                        <span className="font-[family-name:var(--font-mono)] text-[13px] not-italic text-subtle">({count})</span>
                      </h2>
                      <p className="text-[12.5px] text-subtle">{heading.hint}</p>
                    </div>
                  )}
                  <ProductCard product={product} deliveryNote={deliveryNote(product, location)} />
                </Fragment>
              );
            })}
          </div>

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={(next) => {
              setQuery({ page: next > 1 ? String(next) : null });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function NearbyPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8" />}>
      <NearbyContent />
    </Suspense>
  );
}
