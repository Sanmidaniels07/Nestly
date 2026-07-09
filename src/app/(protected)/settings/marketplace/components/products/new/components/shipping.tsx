"use client";

import { useState } from "react";
import Input from "@/src/components/ui/input";
import FormSelect from "@/src/components/ui/form-select";
import Button from "@/src/components/ui/button";
import { ProductDraft } from "@/src/types/products-draft";
import CheckboxRow from "@/src/components/ui/checkbox-row";

interface Props {
  draft: ProductDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductDraft>>;
  onBack: () => void;
  onNext: () => void;
}

const regions = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin", "Kano"];

const deliveryTimeOptions = [
  { label: "1–2 business days", value: "1-2 business days" },
  { label: "2–5 business days", value: "2-5 business days" },
  { label: "5–10 business days", value: "5-10 business days" },
  { label: "2+ weeks", value: "2+ weeks" },
];

interface Errors {
  weight?: string;
  regions?: string;
}

export default function Shipping({ draft, setDraft, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<Errors>({});

  const toggleRegion = (region: string) => {
    setDraft((prev) => ({
      ...prev,
      shippingRegions: prev.shippingRegions.includes(region)
        ? prev.shippingRegions.filter((item) => item !== region)
        : [...prev.shippingRegions, region],
    }));

    if (errors.regions) setErrors((prev) => ({ ...prev, regions: undefined }));
  };

  const handleContinue = () => {
    const nextErrors: Errors = {};

    if (!draft.weight || Number(draft.weight) <= 0) {
      nextErrors.weight = "Enter the product weight";
    }

    if (draft.deliveryAvailable && draft.shippingRegions.length === 0) {
      nextErrors.regions = "Select at least one region you deliver to";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;
    onNext();
  };

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <div className="space-y-8">
        {/* Dimensions */}
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
            Dimensions
          </h2>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Used to calculate accurate shipping costs.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Input
              label="Weight (kg)"
              placeholder="0.0"
              inputMode="decimal"
              value={draft.weight}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, weight: e.target.value }));
                if (errors.weight) setErrors((prev) => ({ ...prev, weight: undefined }));
              }}
              error={errors.weight}
            />
            <Input
              label="Length (cm)"
              placeholder="0"
              inputMode="decimal"
              value={draft.length}
              onChange={(e) => setDraft((prev) => ({ ...prev, length: e.target.value }))}
            />
            <Input
              label="Width (cm)"
              placeholder="0"
              inputMode="decimal"
              value={draft.width}
              onChange={(e) => setDraft((prev) => ({ ...prev, width: e.target.value }))}
            />
            <Input
              label="Height (cm)"
              placeholder="0"
              inputMode="decimal"
              value={draft.height}
              onChange={(e) => setDraft((prev) => ({ ...prev, height: e.target.value }))}
            />
          </div>
        </div>

        <div className="border-t border-[#F2F1F8]" />

        {/* Delivery */}
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
            Delivery
          </h2>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Set what buyers pay and how long it takes.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Input
              label="Shipping fee"
              placeholder="₦0.00"
              inputMode="numeric"
              value={draft.shippingFee}
              disabled={draft.freeDelivery}
              onChange={(e) => setDraft((prev) => ({ ...prev, shippingFee: e.target.value }))}
            />

            <FormSelect
              label="Delivery time"
              placeholder="Select estimate"
              value={draft.deliveryTime}
              onChange={(value) => setDraft((prev) => ({ ...prev, deliveryTime: value }))}
              options={deliveryTimeOptions}
            />
          </div>
        </div>

        <div className="border-t border-[#F2F1F8]" />

        {/* Availability */}
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
            Availability
          </h2>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Choose how buyers can receive this product.
          </p>

          <div className="mt-5 space-y-2.5">
            <CheckboxRow
              label="Delivery available"
              description="Ship to buyers in your selected regions"
              checked={draft.deliveryAvailable}
              onChange={(checked) => setDraft((prev) => ({ ...prev, deliveryAvailable: checked }))}
            />
            <CheckboxRow
              label="Pickup available"
              description="Let buyers collect from your location"
              checked={draft.pickupAvailable}
              onChange={(checked) => setDraft((prev) => ({ ...prev, pickupAvailable: checked }))}
            />
            <CheckboxRow
              label="Free delivery"
              description="Waive the shipping fee for this product"
              checked={draft.freeDelivery}
              onChange={(checked) =>
                setDraft((prev) => ({
                  ...prev,
                  freeDelivery: checked,
                  shippingFee: checked ? "0" : prev.shippingFee,
                }))
              }
            />
          </div>
        </div>

        {/* Shipping regions — only relevant if delivery is enabled */}
        {draft.deliveryAvailable && (
          <div>
            <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
              Shipping regions
            </h2>
            <p className="mt-1 text-[13px] text-[#64748B]">
              Select where you're able to deliver.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {regions.map((region) => {
                const active = draft.shippingRegions.includes(region);

                return (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className={`
                      rounded-full px-4 py-2 text-[13px] font-medium transition-colors
                      ${active ? "bg-violet-600 text-white" : "border border-[#ECE9F6] text-[#64748B] hover:border-violet-200"}
                    `}
                  >
                    {region}
                  </button>
                );
              })}
            </div>

            {errors.regions && <p className="mt-2 text-[12px] text-red-500">{errors.regions}</p>}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between border-t border-[#F2F1F8] pt-6">
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