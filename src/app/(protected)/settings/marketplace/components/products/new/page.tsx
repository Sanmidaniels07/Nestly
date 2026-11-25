"use client";

import { Suspense, useState } from "react";
import toast from "react-hot-toast";
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
import { useFormDraft } from "@/src/hooks/use-form-draft";
import DraftRestoredNotice from "@/src/components/ui/draft-restored-notice";
import { AiListingDraft, PriceGuide } from "@/src/services/ai-listing.services";
import FillFromPhotos from "./components/fill-from-photos";

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

const PRODUCTS_PATH = "/settings/marketplace?tab=products";

const EMPTY_DRAFT: ProductDraft = {
    name: "",
    categoryId: "",
    brand: "",
    description: "",
    condition: "NEW",
    sku: "",
    deliveryVehicle: "BIKE",

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
  // button returns to the previous step instead of leaving the form. A step
  // can't be shown beyond the furthest one reached (kept with the draft).
  const [maxStep, setMaxStep] = useState(1);
  const [priceGuide, setPriceGuide] = useState<PriceGuide | null>(null);

  // What the seller typed is kept in this browser (per account) until they
  // save the product, so a refresh or logging out brings them back here.
  // Only finished uploads are kept - a photo still uploading is lost.
  const savable = {
    draft: {
      ...draft,
      images: draft.images
        .filter((image) => image.url && !image.uploading)
        .map(({ file: _file, ...image }) => ({ ...image, preview: image.url as string })),
    },
    maxStep,
    priceGuide,
  };
  const { restored, clear: clearSaved, dismissNotice } = useFormDraft(
    "product:new",
    savable,
    (saved) => {
      setDraft({ ...EMPTY_DRAFT, ...saved.draft });
      setMaxStep(saved.maxStep || 1);
      setPriceGuide(saved.priceGuide ?? null);
    },
    { isEmpty: (value) => JSON.stringify(value.draft) === JSON.stringify(EMPTY_DRAFT) }
  );

  const startOver = () => {
    setDraft(EMPTY_DRAFT);
    setMaxStep(1);
    setPriceGuide(null);
    clearSaved();
    router.replace(pathname);
  };

  const applySuggestion = (suggestion: AiListingDraft, photoUrls: string[] = []) => {
    setDraft((prev) => {
      const known = new Set(prev.images.map((image) => image.url));
      const newPhotos = photoUrls
        .filter((url) => !known.has(url))
        .map((url, index) => ({
          id: crypto.randomUUID(),
          preview: url,
          url,
          isCover: prev.images.length === 0 && index === 0,
          uploading: false,
        }));
      return {
        ...prev,
        name: suggestion.title,
        description: suggestion.description,
        categoryId: suggestion.categoryId ?? prev.categoryId,
        brand: suggestion.brand,
        condition: suggestion.condition,
        deliveryVehicle: suggestion.deliveryVehicle,
        highlights: suggestion.highlights,
        specifications: suggestion.specifications.map((spec) => ({ id: crypto.randomUUID(), key: spec.name, value: spec.value })),
        images: [...prev.images, ...newPhotos],
      };
    });
    setPriceGuide(suggestion.priceGuide);
  };
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

  // What they typed is kept (useFormDraft above), so leaving is safe - they
  // pick up here next time.
  const handleBackToProducts = () => {
    if (isDirty) toast("We'll keep what you entered so you can finish later.");
    exitForm();
  };

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
      deliveryVehicle: draft.deliveryVehicle,
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

    clearSaved();
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

      {restored && <DraftRestoredNotice what="the product you started" onStartOver={startOver} onDismiss={dismissNotice} />}

      <AddProductStepper currentStep={step} onStepClick={setStep} />

      {/* Photos first: they're what sells, and (when it's on) they can
          write the rest of the listing. */}
      {step === 1 && (
        <ProductImages draft={draft} setDraft={setDraft} first onBack={handleBackToProducts} onNext={() => setStep(2)}>
          <FillFromPhotos
            photoUrls={draft.images.filter((image) => image.url && !image.uploading).map((image) => image.url as string)}
            hasContent={!!(draft.name.trim() || draft.description.trim())}
            onApply={(suggestion) => {
              applySuggestion(suggestion);
              setStep(2);
            }}
          />
        </ProductImages>
      )}

      {step === 2 && <BasicInformation draft={draft} setDraft={setDraft} onBack={() => setStep(1)} onNext={() => setStep(3)} />}

      {step === 3 && priceGuide && (
        <p className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-[13px] text-muted">
          Similar products on Nestly usually sell for{" "}
          <span className="font-semibold text-ink">
            {naira(priceGuide.low)} - {naira(priceGuide.high)}
          </span>{" "}
          ({priceGuide.basedOn} listings). Set the price that&apos;s right for yours.
        </p>
      )}

      {step === 3 && (
        <PricingInventory
          draft={draft}
          setDraft={setDraft}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <Specifications
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
