"use client";

import Image from "next/image";
import { Star, Trash2, Loader2 } from "lucide-react";
import { DraftImage } from "@/src/types/product-image";

interface Props {
  image: DraftImage;
  onCover: () => void;
  onDelete: () => void;
}

export default function ImageCard({ image, onCover, onDelete }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]">
      <div className="relative aspect-square bg-surface-sunken">
        <Image src={image.preview} alt="" fill className="object-cover" />

        {image.uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 size={22} className="animate-spin text-white" />
          </div>
        )}

        {image.isCover && (
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-violet-600 px-2.5 py-1 text-[10.5px] font-semibold text-white">
            <Star size={10} fill="white" />
            Cover
          </div>
        )}

        <button
          onClick={onDelete}
          aria-label="Remove image"
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-red-500 opacity-0 backdrop-blur transition-opacity hover:bg-surface group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="p-3">
        {image.isCover ? (
          <div className="flex h-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10 text-[12.5px] font-medium text-violet-700 dark:text-violet-300">
            Cover image
          </div>
        ) : (
          <button
            onClick={onCover}
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-line text-[12.5px] font-medium text-muted transition-colors hover:border-violet-200 dark:hover:border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300"
          >
            <Star size={12} />
            Set as cover
          </button>
        )}
      </div>
    </div>
  );
}
