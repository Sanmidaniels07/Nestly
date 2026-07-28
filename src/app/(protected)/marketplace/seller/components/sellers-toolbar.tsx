"use client";

import { Search } from "lucide-react";
import Input from "@/src/components/ui/input";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function SellersToolbar({ search, onSearchChange }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-5">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search stores..."
        icon={<Search size={16} />}
      />
    </section>
  );
}
