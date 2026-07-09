"use client";

import { sellerProducts } from "@/src/mocks/seller-products";
import ManagementTable from "@/src/components/ui/management-tables";
import ProductRow from "./product-row";

interface Props {
  products?: typeof sellerProducts;
}

const columns = [
  { label: "Product", align: "left" },
  { label: "SKU", align: "left" },
  { label: "Price", align: "right" },
  { label: "Stock", align: "right" },
  { label: "Sold", align: "right" },
  { label: "Views", align: "right" },
  { label: "Status", align: "left" },
  { label: "Actions", align: "right" },
] as const;

export default function ProductsTable({ products = sellerProducts }: Props) {
  return (
    <ManagementTable>
      <thead>
        <tr className="border-b border-[#E9E9EE] bg-[#FAFAFB]">
          {columns.map((col) => (
            <th
              key={col.label}
              className={`
                whitespace-nowrap px-4 py-3 text-[12.5px] font-semibold text-[#495467]
                ${col.align === "right" ? "text-right" : "text-left"}
                first:pl-5 last:pr-5
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
            <td colSpan={columns.length} className="px-5 py-14 text-center text-[13.5px] text-[#94A3B8]">
              No products match your filters.
            </td>
          </tr>
        ) : (
          products.map((product) => <ProductRow key={product.id} product={product} />)
        )}
      </tbody>
    </ManagementTable>
  );
}