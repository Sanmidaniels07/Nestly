"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product } from "@/src/types/product";
import { stateLabel, stateSlug } from "@/src/lib/locations";

interface Props {
  product: Product;
}

export default function ProductBreadcrumb({ product }: Props) {
  // Public category pages: Categories > Cakes & Pastries > Lagos > product.
  const state = product.store?.state;
  const items = [
    { label: "Categories", href: "/marketplace/categories" },
    ...(product.category
      ? [
          {
            label: product.category.name,
            href: `/marketplace/categories/${product.category.slug}`,
          },
          ...(state
            ? [{ label: stateLabel(state), href: `/marketplace/categories/${product.category.slug}/${stateSlug(state)}` }]
            : []),
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
              <span className="text-[13px] font-medium text-ink">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href!}
                className="text-[13px] text-muted transition-colors hover:text-violet-600 dark:hover:text-violet-400"
              >
                {item.label}
              </Link>
            )}

            {!isLast && <ChevronRight size={14} className="text-faint" />}
          </div>
        );
      })}
    </nav>
  );
}
