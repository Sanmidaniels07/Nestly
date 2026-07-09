"use client";

import { useMemo, useState } from "react";

import { trendingSellers } from "@/src/mocks/marketplace";
import SellersHeader from "./components/sellers-header";
import SellersToolbar from "./components/sellers-toolbar";
import SellersGrid from "./components/sellers-grid";

export default function SellersPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Recommended");

  const sellers = useMemo(() => {
    let result = trendingSellers;

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((seller) => seller.name.toLowerCase().includes(query));
    }

    switch (sort) {
      case "Highest Rated":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "Most Followers":
        result = [...result].sort((a, b) => b.followers - a.followers);
        break;
      case "Nearest":
        result = [...result].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      default:
        break;
    }

    return result;
  }, [search, sort]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-5 py-8 lg:px-8">
      <SellersHeader />

      <SellersToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      <SellersGrid sellers={sellers} />

      {/* <SellersPagination /> */}
    </div>
  );
}