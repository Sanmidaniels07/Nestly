"use client";

import Image from "next/image";
import { Camera, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Profile } from "@/src/mocks/profile";

interface Props {
  profile: Profile;
}

export default function ProfileCover({ profile }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Cover */}
      <div className="relative h-[220px] overflow-hidden rounded-2xl md:h-[300px] lg:h-[360px]">
        <Image
          src={profile.cover}
          alt={profile.name}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        <button
          className="
            absolute right-5 top-5 flex items-center gap-2
            rounded-full bg-white/85 px-4 py-2.5
            text-[13.5px] font-medium backdrop-blur-xl
            transition-colors hover:bg-white
          "
        >
          <Camera size={16} />
          Edit cover
        </button>
      </div>

      {/* Avatar */}
      <div
        className="
          absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
          md:left-10 md:translate-x-0
        "
      >
        <div className="relative">
          <div className="rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[3.5px] shadow-xl">
            <div className="rounded-full bg-white p-[3.5px]">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={152}
                height={152}
                className="h-28 w-28 rounded-full object-cover md:h-36 md:w-36"
              />
            </div>
          </div>

          {profile.verified && (
            <div className="absolute bottom-2.5 right-1.5 rounded-full bg-blue-500 p-1.5 text-white ring-4 ring-white">
              <BadgeCheck size={16} />
            </div>
          )}

          <div className="absolute bottom-4 left-1.5 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500" />
        </div>
      </div>
    </motion.section>
  );
}