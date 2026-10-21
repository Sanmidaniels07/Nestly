"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BadgeCheck, KeyRound, MapPin, RotateCcw, Search, ShieldCheck, Store, Truck } from "lucide-react";

import { useFeaturedCategories } from "@/src/hooks/use-featured-categories";
import { useFeaturedProducts } from "@/src/hooks/use-featured-products";
import { useStores } from "@/src/hooks/use-stores";
import { getCategoryIcon } from "@/src/lib/category-style";

interface ShowcaseItem {
  id: string;
  title: string;
  price: number;
  image: string;
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

const TRUST = [
  { icon: ShieldCheck, title: "Secure checkout", body: "Card or transfer via Paystack" },
  { icon: KeyRound, title: "Delivery code", body: "Confirm your order arrived" },
  { icon: Truck, title: "Delivery or pickup", body: "Zones set by each seller" },
  { icon: RotateCcw, title: "7-day returns", body: "After delivery is confirmed" },
];

// Rotations for the floating product cards on the right.
const TILTS = ["rotate-[-5deg] translate-y-6", "rotate-[3deg] -translate-y-2 z-10", "rotate-[-2deg] translate-y-10"];

export default function MarketplaceHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  // Same query keys as the sections below, so these are shared, not refetched.
  const { data: categories } = useFeaturedCategories(8);
  const { data: products } = useFeaturedProducts(8);
  const { data: trending } = useStores({ limit: 6, sort: "trending" });

  const shortcuts = (categories ?? []).slice(0, 5);

  // Featured products first; if none are featured, real products from the
  // trending stores, so the hero always shows what's actually for sale.
  const featured: ShowcaseItem[] = (products ?? [])
    .filter((p) => p.images.length > 0)
    .map((p) => ({ id: p.id, title: p.title, price: p.price, image: (p.images.find((img) => img.isPrimary) ?? p.images[0]).url }));
  const fromStores: ShowcaseItem[] = (trending?.stores ?? [])
    .flatMap((store) => store.previewProducts ?? [])
    .filter((p): p is ShowcaseItem => !!p.image);
  const showcase = (featured.length >= 3 ? featured : [...featured, ...fromStores]).slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/marketplace/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700 text-white shadow-[0_30px_70px_-35px_rgba(76,29,149,0.7)]"
    >
      {/* Texture + glows */}
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,.55)_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(120deg,#000,transparent_75%)]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-400/30 blur-3xl" />

      <div className="relative grid gap-10 px-5 pb-8 pt-8 sm:px-10 sm:pt-12 lg:grid-cols-[1.1fr_1fr] lg:px-12">
        {/* Left */}
        <div className="flex min-w-0 flex-col justify-center">
          <span className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.28em] text-violet-200">
            Nestly Marketplace
          </span>

          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-[40px] leading-[1.05] sm:text-[54px]">
            Shop from people
            <br />
            <em className="text-violet-200">you know.</em>
          </h1>

          <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-violet-100/90">
            Discover stores run by people in your circle and around you — pay securely, track every order and confirm delivery with your own code.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-7 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-1.5 pl-4 shadow-[0_18px_40px_-18px_rgba(20,8,60,0.6)]"
          >
            <Search size={19} className="shrink-0 text-violet-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products or stores..."
              aria-label="Search the marketplace"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-[#15131F] outline-none placeholder:text-[#8E8AA3]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-[13.5px] font-semibold text-white transition hover:brightness-110 sm:px-5"
            >
              Search
            </button>
          </form>

          {shortcuts.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[12.5px] text-violet-200">Popular:</span>
              {shortcuts.map((category) => {
                const Icon = getCategoryIcon(category);
                return (
                  <Link
                    key={category.id}
                    href={`/marketplace/products?category=${category.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12.5px] font-medium text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <Icon size={13} />
                    {category.name}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/marketplace/nearby"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              <MapPin size={17} />
              Shop near you
            </Link>
            <Link
              href="/marketplace/sell"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-white/10"
            >
              <Store size={17} />
              Open your store
            </Link>
          </div>
        </div>

        {/* Right: real featured products */}
        <div className="relative hidden min-h-[360px] items-center justify-center lg:flex">
          {showcase.length > 0 ? (
            <div className="flex items-center justify-center -space-x-10">
              {showcase.map((product, i) => (
                <Link
                  key={product.id}
                  href={`/marketplace/product/${product.id}`}
                  className={`w-[190px] shrink-0 overflow-hidden rounded-2xl bg-white p-2 text-[#15131F] shadow-[0_30px_60px_-25px_rgba(20,8,60,0.75)] transition-transform duration-300 hover:z-20 hover:-translate-y-3 hover:rotate-0 ${TILTS[i]}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-violet-50">
                    <Image src={product.image} alt={product.title} fill sizes="190px" className="object-cover" />
                  </div>
                  <div className="px-1.5 pb-1.5 pt-2.5">
                    <p className="truncate text-[13px] font-semibold">{product.title}</p>
                    <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-violet-700">{money(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid w-full max-w-sm gap-3">
              {TRUST.slice(0, 3).map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-center gap-3 rounded-2xl bg-white/95 p-4 text-[#15131F] shadow-xl">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Icon size={20} /></span>
                  <div><p className="text-[14px] font-semibold">{title}</p><p className="text-[12.5px] text-[#6B6880]">{body}</p></div>
                </div>
              ))}
            </div>
          )}

          <div className="absolute bottom-2 right-2 z-20 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 text-[#15131F] shadow-[0_18px_40px_-16px_rgba(20,8,60,0.7)]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><BadgeCheck size={17} /></span>
            <div className="leading-tight">
              <p className="text-[12.5px] font-semibold">Payment verified</p>
              <p className="text-[11px] text-[#6B6880]">before sellers ship</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="relative grid grid-cols-2 gap-px border-t border-white/15 bg-white/10 lg:grid-cols-4">
        {TRUST.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-center gap-3 bg-violet-700/40 px-4 py-3.5 backdrop-blur sm:items-start sm:px-6 sm:py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 sm:mt-0.5"><Icon size={17} /></span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-tight sm:text-[13.5px]">{title}</p>
              <p className="hidden text-[12px] leading-snug text-violet-100/80 sm:block">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
