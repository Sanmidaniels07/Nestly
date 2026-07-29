"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function AddProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [draft, setDraft] = useState<ProductDraft>({
    name: "",
    categoryId: "",
    brand: "",
    description: "",
    condition: "NEW",
    sku: "",

    price: "",
    comparePrice: "",
    stock: "",

    specifications: [],
    highlights: [],
    variants: [],

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
  });

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
    });

    const created = (response as { data: { id: string } }).data;

    if (status === "PUBLISHED") {
      await updateProduct({ id: created.id, data: { status: "PUBLISHED" } });
    }

    router.push("/settings/marketplace/components/products");
  };

  return (
    <div className="space-y-8">
      <AddProductHeader />

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
