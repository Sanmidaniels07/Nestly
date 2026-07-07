"use client";

import { useFormContext } from "react-hook-form";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import Input from "@/src/components/ui/input";

export default function EditProfileSocial() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section className="space-y-6">
      <div>
        <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] italic text-[#13131A]">
          Social links
        </h3>
        <p className="mt-1 text-[13.5px] text-[#64748B]">
          Help people connect with you across different platforms.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="GitHub"
          placeholder="https://github.com/username"
          icon={<FaGithub size={17} />}
          {...register("github")}
          error={errors.github?.message as string}
        />

        <Input
          label="LinkedIn"
          placeholder="https://linkedin.com/in/username"
          icon={<FaLinkedin size={17} />}
          {...register("linkedin")}
          error={errors.linkedin?.message as string}
        />

        <Input
          label="X (Twitter)"
          placeholder="https://x.com/username"
          icon={<FaXTwitter size={17} />}
          {...register("twitter")}
          error={errors.twitter?.message as string}
        />

        <Input
          label="Instagram"
          placeholder="https://instagram.com/username"
          icon={<FaInstagram size={17} />}
          {...register("instagram")}
          error={errors.instagram?.message as string}
        />
      </div>
    </section>
  );
}