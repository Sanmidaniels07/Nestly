"use client";

import { useState } from "react";
import SavedHeader from "./components/saved-header";
import SavedToolbar from "./components/saved-toolbar";
import SavedGrid from "./components/saved-grid";


export default function SavedProductsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <SavedHeader />

      <SavedToolbar search={search} onSearchChange={setSearch} />

      <SavedGrid search={search} />
    </div>
  );
}