"use client";

import { Clock3 } from "lucide-react";

import { recentActivities } from "@/src/mocks/profile-sidebar";

export default function ProfileRecentActivity() {
  return (
    <div className="rounded-[30px] border border-[#ECEAF4] bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold">
        Recent Activity
      </h3>

      <div className="mt-6 space-y-5">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-3"
          >
            <Clock3
              size={18}
              className="mt-1 text-violet-600"
            />

            <div>
              <p className="font-medium">
                {activity.text}
              </p>

              <p className="text-sm text-slate-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}