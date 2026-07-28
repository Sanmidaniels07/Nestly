"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Store } from "@/src/types/store";
import UserAvatar from "@/src/components/ui/user-avatar";

interface Props {
  store: Store;
}

export default function SellerProfile({ store }: Props) {
  const location = [store.city, store.state].filter(Boolean).join(", ");

  return (
    <section className="relative z-10 -mt-16 sm:-mt-20">
      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6 shadow-[0_20px_50px_-24px_rgba(15,15,20,0.15)] sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-[0_8px_20px_-8px_rgba(15,15,20,0.25)] sm:h-28 sm:w-28">
              {store.logo ? (
                <Image src={store.logo} alt={store.name} fill className="object-cover" />
              ) : (
                <UserAvatar name={store.name} size={112} />
              )}
            </div>

            <div className="min-w-0">
              <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A] sm:text-[30px]">
                {store.name}
              </h1>

              {store.description && (
                <p className="mt-2 max-w-xl text-[13.5px] leading-6 text-[#64748B]">
                  {store.description}
                </p>
              )}

              {location && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#475569]">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-violet-600" />
                    {location}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2.5">
            {store.email && (
              <a
                href={`mailto:${store.email}`}
                className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-violet-600 px-5 text-[13px] font-semibold text-violet-700 transition-colors hover:bg-violet-50"
              >
                <Mail size={14} />
                Email
              </a>
            )}

            {store.phone && (
              <a
                href={`tel:${store.phone}`}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[13px] font-semibold text-white transition-all hover:brightness-110"
              >
                <Phone size={15} />
                Call
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
