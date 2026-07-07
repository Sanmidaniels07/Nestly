"use client";

import {
  Briefcase,
  Calendar,
  GraduationCap,
  Globe,
  MapPin,
  Building2,
} from "lucide-react";
import { PersonalInfo } from "@/src/mocks/profile-about";

interface Props {
  info: PersonalInfo;
}

export default function ProfilePersonalInfo({ info }: Props) {
  const items = [
    { icon: MapPin, label: "Location", value: info.location },
    { icon: Briefcase, label: "Occupation", value: info.occupation },
    { icon: Building2, label: "Company", value: info.company },
    { icon: GraduationCap, label: "Education", value: info.education },
    { icon: Globe, label: "Website", value: info.website },
    { icon: Calendar, label: "Joined", value: info.joined },
  ];

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Personal information
      </h2>

      <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50">
              <item.icon className="text-violet-600" size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-[#94A3B8]">{item.label}</p>
              <p className="truncate text-[13.5px] font-medium text-[#13131A]">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}