"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  icon: LucideIcon;
  title: string;
  total: number;
}

export default function CategoryCard({
  icon: Icon,
  title,
  total,
}: Props) {
  return (
    <motion.button
      whileHover={{
        y: -6,
      }}
      whileTap={{
        scale: 0.98,
      }}
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
        "
      >
        <Icon
          size={28}
          className="text-violet-600"
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#13131A]">
        {title}
      </h3>

      <p className="mt-2 font-[family-name:var(--font-mono)] text-[13px] text-[#64748B]">
        {total.toLocaleString()} Products
      </p>
    </motion.button>
  );
}