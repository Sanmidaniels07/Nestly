"use client";

import {
  Briefcase,
  Calendar,
  GraduationCap,
  Globe,
  MapPin,
  Building2,
} from "lucide-react";

interface Props {
  location?: string | null;
  occupation?: string | null;
  company?: string | null;
  education?: string | null;
  website?: string | null;
  joined: string;
}

export default function ProfilePersonalInfo({
  location,
  occupation,
  company,
  education,
  website,
  joined,
}: Props) {
  const items = [
    { icon: MapPin, label: "Location", value: location },
    { icon: Briefcase, label: "Occupation", value: occupation },
    { icon: Building2, label: "Company", value: company },
    { icon: GraduationCap, label: "Education", value: education },
    { icon: Globe, label: "Website", value: website },
    { icon: Calendar, label: "Joined", value: joined },
  ].filter((item) => !!item.value);

  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Personal information
      </h2>

      <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
              <item.icon className="text-violet-600 dark:text-violet-400" size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-subtle">{item.label}</p>
              <p className="truncate text-[13.5px] font-medium text-ink">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
