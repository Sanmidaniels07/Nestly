"use client";

import { use, useEffect, useState } from "react";

import { useMyProduct } from "@/src/hooks/use-my-product";
import { useUpdateProduct } from "@/src/hooks/use-update-product";
import Button from "@/src/components/ui/button";
import BackButton from "@/src/components/ui/back-button";
import { useGoBack } from "@/src/hooks/use-go-back";
import { ProductEditDraft } from "./types";
import EditBasicSection from "./components/edit-basic-section";
import EditPricingSection from "./components/edit-pricing-section";
import EditImagesSection from "./components/edit-images-section";
import EditSpecsSection from "./components/edit-specs-section";
import { FormCardSkeleton } from "@/src/components/skeletons/form-card-skeleton";
import { EMPTY_OPTIONS, optionsDraftFrom, optionsError, optionsPayload, totalStock } from "@/src/lib/product-options";
import { isDifferentProduct } from "@/src/lib/product-history";
import { History } from "lucide-react";

const PRODUCTS_PATH = "/settings/marketplace?tab=products";

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
  optionsDraft: EMPTY_OPTIONS,
  highlights: [],
  specifications: [],
  images: [],
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: Props) {
  const { id } = use(params);
  const goBack = useGoBack(PRODUCTS_PATH);

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
      optionsDraft: optionsDraftFrom(product),
      highlights: product.highlights ?? [],
      specifications: product.specifications.map((spec) => ({
        id: spec.id ?? crypto.randomUUID(),
        key: spec.name,
        value: spec.value,
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
  const optionsProblem = optionsError(draft.optionsDraft);
  // Options are only sent when the product has (or had) them, so editing a
  // product without options never touches them.
  const hadOptions = (product?.options?.length ?? 0) > 0;
  const sendOptions = draft.optionsDraft.enabled || hadOptions;
  const canSave =
    !!draft.title.trim() &&
    !!draft.categoryId &&
    !!draft.sku.trim() &&
    !!draft.price &&
    (draft.optionsDraft.enabled || draft.stock !== "") &&
    !optionsProblem &&
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
          stock: draft.optionsDraft.enabled ? totalStock(draft.optionsDraft) : Number(draft.stock),
          images: draft.images
            .filter((image) => image.url)
            .map((image) => ({ url: image.url as string, isPrimary: image.isCover })),
          specifications: draft.specifications
            .filter((spec) => spec.key.trim())
            .map((spec) => ({ name: spec.key.trim(), value: spec.value.trim() })),
          highlights: draft.highlights,
          ...(sendOptions ? optionsPayload(draft.optionsDraft) : {}),
        },
      },
      {
        onSuccess: () => goBack(),
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
      <div className="rounded-2xl border border-line bg-surface px-8 py-16 text-center text-[13.5px] text-subtle">
        Product not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <BackButton fallbackHref={PRODUCTS_PATH} label="Back to products" />

        <p className="mt-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
          Catalog
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[34px] italic text-ink sm:text-[40px]">
          Edit product
        </h1>
        <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-muted">
          Update {product.title} — changes apply as soon as you save.
        </p>
      </div>

      <EditBasicSection draft={draft} setDraft={setDraft} />
      <EditPricingSection
        draft={draft}
        setDraft={setDraft}
        optionsError={optionsProblem}
        legacyVariants={product.legacyVariants}
      />
      <EditImagesSection draft={draft} setDraft={setDraft} />
      <EditSpecsSection draft={draft} setDraft={setDraft} />

      {draft.title.trim() &&
        draft.categoryId &&
        isDifferentProduct(product, { title: draft.title, categoryId: draft.categoryId }) && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            <History size={17} className="mt-0.5 shrink-0" />
            <p>
              <span className="font-semibold">This looks like a different product now</span>
              {product.categoryId !== draft.categoryId ? " (new category)" : " (mostly new title)"}. If you save, reviews written so far will
              be labelled as for an earlier version and won&apos;t count towards its rating. To sell something new, add it as a new
              product instead.
            </p>
          </div>
        )}

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-end">
        <Button variant="outline" onClick={() => goBack()} className="h-11 rounded-xl px-7">
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
