"use client";

import { useMemo, useState } from "react";

import OrdersToolbar from "./components/orders-toolbar";
import OrdersList from "./components/orders-list";
import Pagination from "@/src/components/ui/pagination";
import { useOrders } from "@/src/hooks/use-orders";
import OrdersHeader from "./components/order-header";
import { ListSkeleton } from "@/src/components/skeletons/list-row-skeleton";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useOrders({
    page,
    limit: 5,
    status: status !== "All" ? status : undefined,
  });

  const orders = data?.orders ?? [];

  const statusOptions = useMemo(
    () => ["All", ...Array.from(new Set(orders.map((order) => order.status)))],
    [orders]
  );

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;

    const value = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(value) ||
        order.items.some((item) => item.product.title.toLowerCase().includes(value))
    );
  }, [orders, search]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

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
        onStatusChange={handleStatusChange}
        statusOptions={statusOptions}
      />

      {isLoading && <ListSkeleton count={4} withAvatar={false} />}

      {isError && (
        <p className="text-[13px] text-red-500">Couldn&apos;t load orders. Please try again.</p>
      )}

      {!isLoading && !isError && (
        <>
          {filteredOrders.length > 0 && (
            <p className="font-[family-name:var(--font-mono)] text-[12.5px] text-[#94A3B8]">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
            </p>
          )}

          <OrdersList orders={filteredOrders} />

          {data && (
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
