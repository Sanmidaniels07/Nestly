"use client";

import {
  Search,
  SlidersHorizontal,
  MapPin,
} from "lucide-react";

export default function MarketplaceSearchBar() {
  return (
    <div
      className="
        flex
        flex-col
        gap-3
        rounded-2xl
        border
        border-[#EDEBF5]
        bg-[#FAFAFD]
        p-4
        md:flex-row
      "
    >
      <div
        className="
          flex
          flex-1
          items-center
          gap-3
        "
      >
        <Search
          className="text-violet-600"
          size={20}
        />

        <input
          placeholder="Search products, brands or stores..."
          className="
            w-full
            bg-transparent
            text-[15px]
            outline-none
            placeholder:text-[#94A3B8]
          "
        />
      </div>

      <button
        className="
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-[#EDEBF5]
          bg-white
          px-4
          py-2
          text-sm
          font-medium
          text-[#475569]
          hover:border-violet-300
        "
      >
        <MapPin size={16} />
        Nearby
      </button>

      <button
        className="
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-[#EDEBF5]
          bg-white
          px-4
          py-2
          text-sm
          font-medium
          text-[#475569]
          hover:border-violet-300
        "
      >
        <SlidersHorizontal size={16} />
        Filters
      </button>
    </div>
  );
}