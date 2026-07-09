"use client";

import { BadgeCheck, Globe, Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa6";
import { MarketplaceSeller } from "@/src/mocks/marketplace";

interface Props {
  seller: MarketplaceSeller;
}

export default function SellerAbout({ seller }: Props) {
  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-violet-600">
            About seller
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[24px] italic text-[#13131A]">
            Meet {seller.name}
          </h2>
        </div>

        {seller.verified && (
          <div className="flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-[12.5px] font-medium text-blue-600">
            <BadgeCheck size={15} />
            Verified seller
          </div>
        )}
      </div>

      <p className="mt-6 max-w-3xl text-[13.5px] leading-7 text-[#64748B]">{seller.bio}</p>

      <div className="mt-7 grid gap-6 border-t border-dashed border-[#ECE9F6] pt-6 lg:grid-cols-2">
        <div className="space-y-4">
          <ContactRow icon={<MapPin size={15} />}>{seller.location}</ContactRow>
          <ContactRow icon={<Mail size={15} />}>{seller.email}</ContactRow>
          <ContactRow icon={<Phone size={15} />}>{seller.phone}</ContactRow>
        </div>

        <div className="space-y-4">
          {seller.socialLinks.website && (
            <ContactRow icon={<Globe size={15} />}>
              <a
                href={seller.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-violet-600"
              >
                {seller.socialLinks.website}
              </a>
            </ContactRow>
          )}

          {seller.socialLinks.instagram && (
            <ContactRow icon={<FaInstagram size={15} />}>
              {seller.socialLinks.instagram}
            </ContactRow>
          )}

          {seller.socialLinks.facebook && (
            <ContactRow icon={<FaFacebook size={15} />}>
              {seller.socialLinks.facebook}
            </ContactRow>
          )}
        </div>
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