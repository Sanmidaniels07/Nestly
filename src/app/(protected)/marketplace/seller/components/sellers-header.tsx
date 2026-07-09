"use client";

export default function SellersHeader() {
  return (
    <section>
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
        Trusted sellers
      </p>
      <h1 className="mt-2.5 font-[family-name:var(--font-fraunces)] text-[34px] italic text-[#13131A] sm:text-[38px]">
        Browse stores
      </h1>
      <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-[#64748B]">
        Explore verified stores, compare ratings, discover products and buy directly from
        trusted sellers in your area.
      </p>
    </section>
  );
}