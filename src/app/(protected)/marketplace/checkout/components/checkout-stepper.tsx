"use client";

interface Props {
  step: 1 | 2 | 3;
}

const steps = ["Cart", "Checkout", "Payment"];

export default function CheckoutStepper({ step }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const current = index + 1;
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
                    current <= step
                      ? "bg-violet-600 text-white"
                      : "bg-[#F3F1FA] text-[#94A3B8]"
                  }`}
                >
                  {current}
                </div>
                <span
                  className={`mt-2 text-[13px] font-medium ${
                    current <= step ? "text-[#13131A]" : "text-[#94A3B8]"
                  }`}
                >
                  {label}
                </span>
              </div>

              {current !== steps.length && (
                <div
                  className={`mx-4 h-[2px] flex-1 rounded-full transition-colors ${
                    current < step ? "bg-violet-600" : "bg-[#ECE9F6]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}