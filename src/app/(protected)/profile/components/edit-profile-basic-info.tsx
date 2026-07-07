"use client";

import { useFormContext } from "react-hook-form";
import Input from "@/src/components/ui/input";

export default function EditProfileBasic() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const bio: string = watch("bio") ?? "";
  const username: string = watch("username") ?? "";

  const bioLength = bio.length;
  const bioNearLimit = bioLength > 220;
  const bioAtLimit = bioLength >= 250;

  return (
    <section className="space-y-6">
      <div>
        <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
          Basic information
        </h3>
        <p className="mt-1 text-[13.5px] text-[#64748B]">Tell people who you are.</p>
      </div>

      <Input
        label="Full name"
        placeholder="Daniel Sanmi"
        {...register("name")}
        error={errors.name?.message as string}
      />

      <div>
        <Input
          label="Username"
          placeholder="daniel"
          {...register("username")}
          error={errors.username?.message as string}
        />
        {username && !errors.username && (
          <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
            nestly.app/@{username}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-[13.5px] font-medium text-[#334155]">Bio</label>

        <textarea
          rows={4}
          maxLength={250}
          {...register("bio")}
          placeholder="Tell people about yourself..."
          className="
            w-full resize-none rounded-2xl border border-[#E4E6EB]
            bg-[#FAFBFC] px-4 py-3.5 text-[14px] text-[#13131A]
            outline-none transition-colors
            placeholder:text-[#94A3B8]
            focus:border-violet-400 focus:bg-white
          "
        />

        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[12px] text-red-500">
            {errors.bio?.message as string}
          </span>

          <span
            className={`font-[family-name:var(--font-mono)] text-[11.5px] ${
              bioAtLimit ? "text-red-500" : bioNearLimit ? "text-amber-500" : "text-[#94A3B8]"
            }`}
          >
            {bioLength}/250
          </span>
        </div>
      </div>
    </section>
  );
}