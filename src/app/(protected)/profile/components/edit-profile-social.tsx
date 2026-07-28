"use client";

import { useFormContext } from "react-hook-form";
import {
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
  FaFacebook,
  FaTiktok,
  FaYoutube,
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

        <Input
          label="Facebook"
          placeholder="https://facebook.com/username"
          icon={<FaFacebook size={17} />}
          {...register("facebook")}
          error={errors.facebook?.message as string}
        />

        <Input
          label="LinkedIn"
          placeholder="https://linkedin.com/in/username"
          icon={<FaLinkedin size={17} />}
          {...register("linkedin")}
          error={errors.linkedin?.message as string}
        />

        <Input
          label="TikTok"
          placeholder="https://tiktok.com/@username"
          icon={<FaTiktok size={17} />}
          {...register("tiktok")}
          error={errors.tiktok?.message as string}
        />

        <Input
          label="YouTube"
          placeholder="https://youtube.com/@username"
          icon={<FaYoutube size={17} />}
          {...register("youtube")}
          error={errors.youtube?.message as string}
        />
      </div>
    </section>
  );
}
