"use client";

import { useState } from "react";

import { useStores } from "@/src/hooks/use-stores";
import Pagination from "@/src/components/ui/pagination";
import SellersHeader from "./components/sellers-header";
import SellersToolbar from "./components/sellers-toolbar";
import SellersGrid from "./components/sellers-grid";

export default function SellersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useStores({ search, page, limit: 12 });

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-5 py-8 lg:px-8">
      <SellersHeader />

      <SellersToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {isLoading && (
        <div className="rounded-2xl border border-[#ECE9F6] bg-white py-16 text-center text-[13.5px] text-[#94A3B8]">
          Loading stores...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-[#ECE9F6] bg-white py-16 text-center text-[13.5px] text-red-500">
          Couldn&apos;t load stores. Please try again.
        </div>
      )}

      {!isLoading && !isError && data?.stores.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] py-16 text-center">
          <p className="text-[13.5px] text-[#94A3B8]">No stores found.</p>
        </div>
      )}

      {!isLoading && !isError && !!data?.stores.length && (
        <>
          <SellersGrid sellers={data.stores} />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
