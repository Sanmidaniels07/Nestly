"use client";

import { achievements } from "@/src/mocks/profile-sidebar";

export default function ProfileAchievements() {
  return (
    <div className="rounded-[30px] border border-[#ECEAF4] bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold">
        Achievements
      </h3>

      <div className="mt-6 space-y-5">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="flex gap-4"
          >
            <div className="text-3xl">
              {item.icon}
            </div>

            <div>
              <h4 className="font-semibold">
                {item.title}
              </h4>

              <p className="text-sm text-slate-500">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}