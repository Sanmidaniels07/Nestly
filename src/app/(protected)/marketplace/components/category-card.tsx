"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Category } from "@/src/types/category";

interface Props {
  category: Category;
}

export default function CategoryCard({ category }: Props) {
  return (
    <Link href={`/marketplace/products?category=${category.slug}`}>
      <motion.div
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
        className="
          rounded-2xl
          border
          border-line
          bg-surface
          p-6
          text-left
          transition
          hover:border-violet-200 dark:hover:border-violet-500/30
          hover:shadow-lg
        "
      >
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-xl
            bg-violet-50 dark:bg-violet-500/10
            text-[24px]
          "
        >
          {category.icon || category.name.charAt(0).toUpperCase()}
        </div>

        <h3 className="mt-5 text-lg font-semibold text-ink">
          {category.name}
        </h3>

        {category.productCount !== undefined && (
          <p className="mt-2 font-[family-name:var(--font-mono)] text-[13px] text-muted">
            {category.productCount.toLocaleString()} Products
          </p>
        )}
      </motion.div>
    </Link>
  );
}
