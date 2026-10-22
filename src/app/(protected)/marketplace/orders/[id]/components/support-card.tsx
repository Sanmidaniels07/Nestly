"use client";

import { Headphones, MessageCircle } from "lucide-react";

import { orderReference, supportWhatsAppUrl } from "@/src/lib/support";

interface Props {
  orderId: string;
}

export default function SupportCard({ orderId }: Props) {
  const reference = orderReference(orderId);

  return (
    <section className="rounded-2xl border border-line bg-gradient-to-br from-violet-50 dark:from-violet-500/10 to-surface p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600">
          <Headphones size={19} className="text-white" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-ink">Need help with this order?</h3>
          <p className="text-[13px] text-muted">Chat with Nestly Support on WhatsApp.</p>
        </div>
      </div>

      <a
        href={supportWhatsAppUrl(`Hi Nestly Support, I need help with my order ${reference}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-[13.5px] font-semibold text-white transition hover:brightness-95"
      >
        <MessageCircle size={17} />
        Chat with support
      </a>
      <p className="mt-2.5 text-center text-[12px] text-subtle">
        Your order number {reference} is added to the message.
      </p>
    </section>
  );
}
