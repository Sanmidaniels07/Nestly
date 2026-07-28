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
          border-[#EDEBF5]
          bg-white
          p-6
          text-left
          transition
          hover:border-violet-200
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
            bg-violet-50
            text-[24px]
          "
        >
          {category.icon || category.name.charAt(0).toUpperCase()}
        </div>

        <h3 className="mt-5 text-lg font-semibold text-[#13131A]">
          {category.name}
        </h3>

        {category.productCount !== undefined && (
          <p className="mt-2 font-[family-name:var(--font-mono)] text-[13px] text-[#64748B]">
            {category.productCount.toLocaleString()} Products
          </p>
        )}
      </motion.div>
    </Link>
  );
}
