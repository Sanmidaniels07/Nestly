"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useMyProduct } from "@/src/hooks/use-my-product";
import { useUpdateProduct } from "@/src/hooks/use-update-product";
import Button from "@/src/components/ui/button";
import { ProductEditDraft } from "./types";
import EditBasicSection from "./components/edit-basic-section";
import EditPricingSection from "./components/edit-pricing-section";
import EditImagesSection from "./components/edit-images-section";
import EditSpecsSection from "./components/edit-specs-section";
import { FormCardSkeleton } from "@/src/components/skeletons/form-card-skeleton";

const PRODUCTS_PATH = "/settings/marketplace/components/products";

const EMPTY_DRAFT: ProductEditDraft = {
  title: "",
  categoryId: "",
  brand: "",
  description: "",
  condition: "NEW",
  sku: "",
  status: "DRAFT",
  price: "",
  originalPrice: "",
  stock: "",
  highlights: [],
  specifications: [],
  variants: [],
  images: [],
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const { data: product, isLoading } = useMyProduct(id);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const [draft, setDraft] = useState<ProductEditDraft>(EMPTY_DRAFT);

  useEffect(() => {
    if (!product) return;

    setDraft({
      title: product.title,
      categoryId: product.categoryId,
      brand: product.brand ?? "",
      description: product.description,
      condition: product.condition,
      sku: product.sku,
      status: product.status,
      price: String(product.price),
      originalPrice: product.originalPrice != null ? String(product.originalPrice) : "",
      stock: String(product.stock),
      highlights: product.highlights ?? [],
      specifications: product.specifications.map((spec) => ({
        id: spec.id ?? crypto.randomUUID(),
        key: spec.name,
        value: spec.value,
      })),
      variants: product.variants.map((variant) => ({
        id: variant.id ?? crypto.randomUUID(),
        name: variant.name,
        value: variant.value,
        price: variant.price != null ? String(variant.price) : "",
        stock: variant.stock != null ? String(variant.stock) : "",
      })),
      images: product.images.map((image) => ({
        id: image.id ?? crypto.randomUUID(),
        preview: image.url,
        url: image.url,
        isCover: !!image.isPrimary,
        uploading: false,
      })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const isUploading = draft.images.some((image) => image.uploading);
  const canSave =
    !!draft.title.trim() &&
    !!draft.categoryId &&
    !!draft.sku.trim() &&
    !!draft.price &&
    draft.stock !== "" &&
    !isUploading;

  const handleSave = () => {
    updateProduct(
      {
        id,
        data: {
          categoryId: draft.categoryId,
          title: draft.title.trim(),
          description: draft.description.trim(),
          sku: draft.sku.trim(),
          brand: draft.brand.trim() || undefined,
          condition: draft.condition,
          status: draft.status,
          price: Number(draft.price),
          originalPrice: draft.originalPrice ? Number(draft.originalPrice) : undefined,
          stock: Number(draft.stock),
          images: draft.images
            .filter((image) => image.url)
            .map((image) => ({ url: image.url as string, isPrimary: image.isCover })),
          specifications: draft.specifications
            .filter((spec) => spec.key.trim())
            .map((spec) => ({ name: spec.key.trim(), value: spec.value.trim() })),
          highlights: draft.highlights,
          variants: draft.variants
            .filter((variant) => variant.name.trim() && variant.value.trim())
            .map((variant) => ({
              name: variant.name.trim(),
              value: variant.value.trim(),
              price: variant.price ? Number(variant.price) : undefined,
              stock: variant.stock ? Number(variant.stock) : undefined,
            })),
        },
      },
      {
        onSuccess: () => router.push(PRODUCTS_PATH),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <FormCardSkeleton fields={4} />
        <FormCardSkeleton fields={2} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-2xl border border-[#ECE9F6] bg-white px-8 py-16 text-center text-[13.5px] text-[#94A3B8]">
        Product not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={PRODUCTS_PATH}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-violet-700"
        >
          <ArrowLeft size={14} />
          Back to products
        </Link>

        <p className="mt-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
          Catalog
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[34px] italic text-[#13131A] sm:text-[40px]">
          Edit product
        </h1>
        <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-[#64748B]">
          Update {product.title} — changes apply as soon as you save.
        </p>
      </div>

      <EditBasicSection draft={draft} setDraft={setDraft} />
      <EditPricingSection draft={draft} setDraft={setDraft} />
      <EditImagesSection draft={draft} setDraft={setDraft} />
      <EditSpecsSection draft={draft} setDraft={setDraft} />

      <div className="flex items-center justify-end gap-3 rounded-2xl border border-[#ECE9F6] bg-white p-5">
        <Button variant="outline" onClick={() => router.push(PRODUCTS_PATH)} className="h-11 rounded-xl px-7">
          Cancel
        </Button>
        <Button
          variant="tribely"
          onClick={handleSave}
          disabled={!canSave || isPending}
          className="h-11 rounded-xl px-7"
        >
          {isPending ? "Saving..." : isUploading ? "Uploading..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
