"use client";

import Image from "next/image";
import { Star, Trash2, GripVertical } from "lucide-react";
import { ProductImage } from "@/src/types/product-image";

interface Props {
  image: ProductImage;
  onCover: () => void;
  onDelete: () => void;
}

export default function ImageCard({ image, onCover, onDelete }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(124,58,237,0.2)]">
      <div className="relative aspect-square bg-[#F8F8FC]">
        <Image src={image.preview} alt="" fill className="object-cover" />

        {image.isCover && (
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-violet-600 px-2.5 py-1 text-[10.5px] font-semibold text-white">
            <Star size={10} fill="white" />
            Cover
          </div>
        )}

        <button
          onClick={onDelete}
          aria-label="Remove image"
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 backdrop-blur transition-opacity hover:bg-white group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="p-3">
        {image.isCover ? (
          <div className="flex h-9 items-center justify-center rounded-xl bg-violet-50 text-[12.5px] font-medium text-violet-700">
            Cover image
          </div>
        ) : (
          <button
            onClick={onCover}
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-[#ECE9F6] text-[12.5px] font-medium text-[#64748B] transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            <Star size={12} />
            Set as cover
          </button>
        )}
      </div>
    </div>
  );
}