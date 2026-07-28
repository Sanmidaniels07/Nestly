"use client";

import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import Button from "@/src/components/ui/button";

interface Props {
  hasStore: boolean;
}

export default function ProfileMarketEmpty({ hasStore }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-dashed border-violet-200 bg-white py-16 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
        <Store size={26} className="text-violet-600" />
      </div>

      <h2 className="text-[19px] font-semibold text-[#13131A]">
        No marketplace activity
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-[14px] text-[#64748B]">
        Listings, purchases and completed sales will appear here.
      </p>

      <Button
        variant="tribely"
        className="mx-auto mt-7 w-fit"
        onClick={() =>
          router.push(
            hasStore ? "/settings/marketplace/components/products/new" : "/marketplace/sell"
          )
        }
      >
        {hasStore ? "Create listing" : "Become a seller"}
      </Button>
    </div>
  );
}