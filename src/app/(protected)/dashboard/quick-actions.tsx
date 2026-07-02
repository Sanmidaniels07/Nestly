"use client";

import {
  Image,
  PenSquare,
  Store,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Create Post",
    description:
      "Share your thoughts and ideas with your communities.",
    icon: PenSquare,
  },
  {
    title: "Upload Photo",
    description:
      "Capture moments and share memories instantly.",
    icon: Image,
  },
  {
    title: "Sell Item",
    description:
      "List products and start selling in the marketplace.",
    icon: Store,
  },
];

export default function QuickActions() {
  return (
    <section className="space-y-6">
      <div>
        <h2
          className="
            text-2xl
            font-bold
            text-slate-900
          "
        >
          Quick Actions
        </h2>

        <p
          className="
            mt-1
            text-gray-500
          "
        >
          Start something new.
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >
        {actions.map((action) => (
          <button
            key={action.title}
            className="
              group
              rounded-[30px]
              border
              border-white/60
              bg-white/80
              backdrop-blur-xl
              p-7
              text-left
              shadow-[0_10px_40px_rgba(15,23,42,0.06)]
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-3xl
                  bg-gradient-to-br
                  from-violet-100
                  to-purple-100
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                <action.icon
                  size={28}
                  className="
                    text-violet-600
                  "
                />
              </div>

              <ArrowRight
                size={20}
                className="
                  text-gray-300
                  transition-all
                  duration-300
                  group-hover:text-violet-600
                  group-hover:translate-x-1
                "
              />
            </div>

            <h3
              className="
                mt-8
                text-xl
                font-semibold
                text-slate-900
              "
            >
              {action.title}
            </h3>

            <p
              className="
                mt-3
                text-sm
                leading-7
                text-gray-500
              "
            >
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}