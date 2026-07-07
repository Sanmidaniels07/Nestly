"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Play } from "lucide-react";
import { ProfileMedia } from "@/src/mocks/profile-media";

interface Props {
  media: ProfileMedia[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function ProfileMediaLightbox({ media, index, onClose, onNavigate }: Props) {
  const isOpen = index !== null;
  const current = isOpen ? media[index] : null;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || index === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % media.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + media.length) % media.length);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, index, media.length, onClose, onNavigate]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && current && index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <span className="absolute left-5 top-5 z-10 font-[family-name:var(--font-mono)] text-[12.5px] text-white/60">
            {index + 1} / {media.length}
          </span>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + media.length) % media.length);
            }}
            aria-label="Previous"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % media.length);
            }}
            aria-label="Next"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>

          {/* Content */}
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#0C0E1F]"
          >
            <div className="relative flex-1 bg-black">
              <Image
                src={current.image}
                alt=""
                width={1200}
                height={1200}
                className="max-h-[60vh] w-full object-contain"
              />

              {current.type === "video" && (
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-white backdrop-blur-sm">
                  <Play size={13} fill="white" />
                  <span className="text-[12px] font-medium">Video</span>
                </div>
              )}
            </div>

            {/* Metadata panel */}
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5 text-white">
                  <Heart size={17} />
                  <span className="font-[family-name:var(--font-mono)] text-[13.5px] font-medium">
                    {formatCount(current.likes)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-white/70">
                  <MessageCircle size={17} />
                  <span className="font-[family-name:var(--font-mono)] text-[13.5px] font-medium">
                    {formatCount(current.comments)}
                  </span>
                </div>
              </div>

              <span className="font-[family-name:var(--font-mono)] text-[12.5px] text-white/50">
                {current.createdAt}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}