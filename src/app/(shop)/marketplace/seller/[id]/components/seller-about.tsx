"use client";

import { MapPin, MessageCircle, ShieldAlert } from "lucide-react";
import { Store } from "@/src/types/store";

interface Props {
  store: Store;
}

export default function SellerAbout({ store }: Props) {
  const location = [store.address, store.city, store.state, store.country]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="rounded-2xl border border-line bg-surface p-7">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
        About seller
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[24px] italic text-ink">
        Meet {store.name}
      </h2>

      {store.description && (
        <p className="mt-6 max-w-3xl text-[13.5px] leading-7 text-muted">
          {store.description}
        </p>
      )}

      <div className="mt-7 space-y-4 border-t border-dashed border-line pt-6">
        {location && <ContactRow icon={<MapPin size={15} />}>{location}</ContactRow>}
        {/* No email/phone - buyers message sellers in the app (see seller-profile). */}
        <ContactRow icon={<MessageCircle size={15} />}>Questions? Message the seller on Nestly.</ContactRow>
        <ContactRow icon={<ShieldAlert size={15} />}>Always pay through Nestly checkout - payments made directly to a seller aren&apos;t covered by buyer protection.</ContactRow>
      </div>
    </section>
  );
}

function ContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[13.5px] text-ink-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
        {icon}
      </div>
      {children}
    </div>
  );
}
