"use client";

import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";

// Every tab except the dashboard needs a store to exist - the API rejects
// those requests with "You must create a store first" - so show the way
// forward instead of a generic load error or an endless skeleton.
interface Props {
  section: string;
  isSeller: boolean;
}

export default function SetupStorePrompt({ section, isSeller }: Props) {
  return (
    <section className="rounded-2xl border border-dashed border-[#E2E0EE] bg-[#FAFAFD] px-6 py-14 text-center sm:px-10">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-violet-50">
        <Store size={24} className="text-violet-600" />
      </div>
      <h2 className="font-[family-name:var(--font-fraunces)] text-[24px] italic text-[#13131A]">
        {isSeller ? "Set up your store first" : "Become a seller first"}
      </h2>
      <p className="mx-auto mt-2.5 max-w-md text-[13.5px] leading-relaxed text-[#64748B]">
        Your {section} will show up here once your store is set up.
        {isSeller ? " It only takes a couple of minutes." : " Apply to sell on Nestly to get started."}
      </p>
      <Link
        href="/marketplace/sell"
        className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
      >
        {isSeller ? "Set up store" : "Become a seller"}
        <ArrowRight size={15} />
      </Link>
    </section>
  );
}
