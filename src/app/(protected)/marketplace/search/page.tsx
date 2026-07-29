"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";

import { useProducts } from "@/src/hooks/use-products";
import Input from "@/src/components/ui/input";
import Pagination from "@/src/components/ui/pagination";
import ProductCard from "../components/product-card";
import { CardGridSkeleton } from "@/src/components/skeletons/card-grid-skeleton";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useProducts({
    search: search.trim() || undefined,
    page,
    limit: 12,
  });

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-5 py-8 lg:px-8">
      <div className="space-y-4">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-violet-600 hover:underline"
        >
          <ArrowLeft size={15} />
          Back to marketplace
        </Link>

        <h1 className="font-[family-name:var(--font-fraunces)] text-[36px] italic text-[#13131A] sm:text-[42px]">
          Search products
        </h1>
      </div>

      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search for anything..."
        icon={<Search size={16} />}
      />

      {isLoading && (
        <CardGridSkeleton count={12} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
      )}

      {isError && (
        <div className="rounded-2xl border border-[#ECE9F6] bg-white py-16 text-center text-[13.5px] text-red-500">
          Couldn&apos;t load results. Please try again.
        </div>
      )}

      {!isLoading && !isError && data?.products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] py-16 text-center">
          <p className="text-[13.5px] text-[#94A3B8]">
            {search ? "No products match your search." : "Start typing to search products."}
          </p>
        </div>
      )}

      {!isLoading && !isError && !!data?.products.length && (
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
          <CardGridSkeleton count={12} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
