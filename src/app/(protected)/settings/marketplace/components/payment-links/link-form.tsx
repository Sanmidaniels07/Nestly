"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, MapPinned, Star, Store, Truck, X } from "lucide-react";

import { useCategories } from "@/src/hooks/use-categories";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { useCreatePaymentLink, useUpdatePaymentLink } from "@/src/hooks/use-payment-links";
import FormSelect from "@/src/components/ui/form-select";
import VehiclePicker from "@/src/components/ui/vehicle-picker";
import { DeliveryVehicle } from "@/src/lib/delivery-vehicle";
import { PaymentLink, PaymentLinkDelivery, PaymentLinkPayload } from "@/src/types/payment-link";

const MAX_IMAGES = 6;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_MB = 8;

// "15,000" -> 15000; empty or invalid -> NaN.
const parseAmount = (value: string) => (value.trim() ? Number(value.replace(/[,\s₦]/g, "")) : NaN);

interface Props {
  // Editing this link; creating a new one when absent.
  link?: PaymentLink;
  onDone: (link: PaymentLink) => void;
  onCancel: () => void;
}

export default function LinkForm({ link, onDone, onCancel }: Props) {
  const { data: categories } = useCategories();
  const { mutateAsync: uploadImage } = useImageUpload();
  const { mutate: createLink, isPending: isCreating } = useCreatePaymentLink();
  const { mutate: updateLink, isPending: isUpdating } = useUpdatePaymentLink();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(link?.title ?? "");
  const [price, setPrice] = useState(link ? String(link.price) : "");
  const [quantity, setQuantity] = useState(link ? String(link.quantity) : "1");
  const [categoryId, setCategoryId] = useState(link?.category.id ?? "");
  // New links default to the store's zones - the seller often doesn't know
  // where the buyer is yet.
  const [deliveryType, setDeliveryType] = useState<PaymentLinkDelivery>(link?.deliveryType ?? "STORE_OPTIONS");
  const [vehicle, setVehicle] = useState<DeliveryVehicle>(link?.deliveryVehicle ?? "BIKE");
  const [deliveryFee, setDeliveryFee] = useState(link ? String(link.deliveryFee) : "");
  const [description, setDescription] = useState(link?.description ?? "");
  const [images, setImages] = useState<string[]>(
    link ? [...link.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)).map((image) => image.url) : []
  );
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState("");

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    const picked = Array.from(files).slice(0, MAX_IMAGES - images.length);
    if (picked.some((file) => !ACCEPTED_TYPES.includes(file.type) || file.size > MAX_SIZE_MB * 1024 * 1024)) {
      setError(`Photos must be PNG, JPG or WEBP under ${MAX_SIZE_MB}MB.`);
      return;
    }
    setUploading(picked.length);
    for (const file of picked) {
      try {
        const url = await uploadImage(file);
        setImages((current) => [...current, url].slice(0, MAX_IMAGES));
      } catch {
        // useImageUpload already showed an error.
      }
      setUploading((count) => count - 1);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseAmount(price);
    const count = Number(quantity);
    const fee = deliveryType === "DELIVERY" ? (deliveryFee.trim() ? parseAmount(deliveryFee) : 0) : 0;

    if (title.trim().length < 2) return setError("Give the item a name.");
    if (!(amount > 0)) return setError("Enter the price, e.g. 15000.");
    if (!Number.isInteger(count) || count < (link ? 0 : 1)) return setError("Enter how many you're selling, e.g. 1.");
    if (!categoryId) return setError("Choose a category.");
    if (Number.isNaN(fee) || fee < 0) return setError("Enter the delivery fee, or 0 for free delivery.");
    setError("");

    const payload: PaymentLinkPayload = {
      title: title.trim(),
      description: description.trim(),
      price: amount,
      quantity: count,
      categoryId,
      deliveryType,
      deliveryFee: fee,
      deliveryVehicle: vehicle,
      images: images.map((url, index) => ({ url, isPrimary: index === 0 })),
    };

    const done = (response: { data: PaymentLink }) => onDone(response.data);
    if (link) updateLink({ id: link.id, data: payload }, { onSuccess: done });
    else createLink(payload, { onSuccess: done });
  };

  const field =
    "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[16px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]";
  const label = "mb-1.5 block text-[13px] font-semibold text-ink-2";
  const saving = isCreating || isUpdating;

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-violet-200 bg-surface p-5 dark:border-violet-500/30 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-fraunces)] text-[21px] italic text-ink">
            {link ? "Edit payment link" : "New payment link"}
          </h3>
          <p className="mt-0.5 text-[12.5px] text-muted">
            {link ? "Orders already paid keep the details they were bought with." : "For a deal you've agreed with a buyer - or something you sell often."}
          </p>
        </div>
        <button type="button" onClick={onCancel} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-2">
          <X size={18} />
        </button>
      </div>

      {/* Photos */}
      <div>
        <span className={label}>Photos</span>
        <div className="flex flex-wrap gap-2.5">
          {images.map((url, index) => (
            <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-line bg-surface-sunken">
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
              {index === 0 ? (
                <span className="absolute bottom-1 left-1 rounded-md bg-violet-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">Cover</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setImages((current) => [url, ...current.filter((u) => u !== url)])}
                  aria-label="Make cover photo"
                  className="absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-md bg-surface/90 text-muted"
                >
                  <Star size={12} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setImages((current) => current.filter((u) => u !== url))}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 text-ink"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {Array.from({ length: uploading }).map((_, i) => (
            <div key={`up-${i}`} className="flex h-20 w-20 items-center justify-center rounded-xl border border-line bg-surface-sunken">
              <Loader2 size={18} className="animate-spin text-violet-600" />
            </div>
          ))}
          {images.length + uploading < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-violet-200 text-[11px] font-medium text-violet-700 hover:border-violet-400 dark:border-violet-500/30 dark:text-violet-300"
            >
              <ImagePlus size={18} /> Add
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          hidden
          onChange={(e) => {
            addPhotos(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="mt-1.5 text-[12px] text-subtle">Optional, up to {MAX_IMAGES}. Buyers trust a link with a real photo more.</p>
      </div>

      <div>
        <label htmlFor="link-title" className={label}>What are you selling?</label>
        <input id="link-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Red velvet cake (8 inch)" className={field} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="link-price" className={label}>Price (₦)</label>
          <input id="link-price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="15000" className={field} />
        </div>
        <div>
          <label htmlFor="link-qty" className={label}>How many?</label>
          <input id="link-qty" inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))} className={field} />
          <p className="mt-1 text-[11.5px] text-subtle">1 for a one-off deal. More if you&apos;ll share it widely.</p>
        </div>
      </div>

      <div>
        <FormSelect
          label="Category"
          value={categoryId}
          onChange={setCategoryId}
          placeholder="Choose a category"
          options={(categories ?? []).map((category) => ({ label: category.name, value: category.id }))}
        />
        <p className="mt-1 text-[11.5px] text-subtle">Sets Nestly&apos;s commission, the same as for your listed products.</p>
      </div>

      {/* Delivery */}
      <div>
        <span className={label}>How does the buyer get it?</span>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {([
            { value: "STORE_OPTIONS", title: "Buyer chooses", hint: "From your delivery zones and pickup points", icon: MapPinned },
            { value: "DELIVERY", title: "Fixed delivery fee", hint: "When you've agreed the fee", icon: Truck },
            { value: "PICKUP", title: "Buyer picks up", hint: "From your store's address", icon: Store },
          ] as const).map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setDeliveryType(option.value)}
              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                deliveryType === option.value
                  ? "border-violet-400 bg-violet-50 dark:bg-violet-500/10"
                  : "border-line hover:border-violet-200 dark:hover:border-violet-500/30"
              }`}
            >
              <option.icon size={18} className="shrink-0 text-violet-600 dark:text-violet-400" />
              <span>
                <span className="block text-[13.5px] font-semibold text-ink">{option.title}</span>
                <span className="block text-[12px] text-muted">{option.hint}</span>
              </span>
            </button>
          ))}
        </div>
        {deliveryType === "STORE_OPTIONS" && (
          <div className="mt-3 space-y-2">
            <p className="text-[12px] text-muted">
              The buyer picks their area when paying and pays that zone&apos;s fee - the same zones as your store (Store settings → Delivery).
            </p>
            <div className="sm:max-w-sm">
              <span className={label}>Smallest vehicle that can carry it</span>
              <VehiclePicker value={vehicle} onChange={setVehicle} label="Smallest vehicle that can carry it" />
            </div>
          </div>
        )}
        {deliveryType === "DELIVERY" && (
          <div className="mt-3 sm:max-w-[240px]">
            <label htmlFor="link-fee" className={label}>Delivery fee (₦)</label>
            <input id="link-fee" inputMode="decimal" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} placeholder="0 for free delivery" className={field} />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="link-desc" className={label}>Details (optional)</label>
        <textarea
          id="link-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="Size, colour, what's included, when it'll be ready…"
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 sm:text-[14px]"
        />
      </div>

      {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

      <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="h-11 rounded-xl border border-line px-5 text-[13.5px] font-semibold text-ink-2 hover:bg-surface-sunken">
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || uploading > 0}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-[13.5px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {link ? "Save changes" : "Create link"}
        </button>
      </div>
    </form>
  );
}
