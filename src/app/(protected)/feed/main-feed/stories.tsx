"use client";

import { Plus } from "lucide-react";

const stories = ["Daniel", "Sarah", "Michael", "Grace", "John", "Peace"];

export default function Stories() {
  return (
    <div className="-mx-2">
      <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-2 scrollbar-hide">
        {stories.map((name, index) => {
          const isYou = index === 0;

          return (
            <div
              key={name}
              className="flex shrink-0 snap-start flex-col items-center gap-2"
            >
              <button className="relative">
                <div
                  className={`
                    h-[68px] w-[68px] rounded-full p-[2.5px]
                    ${
                      isYou
                        ? "bg-[#E2E0EE]"
                        : "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600"
                    }
                  `}
                >
                  <div className="h-full w-full rounded-full bg-white p-[3px]">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-violet-200 to-fuchsia-200" />
                  </div>
                </div>

                {isYou ? (
                  <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 ring-[3px] ring-white">
                    <Plus size={13} strokeWidth={3} className="text-white" />
                  </div>
                ) : (
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 ring-[3px] ring-white" />
                )}
              </button>

              <p className="max-w-[68px] truncate text-[12.5px] font-medium text-[#334155]">
                {isYou ? "Your story" : name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}