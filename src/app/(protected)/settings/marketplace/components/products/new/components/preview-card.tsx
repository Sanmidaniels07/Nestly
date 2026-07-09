"use client";

import Image from "next/image";
import { Tag, Truck, MapPin, PackageCheck } from "lucide-react";
import { ProductDraft } from "@/src/types/products-draft";

interface Props {
  draft: ProductDraft;
}

function money(value: string) {
  const num = Number(value);
  if (!value || Number.isNaN(num)) return "₦0";
  return `₦${num.toLocaleString()}`;
}

export default function PreviewCard({ draft }: Props) {
  const cover = draft.images.find((image) => image.isCover) ?? draft.images[0];
  const gallery = draft.images.filter((image) => image.id !== cover?.id).slice(0, 4);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white">
      {/* Image */}
      <div className="relative aspect-[16/9] bg-[#F8F8FC] sm:aspect-[21/9]">
        {cover ? (
          <Image fill alt={draft.name} src={cover.preview} className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[13px] text-[#94A3B8]">
            No image uploaded
          </div>
        )}

        {gallery.length > 0 && (
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {gallery.map((image) => (
              <div
                key={image.id}
                className="relative h-10 w-10 overflow-hidden rounded-lg border-2 border-white shadow-sm"
              >
                <Image fill src={image.preview} alt="" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-violet-600">
              {draft.brand || "No brand"} · {draft.category || "Uncategorized"}
            </p>
            <h2 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
              {draft.name || "Untitled product"}
            </h2>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[11.5px] font-medium ${
              draft.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {draft.status}
          </span>
        </div>

        <p className="mt-3 text-[13.5px] leading-relaxed text-[#64748B]">
          {draft.description || "No description provided"}
        </p>

        {draft.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {draft.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11.5px] font-medium text-violet-700"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Key stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#F2F1F8] pt-5 sm:grid-cols-4">
          <div>
            <p className="text-[11px] text-[#94A3B8]">Price</p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[17px] font-semibold text-violet-700">
              {money(draft.price)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">Stock</p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[17px] font-semibold text-[#13131A]">
              {draft.stock || "0"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">Condition</p>
            <p className="mt-0.5 text-[14px] font-medium text-[#13131A]">
              {draft.condition || "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8]">SKU</p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[13.5px] text-[#334155]">
              {draft.sku || "—"}
            </p>
          </div>
        </div>

        {/* Specifications */}
        {draft.specifications.length > 0 && (
          <div className="mt-5 border-t border-[#F2F1F8] pt-5">
            <p className="mb-3 text-[12.5px] font-semibold text-[#13131A]">Specifications</p>
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {draft.specifications
                .filter((spec) => spec.key.trim())
                .map((spec) => (
                  <div key={spec.id} className="flex justify-between text-[13px]">
                    <span className="text-[#94A3B8]">{spec.key}</span>
                    <span className="font-medium text-[#13131A]">{spec.value}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Shipping summary */}
        <div className="mt-5 flex flex-wrap gap-4 border-t border-[#F2F1F8] pt-5 text-[12.5px] text-[#64748B]">
          {draft.deliveryAvailable && (
            <div className="flex items-center gap-1.5">
              <Truck size={13} className="text-violet-600" />
              {draft.freeDelivery ? "Free delivery" : money(draft.shippingFee)}
              {draft.deliveryTime && ` · ${draft.deliveryTime}`}
            </div>
          )}
          {draft.pickupAvailable && (
            <div className="flex items-center gap-1.5">
              <PackageCheck size={13} className="text-violet-600" />
              Pickup available
            </div>
          )}
          {draft.shippingRegions.length > 0 && (
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-violet-600" />
              {draft.shippingRegions.join(", ")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}