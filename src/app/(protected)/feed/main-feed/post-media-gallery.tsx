"use client";

import { useRef, useState } from "react";
import { Heart } from "lucide-react";

import { PostMedia } from "@/src/types/post";
import ImageLightbox from "@/src/components/ui/image-lightbox";

interface Props {
  media: PostMedia[];
  /** Double-tap/double-click an image to like (never unlikes, like Instagram). */
  onDoubleTapLike: () => void;
}

const DOUBLE_TAP_MS = 260;

// Layouts by count: 1 = full width, 2 = side by side, 3 = one tall + two,
// 4+ = 2x2 grid with "+N" on the last tile. Tap opens the image full screen;
// double-tap likes the post with a heart burst.
export default function PostMediaGallery({ media, onDoubleTapLike }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shown = media.slice(0, 4);
  const extra = media.length - shown.length;
  const count = shown.length;

  const handleTap = (item: PostMedia) => {
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      onDoubleTapLike();
      setBurst((n) => n + 1);
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapTimer.current = null;
      if (item.type === "IMAGE") setLightbox(item.url);
    }, DOUBLE_TAP_MS);
  };

  const grid =
    count === 1 ? "grid-cols-1" : count === 3 ? "grid-cols-2 grid-rows-2" : "grid-cols-2";

  return (
    <>
      <div className={`relative mt-3 grid gap-1 overflow-hidden rounded-2xl bg-surface-sunken ${grid}`}>
        {shown.map((item, index) => {
          const tall = count === 3 && index === 0;
          const tileClass =
            count === 1
              ? "max-h-[560px]"
              : count === 2
                ? "aspect-[4/5]"
                : tall
                  ? "row-span-2 h-full"
                  : "aspect-square";

          return (
            <div key={`${item.url}-${index}`} className={`relative overflow-hidden ${tall ? "row-span-2" : ""}`}>
              {item.type === "VIDEO" ? (
                <video src={item.url} controls playsInline className={`w-full bg-black object-contain ${count === 1 ? "max-h-[560px]" : "h-full"}`} />
              ) : (
                <button
                  type="button"
                  onClick={() => handleTap(item)}
                  className="block h-full w-full cursor-zoom-in"
                  aria-label="Open image"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt="Post attachment"
                    loading="lazy"
                    className={`w-full object-cover ${tileClass} ${count === 1 ? "h-auto" : "h-full"}`}
                  />
                </button>
              )}
              {extra > 0 && index === shown.length - 1 && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 text-[26px] font-bold text-white">
                  +{extra}
                </span>
              )}
            </div>
          );
        })}

        {burst > 0 && (
          <span key={burst} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart size={96} className="heart-burst fill-white text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]" />
          </span>
        )}
      </div>

      {lightbox && (
        <ImageLightbox src={lightbox} alt="Post image" open={!!lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
