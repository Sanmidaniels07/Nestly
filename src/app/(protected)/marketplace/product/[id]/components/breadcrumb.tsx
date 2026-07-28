"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product } from "@/src/types/product";

interface Props {
  product: Product;
}

export default function ProductBreadcrumb({ product }: Props) {
  const items = [
    { label: "Marketplace", href: "/marketplace" },
    ...(product.category
      ? [
          {
            label: product.category.name,
            href: `/marketplace/products?category=${product.category.slug}`,
          },
        ]
      : []),
    { label: product.title },
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center gap-1">
            {isLast ? (
              <span className="text-[13px] font-medium text-[#13131A]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href!}
                className="text-[13px] text-[#64748B] transition-colors hover:text-violet-600"
              >
                {item.label}
              </Link>
            )}

            {!isLast && <ChevronRight size={14} className="text-[#CBD5E1]" />}
          </div>
        );
      })}
    </nav>
  );
}
