"use client";

import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import Input from "@/src/components/ui/input";
import SavedCards from "./saved-cards";

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function detectCardBrand(digits: string) {
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^506(0|1)|^507(8|9)|^6500/.test(digits)) return "Verve";
  return null;
}

export default function CardPaymentForm() {
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const rawDigits = cardNumber.replace(/\s/g, "");
  const brand = detectCardBrand(rawDigits);

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <SavedCards />

      <div className="my-8 flex items-center">
        <div className="h-px flex-1 bg-[#ECE9F6]" />
        <span className="px-4 text-[13px] text-[#94A3B8]">or pay with another card</span>
        <div className="h-px flex-1 bg-[#ECE9F6]" />
      </div>

      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50">
          <CreditCard size={18} className="text-violet-700" />
        </div>
        <div>
          <h2 className="text-[16px] font-semibold text-[#13131A]">Card details</h2>
          <p className="text-[13px] text-[#64748B]">Your payment is encrypted and secure.</p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Card holder"
          placeholder="Daniel Sanmi"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
        />

        <div>
          <Input
            label="Card number"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            inputMode="numeric"
          />
          {brand && (
            <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[11.5px] text-violet-600">
              {brand}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            inputMode="numeric"
          />
          <Input
            label="CVV"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            type="password"
          />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-emerald-50 p-3.5">
        <Lock size={16} className="mt-0.5 shrink-0 text-emerald-600" />
        <p className="text-[12.5px] leading-relaxed text-[#475569]">
          Your card information is encrypted using PCI-DSS compliant payment security.
        </p>
      </div>
    </section>
  );
}