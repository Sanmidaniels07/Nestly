"use client";

import { Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { socialLinks } from "@/src/mocks/profile-sidebar";

const icons = {
  Website: Globe,
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
};

export default function ProfileSocialLinks() {
  return (
    <div className="rounded-[30px] border border-line bg-surface p-6 shadow-sm">
      <h3 className="text-xl font-bold">Social Links</h3>

      <div className="mt-6 space-y-4">
        {socialLinks.map((item) => {
          const Icon = icons[item.name as keyof typeof icons];

          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                p-3
                transition
                hover:bg-violet-50 dark:hover:bg-violet-500/10
              "
            >
              <Icon size={20} className="text-violet-600 dark:text-violet-400" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}