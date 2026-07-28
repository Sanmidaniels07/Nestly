"use client";

import { useState } from "react";
import { ShieldAlert, Ticket } from "lucide-react";

import { useAuthStore } from "@/src/store/auth-store";
import ReportsQueue from "./reports-queue";
import CouponsManager from "./coupons-manager";

type Tab = "reports" | "coupons";

const tabs: { id: Tab; label: string; icon: typeof ShieldAlert }[] = [
  { id: "reports", label: "Reports", icon: ShieldAlert },
  { id: "coupons", label: "Coupons", icon: Ticket },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("reports");
  const role = useAuthStore((state) => state.user?.role);

  if (role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <p className="text-[15px] font-medium text-[#13131A]">Not authorized</p>
        <p className="mt-1 text-[13.5px] text-[#64748B]">
          This area is only available to admins.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 pt-6">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-widest text-violet-600">
          Admin
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-[36px] italic leading-none text-[#13131A]">
          Moderation
        </h1>
      </div>

      <div className="inline-flex gap-0.5 rounded-xl bg-[#F7F7FB] p-1">
        {tabs.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-[13.5px] font-medium transition-all ${
                isActive ? "bg-white text-violet-700 shadow-sm" : "text-[#64748B] hover:text-[#13131A]"
              }`}
            >
              <t.icon size={15} className={isActive ? "text-violet-600" : "text-[#94A3B8]"} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "reports" ? <ReportsQueue /> : <CouponsManager />}
    </div>
  );
}
