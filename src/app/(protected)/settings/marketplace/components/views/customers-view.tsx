"use client";

import { useState } from "react";
import { Users } from "lucide-react";

import { useSellerCustomers } from "@/src/hooks/use-seller-customers";
import Pagination from "@/src/components/ui/pagination";
import { formatRelativeTime } from "@/src/lib/date";
import { TableSkeleton } from "@/src/components/skeletons/table-skeleton";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CustomersView() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerCustomers({ page, limit: 10 });
  const customers = data?.customers ?? [];

  if (isLoading) {
    return <TableSkeleton rows={6} cols={4} />;
  }

  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
        <Users className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
        <p className="mt-4 text-[13.5px] text-[#94A3B8]">
          Customers will show up here once you have paid orders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-[#ECE9F6] bg-white">
        <table className="w-full min-w-[560px] text-left">
          <thead className="border-b border-[#F2F1F8] bg-[#FAFAFD]">
            <tr>
              <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                Customer
              </th>
              <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                Orders
              </th>
              <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                Total spent
              </th>
              <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                Last order
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F1F8]">
            {customers.map((customer) => (
              <tr key={customer.user.id}>
                <td className="px-5 py-4">
                  <p className="text-[13.5px] font-medium text-[#13131A]">
                    {customer.user.name}
                  </p>
                  <p className="text-[12px] text-[#94A3B8]">{customer.user.email}</p>
                </td>
                <td className="px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] text-[#334155]">
                  {customer.totalOrders}
                </td>
                <td className="px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700">
                  {money(customer.totalSpent)}
                </td>
                <td className="px-5 py-4 text-[12.5px] text-[#64748B]">
                  {formatRelativeTime(customer.lastOrderAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
