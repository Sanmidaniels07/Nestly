"use client";

interface Props {
  step: 1 | 2 | 3;
}

const steps = ["Cart", "Checkout", "Payment"];

export default function CheckoutStepper({ step }: Props) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
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
                      : "bg-surface-muted text-subtle"
                  }`}
                >
                  {current}
                </div>
                <span
                  className={`mt-2 text-[13px] font-medium ${
                    current <= step ? "text-ink" : "text-subtle"
                  }`}
                >
                  {label}
                </span>
              </div>

              {current !== steps.length && (
                <div
                  className={`mx-4 h-[2px] flex-1 rounded-full transition-colors ${
                    current < step ? "bg-violet-600" : "bg-track"
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