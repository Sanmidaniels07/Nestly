"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useCreateProduct } from "@/src/hooks/use-create-product";
import { useUpdateProduct } from "@/src/hooks/use-update-product";
import { ProductDraft } from "@/src/types/products-draft";
import AddProductHeader from "./components/add-products-header";
import AddProductStepper from "./components/add-product-stepper";
import BasicInformation from "./components/basic-information";
import PricingInventory from "./components/price-inventory";
import Specifications from "./components/specification";
import ProductImages from "./components/product-images";
import ReviewPublish from "./components/review-publish";
import BackButton from "@/src/components/ui/back-button";
import { canGoBack, useGoBack } from "@/src/hooks/use-go-back";
import { EMPTY_OPTIONS, optionsPayload, totalStock } from "@/src/lib/product-options";

const PRODUCTS_PATH = "/settings/marketplace?tab=products";

const EMPTY_DRAFT: ProductDraft = {
    name: "",
    categoryId: "",
    brand: "",
    description: "",
    condition: "NEW",
    sku: "",

    price: "",
    comparePrice: "",
    stock: "",
    optionsDraft: EMPTY_OPTIONS,

    specifications: [],
    highlights: [],

    images: [],

    // Legacy shipping step defaults — unused by the real create-product flow
    weight: "",
    length: "",
    width: "",
    height: "",
    shippingFee: "",
    deliveryTime: "",
    pickupAvailable: false,
    deliveryAvailable: true,
    freeDelivery: false,
    shippingRegions: [],
};

function AddProductContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const goBack = useGoBack(PRODUCTS_PATH);

  const [draft, setDraft] = useState<ProductDraft>(EMPTY_DRAFT);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(EMPTY_DRAFT);

  // Each step is its own history entry (?step=N), so the phone / browser back
  // button returns to the previous step instead of leaving the form and
  // throwing the draft away. The draft only lives in memory, so a step can't
  // be shown beyond the furthest one reached this session (e.g. after a refresh).
  const [maxStep, setMaxStep] = useState(1);
  const urlStep = Number(searchParams.get("step")) || 1;
  const step = Math.min(Math.max(urlStep, 1), maxStep);

  const setStep = (next: number) => {
    if (next > step) {
      setMaxStep((current) => Math.max(current, next));
      router.push(`${pathname}?step=${next}`);
    } else if (next < step) {
      // Pop the step entries rather than pushing new ones, so history stays
      // a clean stack and Back to products can leave the whole form at once.
      if (canGoBack(step - next)) {
        window.history.go(-(step - next));
      } else {
        router.replace(next === 1 ? pathname : `${pathname}?step=${next}`);
      }
    }
  };

  // Leaves every step of the form at once, back to wherever the seller came from.
  const exitForm = () => goBack(step);

  const handleBackToProducts = () => {
    if (isDirty && !window.confirm("Discard this product? Your changes won't be saved.")) return;
    exitForm();
  };

  // Refreshing or closing the tab would also lose the draft.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isPublishing } = useUpdateProduct();

  const handleSubmit = async (status: "PUBLISHED" | "DRAFT") => {
    const response = await createProduct({
      categoryId: draft.categoryId,
      title: draft.name.trim(),
      description: draft.description.trim(),
      sku: draft.sku.trim(),
      brand: draft.brand.trim() || undefined,
      condition: draft.condition,
      price: Number(draft.price),
      originalPrice: draft.comparePrice ? Number(draft.comparePrice) : undefined,
      stock: draft.optionsDraft.enabled ? totalStock(draft.optionsDraft) : Number(draft.stock),
      images: draft.images
        .filter((image) => image.url)
        .map((image) => ({ url: image.url as string, isPrimary: image.isCover })),
      specifications: draft.specifications
        .filter((spec) => spec.key.trim())
        .map((spec) => ({ name: spec.key.trim(), value: spec.value.trim() })),
      highlights: draft.highlights,
      ...(draft.optionsDraft.enabled ? optionsPayload(draft.optionsDraft) : {}),
    });

    const created = (response as { data: { id: string } }).data;

    if (status === "PUBLISHED") {
      await updateProduct({ id: created.id, data: { status: "PUBLISHED" } });
    }

    exitForm();
  };

  return (
    <div className="space-y-8">
      <div>
        <BackButton
          fallbackHref={PRODUCTS_PATH}
          label="Back to products"
          onClick={handleBackToProducts}
        />
        <div className="mt-4">
          <AddProductHeader />
        </div>
      </div>

      <AddProductStepper currentStep={step} onStepClick={setStep} />

      {step === 1 && (
        <BasicInformation draft={draft} setDraft={setDraft} onNext={() => setStep(2)} />
      )}

      {step === 2 && (
        <PricingInventory
          draft={draft}
          setDraft={setDraft}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Specifications
          draft={draft}
          setDraft={setDraft}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <ProductImages
          draft={draft}
          setDraft={setDraft}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <ReviewPublish
          draft={draft}
          isSubmitting={isCreating || isPublishing}
          onBack={() => setStep(4)}
          onPublish={() => handleSubmit("PUBLISHED")}
          onSaveDraft={() => handleSubmit("DRAFT")}
          onStepClick={setStep}
        />
      )}
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={null}>
      <AddProductContent />
    </Suspense>
  );
}
