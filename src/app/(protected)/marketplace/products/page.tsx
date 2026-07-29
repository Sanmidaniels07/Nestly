"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useProducts } from "@/src/hooks/use-products";
import { ProductCondition } from "@/src/types/product";

import ProductsHeader from "./components/products-header";
import ProductsToolbar from "./components/products-toolbar";
import ProductsGrid from "./components/products-grid";
import ActiveFilters from "./components/active-filters";
import AdvancedFilterDrawer from "./components/advance-filter-drawer";
import FilterSection from "./components/filter-section";
import PriceFilter from "./components/filters/price-filter";
import ConditionFilter from "./components/filters/condition-filters";
import BrandFilter from "./components/filters/brand-filter";
import FilterFooter from "./components/filters/draw-footer";
import Pagination from "@/src/components/ui/pagination";
import { CardGridSkeleton } from "@/src/components/skeletons/card-grid-skeleton";

type Filters = {
  priceMin: string;
  priceMax: string;
  condition: "All" | ProductCondition;
  brand: string;
};

const defaultFilters: Filters = {
  priceMin: "",
  priceMax: "",
  condition: "All",
  brand: "",
};

function ProductsPageContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const updateSort = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const updateFilters = (value: Filters) => {
    setFilters(value);
    setPage(1);
  };

  const { data, isLoading, isError } = useProducts({
    page,
    limit: 12,
    search: search.trim() || undefined,
    category: category !== "All" ? category : undefined,
    sort: sort as "newest" | "oldest" | "price_asc" | "price_desc",
    minPrice: filters.priceMin ? Number(filters.priceMin) : undefined,
    maxPrice: filters.priceMax ? Number(filters.priceMax) : undefined,
    condition: filters.condition !== "All" ? filters.condition : undefined,
    brand: filters.brand.trim() || undefined,
  });

  const activeFilterCount = [
    filters.priceMin,
    filters.priceMax,
    filters.condition !== "All",
    filters.brand,
  ].filter(Boolean).length;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="mx-auto max-w-[1600px] space-y-8 px-5 py-8 lg:px-8">
        <ProductsHeader />

        <ProductsToolbar
          search={search}
          onSearchChange={updateSearch}
          category={category}
          onCategoryChange={updateCategory}
          sort={sort}
          onSortChange={updateSort}
          onOpenFilters={() => setFiltersOpen(true)}
        />

        <ActiveFilters
          search={search}
          category={category}
          sort={sort === "newest" ? "Newest" : sort}
          onClearSearch={() => updateSearch("")}
          onClearCategory={() => updateCategory("All")}
          onResetSort={() => updateSort("newest")}
        />

        {isLoading && <CardGridSkeleton count={12} />}

        {isError && (
          <div className="rounded-2xl border border-[#ECE9F6] bg-white py-16 text-center text-[13.5px] text-red-500">
            Couldn&apos;t load products. Please try again.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <ProductsGrid products={data?.products ?? []} />

            {data && (
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      <AdvancedFilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)}>
        <FilterSection title="Price">
          <PriceFilter
            min={filters.priceMin}
            max={filters.priceMax}
            onMinChange={(value) => updateFilters({ ...filters, priceMin: value })}
            onMaxChange={(value) => updateFilters({ ...filters, priceMax: value })}
          />
        </FilterSection>

        <FilterSection title="Condition">
          <ConditionFilter
            value={filters.condition}
            onChange={(value) => updateFilters({ ...filters, condition: value })}
          />
        </FilterSection>

        <FilterSection title="Brand">
          <BrandFilter
            value={filters.brand}
            onChange={(value) => updateFilters({ ...filters, brand: value })}
          />
        </FilterSection>

        <FilterFooter
          onReset={() => updateFilters(defaultFilters)}
          onApply={() => setFiltersOpen(false)}
          activeCount={activeFilterCount}
        />
      </AdvancedFilterDrawer>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
          <CardGridSkeleton count={12} />
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
