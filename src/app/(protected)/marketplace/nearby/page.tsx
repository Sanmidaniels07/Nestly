"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

import { useNearbyProducts } from "@/src/hooks/use-nearby-products";
import Input from "@/src/components/ui/input";
import Pagination from "@/src/components/ui/pagination";
import ProductCard from "../components/product-card";
import { CardGridSkeleton } from "@/src/components/skeletons/card-grid-skeleton";

export default function NearbyPage() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useNearbyProducts({
    city: city.trim() || undefined,
    state: state.trim() || undefined,
    page,
    limit: 12,
  });

  const hasQuery = !!(city.trim() || state.trim());

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-5 py-8 lg:px-8">
      <div className="space-y-4">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-violet-600 dark:text-violet-400 hover:underline"
        >
          <ArrowLeft size={15} />
          Back to marketplace
        </Link>

        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
            Marketplace
          </p>
          <h1 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[36px] italic text-ink sm:text-[42px]">
            Nearby products
          </h1>
          <p className="mt-2 max-w-xl text-[14px] text-muted">
            Tell us your city or state to find products from sellers near you.
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2">
        <Input
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setPage(1);
          }}
          placeholder="City, e.g. Lagos"
          icon={<MapPin size={16} />}
        />
        <Input
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setPage(1);
          }}
          placeholder="State, e.g. Lagos State"
          icon={<MapPin size={16} />}
        />
      </div>

      {!hasQuery && (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken py-16 text-center">
          <p className="text-[13.5px] text-subtle">
            Enter a city or state to see nearby products.
          </p>
        </div>
      )}

      {hasQuery && isLoading && (
        <CardGridSkeleton count={8} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
      )}

      {hasQuery && isError && (
        <div className="rounded-2xl border border-line bg-surface py-16 text-center text-[13.5px] text-red-500">
          Couldn&apos;t load nearby products. Please try again.
        </div>
      )}

      {hasQuery && !isLoading && !isError && data?.products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken py-16 text-center">
          <p className="text-[13.5px] text-subtle">
            No products found near that location.
          </p>
        </div>
      )}

      {hasQuery && !isLoading && !isError && !!data?.products.length && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
