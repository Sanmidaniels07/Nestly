"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useGoBack } from "@/src/hooks/use-go-back";
import { Store } from "@/src/types/store";

interface Props {
  store: Store;
}

export default function SellerCover({ store }: Props) {
  // Back to wherever the user came from; /marketplace/seller if they landed here directly.
  const goBack = useGoBack("/marketplace/seller");
  return (
    <section className="relative h-[220px] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 dark:from-violet-500/15 to-indigo-100 dark:to-indigo-500/15 sm:h-[260px]">
      {store.banner && (
        <Image src={store.banner} alt={store.name} fill className="object-cover" priority />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

      <button
        type="button"
        onClick={() => goBack()}
        className="absolute left-5 top-5 flex h-10 items-center gap-2 rounded-xl bg-surface/90 px-4 text-[13px] font-semibold text-ink-2 backdrop-blur-sm transition-colors hover:bg-surface"
      >
        <ArrowLeft size={15} />
        Back
      </button>
    </section>
  );
}
