"use client";

import { Product } from "@/src/types/product";
import ManagementTable from "@/src/components/ui/management-tables";
import ProductRow from "./product-row";

interface Props {
  products: Product[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
}

const columns = [
  { label: "Product", align: "left" },
  { label: "SKU", align: "left" },
  { label: "Price", align: "right" },
  { label: "Stock", align: "right" },
  { label: "Status", align: "left" },
  { label: "Actions", align: "right" },
] as const;

export default function ProductsTable({
  products,
  selectedIds,
  onToggleSelect,
  onToggleAll,
}: Props) {
  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id));

  return (
    <ManagementTable>
      <thead>
        <tr className="border-b border-[#E9E9EE] bg-[#FAFAFB]">
          <th className="w-10 px-4 py-3 pl-5">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleAll}
              aria-label="Select all products"
              disabled={products.length === 0}
              className="h-4 w-4 rounded border-[#D4D2E3] text-violet-600 focus:ring-violet-400"
            />
          </th>
          {columns.map((col) => (
            <th
              key={col.label}
              className={`
                whitespace-nowrap px-4 py-3 text-[12.5px] font-semibold text-[#495467]
                ${col.align === "right" ? "text-right" : "text-left"}
                last:pr-5
              `}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} className="px-5 py-14 text-center text-[13.5px] text-[#94A3B8]">
              No products match your filters.
            </td>
          </tr>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              selected={selectedIds.has(product.id)}
              onToggleSelect={() => onToggleSelect(product.id)}
            />
          ))
        )}
      </tbody>
    </ManagementTable>
  );
}
