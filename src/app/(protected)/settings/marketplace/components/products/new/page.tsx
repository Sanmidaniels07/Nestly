"use client";

import { useState } from "react";
import AddProductHeader from "./components/add-products-header";
import AddProductStepper from "./components/add-product-stepper";
import { ProductDraft } from "@/src/types/products-draft";
import BasicInformation from "./components/basic-information";
import PricingInventory from "./components/price-inventory";
import Specifications from "./components/specification";
import ProductImages from "./components/product-images";
import Shipping from "./components/shipping";
import ReviewPublish from "./components/review-publish";

export default function AddProductPage() {
  const [step, setStep] = useState(1);

  const [draft, setDraft] = useState<ProductDraft>({
    // Step 1
    name: "",
    category: "",
    brand: "",
    description: "",
    condition: "",
    sku: "",
    tags: [],

    // Step 2
    price: "",
    comparePrice: "",
    stock: "",
    lowStock: "",
    status: "Draft",

    // Step 3
    specifications: [],

    // Step 4
    images: [],

    // Step 5
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

  return (
    <div className="space-y-8">
      <AddProductHeader />

      <AddProductStepper currentStep={step} />

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
        <Shipping
          draft={draft}
          setDraft={setDraft}
          onBack={() => setStep(4)}
          onNext={() => setStep(6)}
        />
      )}

      {step === 6 && (
        <ReviewPublish
          draft={draft}
          onBack={() => setStep(5)}
          onPublish={() => console.log("Product published")}
          onSaveDraft={() => console.log("Draft saved")}
        />
      )}
    </div>
  );
}