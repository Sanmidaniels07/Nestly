"use client";

import { useState } from "react";

import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import { ProductDraft } from "@/src/types/products-draft";
import EarningsPreview from "../../components/earnings-preview";

interface Props {
  draft: ProductDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductDraft>>;
  onBack: () => void;
  onNext: () => void;
}

interface Errors {
  price?: string;
  stock?: string;
}

export default function PricingInventory({ draft, setDraft, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<Errors>({});

  const clearError = (field: keyof Errors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleContinue = () => {
    const nextErrors: Errors = {};

    const price = Number(draft.price);
    if (!draft.price || Number.isNaN(price) || price <= 0) {
      nextErrors.price = "Enter a valid selling price";
    }

    const stock = Number(draft.stock);
    if (draft.stock === "" || Number.isNaN(stock) || stock < 0) {
      nextErrors.stock = "Enter a valid stock quantity";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;
    onNext();
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="space-y-8">
        {/* Pricing */}
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
            Pricing
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Set what buyers will pay for this product.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Input
              label="Selling price"
              placeholder="₦0.00"
              inputMode="numeric"
              value={draft.price}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, price: e.target.value }));
                clearError("price");
              }}
              error={errors.price}
            />
            <Input
              label="Compare-at price"
              placeholder="Optional"
              inputMode="numeric"
              value={draft.comparePrice}
              onChange={(e) => setDraft((prev) => ({ ...prev, comparePrice: e.target.value }))}
            />
          </div>

          {draft.comparePrice &&
            draft.price &&
            Number(draft.comparePrice) > 0 &&
            Number(draft.comparePrice) <= Number(draft.price) && (
              <p className="mt-2 text-[12px] text-amber-600 dark:text-amber-400">
                Compare-at price should be higher than the selling price to show a discount.
              </p>
            )}

          <EarningsPreview price={draft.price} categoryId={draft.categoryId} />
        </div>

        <div className="border-t border-line-soft" />

        {/* Inventory */}
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
            Inventory
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Track how much stock you have.
          </p>

          <div className="mt-5">
            <Input
              label="Stock quantity"
              placeholder="0"
              inputMode="numeric"
              value={draft.stock}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, stock: e.target.value }));
                clearError("stock");
              }}
              error={errors.stock}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between border-t border-line-soft pt-6">
        <Button variant="outline" onClick={onBack} className="h-11 rounded-xl px-7">
          Back
        </Button>
        <Button variant="tribely" onClick={handleContinue} className="h-11 rounded-xl px-7">
          Continue
        </Button>
      </div>
    </section>
  );
}
