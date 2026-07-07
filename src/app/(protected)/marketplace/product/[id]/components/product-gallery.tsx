"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, ChevronLeft, ChevronRight, X } from "lucide-react";
import { MarketplaceProduct } from "@/src/mocks/marketplace";

interface Props {
  product: MarketplaceProduct;
}

export default function ProductGallery({ product }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const activeImage = product.images[activeIndex];
  const total = product.images.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (!zoomed) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [zoomed, activeIndex, goTo]);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
        <button
          onClick={() => setZoomed(true)}
          aria-label="Expand image"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-transform hover:scale-105"
        >
          <Expand size={16} />
        </button>

        <span className="absolute bottom-4 right-4 z-20 rounded-full bg-black/55 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11.5px] text-white backdrop-blur-sm">
          {activeIndex + 1} / {total}
        </span>

        {total > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-transform hover:scale-105"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-transform hover:scale-105"
            >
              <ChevronRight size={17} />
            </button>
          </>
        )}

        <button
          onClick={() => setZoomed(true)}
          className="relative block aspect-square w-full cursor-zoom-in"
          aria-label="Open full size image"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                fill
                src={activeImage}
                alt={product.name}
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {total > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {product.images.map((image, index) => {
            const active = index === activeIndex;

            return (
              <button
                key={image}
                onClick={() => setActiveIndex(index)}
                className={`
                  relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors
                  ${active ? "border-violet-600" : "border-transparent hover:border-violet-200"}
                `}
              >
                <Image fill src={image} alt="" className="object-cover" />
              </button>
            );
          })}
        </div>
      )}

      {/* Full-screen zoom */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
          >
            <button
              onClick={() => setZoomed(false)}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
            >
              <X size={20} />
            </button>

            <span className="absolute left-5 top-5 z-10 font-[family-name:var(--font-mono)] text-[12.5px] text-white/60">
              {activeIndex + 1} / {total}
            </span>

            {total > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex - 1);
                  }}
                  aria-label="Previous"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex + 1);
                  }}
                  aria-label="Next"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-4 aspect-square w-full max-w-2xl"
            >
              <Image fill src={activeImage} alt={product.name} className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}