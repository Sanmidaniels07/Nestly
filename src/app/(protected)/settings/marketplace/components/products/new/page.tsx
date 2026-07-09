"use client";

import { useState } from "react";
import AddProductHeader from "./components/add-products-header";
import AddProductStepper from "./components/add-product-stepper";
import { ProductDraft } from "@/src/types/products-draft";
import BasicInformation from "./components/basic-information";
import PricingInventory from "./components/price-inventory";
import Specifications from "./components/specification";

export default function AddProductPage() {
  const [step, setStep] = useState(1);

  const [draft, setDraft] = useState<ProductDraft>({
    name: "",
    category: "",
    brand: "",
    description: "",
    condition: "",
    sku: "",
    tags: [],

    price: "",
    comparePrice: "",
    stock: "",
    lowStock: "",
    status: "Draft",

    specifications: [],

    images: [],

    weight: "",
    shippingFee: "",
    deliveryTime: "",
  });

  return (
    <div className="space-y-8">
      <AddProductHeader />

      <AddProductStepper currentStep={step} />

      {step === 1 && (
        <BasicInformation
          draft={draft}
          setDraft={setDraft}
          onNext={() => setStep(2)}
        />
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

      {/* {step === 4 && (
        <ProductImages
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      )} */}

      {/* {step === 5 && (
        <Shipping
          onBack={() => setStep(4)}
          onNext={() => setStep(6)}
        />
      )} */}

      {/* {step === 6 && (
        <ReviewPublish
          onBack={() => setStep(5)}
        />
      )} */}
    </div>
  );
}
