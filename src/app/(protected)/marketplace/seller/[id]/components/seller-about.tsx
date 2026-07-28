"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Store } from "@/src/types/store";

interface Props {
  store: Store;
}

export default function SellerAbout({ store }: Props) {
  const location = [store.address, store.city, store.state, store.country]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
        About seller
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[24px] italic text-[#13131A]">
        Meet {store.name}
      </h2>

      {store.description && (
        <p className="mt-6 max-w-3xl text-[13.5px] leading-7 text-[#64748B]">
          {store.description}
        </p>
      )}

      <div className="mt-7 space-y-4 border-t border-dashed border-[#ECE9F6] pt-6">
        {location && <ContactRow icon={<MapPin size={15} />}>{location}</ContactRow>}
        {store.email && <ContactRow icon={<Mail size={15} />}>{store.email}</ContactRow>}
        {store.phone && <ContactRow icon={<Phone size={15} />}>{store.phone}</ContactRow>}
      </div>
    </section>
  );
}

function ContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[13.5px] text-[#334155]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
        {icon}
      </div>
      {children}
    </div>
  );
}
