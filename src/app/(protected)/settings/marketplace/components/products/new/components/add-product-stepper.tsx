"use client";

import { Check } from "lucide-react";

interface Props {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const steps = ["Basic info", "Pricing", "Specifications", "Images", "Shipping", "Review"];

export default function AddProductStepper({ currentStep, onStepClick }: Props) {
  return (
    <div>
      {/* Progress bars */}
      <div className="grid grid-cols-6 gap-1.5">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const completed = currentStep > stepNumber;
          const active = currentStep === stepNumber;

          return (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-colors ${
                completed ? "bg-emerald-500" : active ? "bg-violet-600" : "bg-[#ECE9F6]"
              }`}
            />
          );
        })}
      </div>

      {/* Step labels — desktop: full row, mobile: current step only */}
      <div className="mt-4 hidden gap-1.5 sm:grid sm:grid-cols-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const completed = currentStep > stepNumber;
          const active = currentStep === stepNumber;
          const clickable = completed && onStepClick;

          return (
            <button
              key={step}
              onClick={() => clickable && onStepClick(stepNumber)}
              disabled={!clickable}
              className={`flex items-center gap-1.5 text-left ${clickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-mono)] text-[10px] font-semibold transition-colors ${
                  completed
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-violet-600 text-white"
                    : "bg-[#ECE9F6] text-[#94A3B8]"
                }`}
              >
                {completed ? <Check size={11} /> : stepNumber}
              </div>

              <span
                className={`truncate text-[12.5px] ${
                  active ? "font-semibold text-violet-700" : completed ? "text-[#334155]" : "text-[#94A3B8]"
                }`}
              >
                {step}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile: current step only */}
      <div className="mt-3 flex items-center justify-between sm:hidden">
        <p className="font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
          Step {currentStep} of {steps.length}
        </p>
        <p className="text-[13px] font-semibold text-violet-700">{steps[currentStep - 1]}</p>
      </div>
    </div>
  );
}