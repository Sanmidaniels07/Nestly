"use client";

import { useFormContext } from "react-hook-form";
import { MapPin, Briefcase, Building2, GraduationCap, Globe } from "lucide-react";
import Input from "@/src/components/ui/input";
import DateOfBirthPicker from "@/src/components/ui/date-picker";
export default function EditProfilePersonal() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const website: string = watch("website") ?? "";
  const hasValidUrl = /^https?:\/\/.+\..+/.test(website);

  return (
    <section className="space-y-6">
      <div>
        <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-ink">
          Personal information
        </h3>
        <p className="mt-1 text-[13.5px] text-muted">
          Information shown on your profile.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Location"
          placeholder="Lagos, Nigeria"
          icon={<MapPin size={17} />}
          {...register("location")}
          error={errors.location?.message as string}
        />

        <Input
          label="Occupation"
          placeholder="Software Engineer"
          icon={<Briefcase size={17} />}
          {...register("occupation")}
          error={errors.occupation?.message as string}
        />

        <Input
          label="Company"
          placeholder="Nestly Technologies"
          icon={<Building2 size={17} />}
          {...register("company")}
          error={errors.company?.message as string}
        />

        <Input
          label="Education"
          placeholder="University of Lagos"
          icon={<GraduationCap size={17} />}
          {...register("education")}
          error={errors.education?.message as string}
        />

        <div>
          <DateOfBirthPicker />
          <p className="mt-2 text-[12px] leading-snug text-muted">
            Followers get a reminder on your birthday. Only the day is shared — your age stays private.
          </p>
        </div>
      </div>

      <div>
        <Input
          label="Website"
          placeholder="https://yourwebsite.com"
          icon={<Globe size={17} />}
          {...register("website")}
          error={errors.website?.message as string}
        />

        {website && hasValidUrl && !errors.website && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-emerald-600 dark:text-emerald-400">
            <Globe size={12} />
            <span className="font-[family-name:var(--font-mono)]">{website}</span>
            <span className="text-subtle">will be shown on your profile</span>
          </div>
        )}
      </div>
    </section>
  );
}