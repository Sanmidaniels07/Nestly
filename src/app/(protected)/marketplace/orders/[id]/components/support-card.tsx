"use client";

import { Headphones, MessageCircle, ShieldCheck } from "lucide-react";

export default function SupportCard() {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-gradient-to-br from-violet-50 to-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600">
          <Headphones size={19} className="text-white" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-[#13131A]">Need help?</h3>
          <p className="text-[13px] text-[#64748B]">Our support team is here for you.</p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#ECE9F6] bg-white text-[13px] font-semibold text-[#334155] transition-colors hover:border-violet-300">
          <MessageCircle size={16} className="text-violet-600" />
          Chat seller
        </button>

        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#ECE9F6] bg-white text-[13px] font-semibold text-[#334155] transition-colors hover:border-violet-300">
          <ShieldCheck size={16} className="text-violet-600" />
          Report an issue
        </button>
      </div>
    </section>
  );
}