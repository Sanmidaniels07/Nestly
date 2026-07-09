"use client";

import { useEffect, useMemo, useState } from "react";

import OrdersToolbar from "./components/orders-toolbar";
import OrdersList from "./components/orders-list";
import Pagination from "@/src/components/ui/pagination";
import { orders } from "@/src/mocks/order";
import OrdersHeader from "./components/order-header";

const PAGE_SIZE = 5;

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    let data = [...orders];

    if (status !== "All") {
      data = data.filter((order) => order.status === status);
    }

    if (search.trim()) {
      const value = search.toLowerCase();
      data = data.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(value) ||
          order.items.some((item) => item.product.name.toLowerCase().includes(value))
      );
    }

    return data;
  }, [search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  // Reset to page 1 whenever search/status changes the result set
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  // Guard against being stranded on a page that no longer exists
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <OrdersHeader />

      <OrdersToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {filteredOrders.length > 0 && (
        <p className="font-[family-name:var(--font-mono)] text-[12.5px] text-[#94A3B8]">
          {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
        </p>
      )}

      <OrdersList orders={paginatedOrders} />

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}