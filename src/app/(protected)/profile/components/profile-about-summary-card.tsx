"use client";

import {
  MapPin,
  Briefcase,
} from "lucide-react";

export default function ProfileAboutSummary() {
  return (
    <div className="rounded-[30px] border border-line bg-surface p-6 shadow-sm">
      <h3 className="text-xl font-bold">
        About
      </h3>

      <p className="mt-4 text-sm leading-7 text-muted">
        Passionate software engineer building
        scalable products and meaningful
        communities.
      </p>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <MapPin
            size={18}
            className="text-violet-600 dark:text-violet-400"
          />
          Lagos, Nigeria
        </div>

        <div className="flex items-center gap-3">
          <Briefcase
            size={18}
            className="text-violet-600 dark:text-violet-400"
          />
          Software Engineer
        </div>
      </div>
    </div>
  );
}