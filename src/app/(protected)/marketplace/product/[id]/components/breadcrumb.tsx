"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  product: {
    name: string;
    category: string;
  };
}

export default function ProductBreadcrumb({
  product,
}: ProductBreadcrumbProps) {
  const items = [
    {
      label: "Marketplace",
      href: "/marketplace",
    },
    {
      label: product.category,
      href: `/marketplace/category/${product.category.toLowerCase()}`,
    },
    {
      label: product.name,
    },
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.label}
            className="flex items-center gap-1"
          >
            {isLast ? (
              <span
                className="
                  text-[13px]
                  font-medium
                  text-[#13131A]
                "
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href!}
                className="
                  text-[13px]
                  text-[#64748B]
                  transition-colors
                  hover:text-violet-600
                "
              >
                {item.label}
              </Link>
            )}

            {!isLast && (
              <ChevronRight
                size={14}
                className="text-[#CBD5E1]"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}