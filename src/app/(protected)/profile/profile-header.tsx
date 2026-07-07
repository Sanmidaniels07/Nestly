"use client";

import Link from "next/link";
import { BadgeCheck, CalendarDays, Globe, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Profile } from "@/src/mocks/profile";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IconType } from "react-icons";

interface Props {
  profile: Profile;
}

const socialLinkClass =
  "flex items-center gap-2 rounded-full border border-[#E7E5F2] bg-white px-4 py-2 text-sm font-medium text-[#13131A] transition-all hover:border-violet-400 hover:text-violet-700 hover:shadow-sm";

export default function ProfileHeader({ profile }: Props) {
  const socialLinks: { href?: string; label: string; icon: IconType }[] = [
    { href: profile.github, label: "GitHub", icon: FaGithub },
    { href: profile.linkedin, label: "LinkedIn", icon: FaLinkedin },
    { href: profile.twitter, label: "X", icon: FaXTwitter },
    { href: profile.instagram, label: "Instagram", icon: FaInstagram },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mt-16 text-center md:mt-20 md:pl-44 md:text-left"
    >
      <div className="flex items-center justify-center gap-2 md:justify-start">
        <h1 className="font-[family-name:var(--font-fraunces)] text-[32px] italic leading-none text-[#13131A] md:text-[38px]">
          {profile.name}
        </h1>

        {profile.verified && <BadgeCheck className="text-blue-500" size={22} />}
      </div>

      <p className="mt-2 font-[family-name:var(--font-mono)] text-[14px] text-violet-600">
        @{profile.username}
      </p>

      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#475569]">
        {profile.bio}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-5 text-[13.5px] text-[#64748B] md:justify-start">
        <div className="flex items-center gap-1.5">
          <MapPin size={16} />
          {profile.location}
        </div>

        <Link
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-violet-600 hover:underline"
        >
          <Globe size={16} />
          Website
        </Link>

        <div className="flex items-center gap-1.5">
          <CalendarDays size={16} />
          Joined{" "}
          <span className="font-[family-name:var(--font-mono)]">
            {profile.joined}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
        {socialLinks.map(
          ({ href, label, icon: Icon }) =>
            href && (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
              >
                <Icon size={16} />
                {label}
              </Link>
            ),
        )}
      </div>
    </motion.div>
  );
}