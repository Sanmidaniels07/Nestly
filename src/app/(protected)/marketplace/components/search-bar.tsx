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
      className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-sunken p-4 md:flex-row"
    >
      <div className="flex flex-1 items-center gap-3">
        <Search className="text-violet-600 dark:text-violet-400" size={20} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands or stores..."
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
        />
      </div>

      <button
        type="button"
        onClick={() => router.push("/marketplace/nearby")}
        className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-3 hover:border-violet-300 dark:hover:border-violet-500/40"
      >
        <MapPin size={16} />
        Nearby
      </button>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-3 hover:border-violet-300 dark:hover:border-violet-500/40"
      >
        <SlidersHorizontal size={16} />
        Search
      </button>
    </form>
  );
}
