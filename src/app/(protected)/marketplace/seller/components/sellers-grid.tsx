"use client";

import { Store } from "@/src/types/store";
import SellerCard from "./sellers-card";

interface Props {
  sellers: Store[];
}

export default function SellersGrid({ sellers }: Props) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {sellers.map((seller) => (
        <SellerCard key={seller.id} seller={seller} />
      ))}
    </section>
  );
}
