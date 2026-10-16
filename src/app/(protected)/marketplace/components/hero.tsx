"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  ShoppingBag,
  Store,
  ArrowRight,
} from "lucide-react";

import Button from "@/src/components/ui/button";
import MarketplaceSearchBar from "./search-bar";

export default function MarketplaceHero() {
  const router = useRouter();

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
        overflow-hidden
        rounded-2xl
        border
        border-line
        bg-surface
      "
    >
      <div className="grid gap-10 p-8 lg:grid-cols-2 lg:p-10">
        {/* Left */}

        <div className="flex flex-col justify-center">
          <span
            className="
              font-[family-name:var(--font-mono)]
              text-[12px]
              uppercase
              tracking-[0.25em]
              text-violet-600 dark:text-violet-400
            "
          >
            Marketplace
          </span>

          <h1
            className="
              mt-4
              font-[family-name:var(--font-fraunces)]
              text-5xl
              italic
              leading-tight
              text-ink
            "
          >
            Buy & Sell
            <br />
            with people
            <br />
            around you.
          </h1>

          <p
            className="
              mt-6
              max-w-xl
              text-[16px]
              leading-relaxed
              text-muted
            "
          >
            Discover trusted sellers close to your location,
            explore thousands of products and connect directly
            with local businesses inside Nestly.
          </p>

          <div
            className="
              mt-7
              flex
              flex-wrap
              items-center
              gap-3
            "
          >
            <Button variant="tribely" onClick={() => router.push("/marketplace/nearby")}>
              <ShoppingBag
                size={18}
                className="mr-2"
              />
              Browse Nearby
            </Button>

            <Button
              variant="secondary"
              className="
                border-line
                bg-surface
              "
              onClick={() => router.push("/marketplace/sell")}
            >
              <Store
                size={18}
                className="mr-2"
              />
              Sell an Item
            </Button>
          </div>

          <div
            className="
              mt-7
              flex
              items-center
              gap-2
              text-sm
              text-muted
            "
          >
            <MapPin
              size={18}
              className="text-violet-600 dark:text-violet-400"
            />

            Lagos, Nigeria

            <button className="font-medium text-violet-600 dark:text-violet-400 hover:underline">
              Change Location
            </button>
          </div>
        </div>

        {/* Right */}

        <div className="flex flex-col justify-center gap-6">
          <MarketplaceSearchBar />

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-violet-200 dark:border-violet-500/30
              bg-gradient-to-br
              from-violet-50 dark:from-violet-500/10
              via-surface
              to-indigo-50 dark:to-indigo-500/10
              p-8
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className="
                    text-lg
                    font-semibold
                    text-ink
                  "
                >
                  Products Near You
                </h3>

                <p className="mt-2 text-muted">
                  Browse thousands of products from verified sellers across
                  Nestly.
                </p>
              </div>

              <button
                onClick={() => router.push("/marketplace/products")}
                aria-label="Browse products"
                className="
                  rounded-full
                  bg-violet-600
                  p-4
                  text-white
                  transition
                  hover:scale-105
                "
              >
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}