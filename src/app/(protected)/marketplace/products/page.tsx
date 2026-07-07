"use client";

import { useEffect, useMemo, useState } from "react";

import { nearbyProducts } from "@/src/mocks/marketplace";

import ProductsHeader from "./components/products-header";
import ProductsToolbar from "./components/products-toolbar";
import ProductsGrid from "./components/products-grid";
import ActiveFilters from "./components/active-filters";
import AdvancedFilterDrawer from "./components/advance-filter-drawer";
import FilterSection from "./components/filter-section";
import PriceFilter from "./components/filters/price-filter";
import ConditionFilter from "./components/filters/condition-filters";
import RatingFilter from "./components/filters/rating-filter";
import DeliveryFilter from "./components/filters/delivery-filter";
import DistanceFilter from "./components/filters/distance-filter";
import BrandFilter from "./components/filters/brand-filter";
import LocationFilter from "./components/filters/location-filter";
import FilterFooter from "./components/filters/draw-footer";
import Pagination from "@/src/components/ui/pagination";

type Filters = {
  priceMin: string;
  priceMax: string;
  condition: "All" | "New" | "Used";
  delivery: boolean;
  pickup: boolean;
  rating: number;
  distance: string;
  brand: string;
  address: string;
};

const defaultFilters: Filters = {
  priceMin: "",
  priceMax: "",
  condition: "All",
  delivery: false,
  pickup: false,
  rating: 0,
  distance: "Any",
  brand: "All",
  address: "",
};

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sort, setSort] = useState("Newest");

  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let products = [...nearbyProducts];

    if (category !== "All") {
      products = products.filter((product) => product.category === category);
    }

    if (search.trim()) {
      const value = search.toLowerCase();

      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(value) ||
          product.brand.toLowerCase().includes(value),
      );
    }

    // Brand
    if (filters.brand !== "All") {
      products = products.filter((product) => product.brand === filters.brand);
    }

    // Condition
    if (filters.condition !== "All") {
      products = products.filter(
        (product) => product.condition === filters.condition,
      );
    }

    // Delivery
    if (filters.delivery) {
      products = products.filter((product) => product.delivery);
    }

    // Pickup
    if (filters.pickup) {
      products = products.filter((product) => product.pickup);
    }

    // Rating
    if (filters.rating > 0) {
      products = products.filter((product) => product.rating >= filters.rating);
    }

    // Price
    const min = Number(filters.priceMin);
    const max = Number(filters.priceMax);

    if (filters.priceMin !== "" && !Number.isNaN(min)) {
      products = products.filter((product) => product.price >= min);
    }

    if (filters.priceMax !== "" && !Number.isNaN(max)) {
      products = products.filter((product) => product.price <= max);
    }

    // Distance
    if (filters.distance !== "Any") {
      const maxDistance = Number(filters.distance.replace(" km", ""));

      products = products.filter((product) => {
        const sellerDistance = Number(
          product.seller.distance.replace(" km", ""),
        );

        return sellerDistance <= maxDistance;
      });
    }

    switch (sort) {
      case "Price Low":
        products.sort((a, b) => a.price - b.price);
        break;

      case "Price High":
        products.sort((a, b) => b.price - a.price);
        break;

      case "Highest Rated":
        products.sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return products;
  }, [search, category, sort, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort, filters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

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
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          onOpenFilters={() => setFiltersOpen(true)}
        />

        <ActiveFilters
          search={search}
          category={category}
          sort={sort}
          onClearSearch={() => setSearch("")}
          onClearCategory={() => setCategory("All")}
          onResetSort={() => setSort("Newest")}
        />

        <ProductsGrid products={filteredProducts} />

        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      <AdvancedFilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      >
        <FilterSection title="Price">
          <PriceFilter
            min={filters.priceMin}
            max={filters.priceMax}
            onMinChange={(value) =>
              setFilters((prev) => ({ ...prev, priceMin: value }))
            }
            onMaxChange={(value) =>
              setFilters((prev) => ({ ...prev, priceMax: value }))
            }
          />
        </FilterSection>

        <FilterSection title="Condition">
          <ConditionFilter
            value={filters.condition}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                condition: value,
              }))
            }
          />
        </FilterSection>

        <FilterSection title="Rating">
          <RatingFilter
            value={filters.rating}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                rating: value,
              }))
            }
          />
        </FilterSection>

        <FilterSection title="Delivery">
          <DeliveryFilter
            delivery={filters.delivery}
            pickup={filters.pickup}
            onDeliveryChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                delivery: value,
              }))
            }
            onPickupChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                pickup: value,
              }))
            }
          />
        </FilterSection>

        <FilterSection title="Distance">
          <DistanceFilter
            value={filters.distance}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                distance: value,
              }))
            }
          />
        </FilterSection>

        <FilterSection title="Brand">
          <BrandFilter
            value={filters.brand}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                brand: value,
              }))
            }
          />
        </FilterSection>

        <FilterSection title="Location">
          <LocationFilter
            address={filters.address}
            onAddressChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                address: value,
              }))
            }
            onUseCurrentLocation={() => {
              console.log("Get user location");
            }}
          />
        </FilterSection>

        <FilterFooter
          onReset={() => setFilters(defaultFilters)}
          onApply={() => setFiltersOpen(false)}
          activeCount={filteredProducts.length}
        />
      </AdvancedFilterDrawer>
    </>
  );
}
