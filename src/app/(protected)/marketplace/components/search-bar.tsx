"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";

export default function MarketplaceSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/marketplace/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-[#EDEBF5] bg-[#FAFAFD] p-4 md:flex-row"
    >
      <div className="flex flex-1 items-center gap-3">
        <Search className="text-violet-600" size={20} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands or stores..."
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#94A3B8]"
        />
      </div>

      <button
        type="button"
        onClick={() => router.push("/marketplace/nearby")}
        className="flex items-center justify-center gap-2 rounded-xl border border-[#EDEBF5] bg-white px-4 py-2 text-sm font-medium text-[#475569] hover:border-violet-300"
      >
        <MapPin size={16} />
        Nearby
      </button>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl border border-[#EDEBF5] bg-white px-4 py-2 text-sm font-medium text-[#475569] hover:border-violet-300"
      >
        <SlidersHorizontal size={16} />
        Search
      </button>
    </form>
  );
}
