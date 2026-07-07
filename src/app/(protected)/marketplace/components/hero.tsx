"use client";

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
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[#EDEBF5]
        bg-white
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
              text-violet-600
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
              text-[#13131A]
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
              text-[#64748B]
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
            <Button variant="tribely">
              <ShoppingBag
                size={18}
                className="mr-2"
              />
              Browse Nearby
            </Button>

            <Button
              variant="secondary"
              className="
                border-[#EDEBF5]
                bg-white
              "
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
              text-[#64748B]
            "
          >
            <MapPin
              size={18}
              className="text-violet-600"
            />

            Lagos, Nigeria

            <button className="font-medium text-violet-600 hover:underline">
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
              border-violet-200
              bg-gradient-to-br
              from-violet-50
              via-white
              to-indigo-50
              p-8
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className="
                    text-lg
                    font-semibold
                    text-[#13131A]
                  "
                >
                  Products Near You
                </h3>

                <p className="mt-2 text-[#64748B]">
                  Over
                  <span className="mx-1 font-semibold text-violet-700">
                    3,400+
                  </span>
                  products are currently available
                  within 10 km.
                </p>
              </div>

              <button
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