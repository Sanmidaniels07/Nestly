"use client";

import { useRouter } from "next/navigation";
import { Image, PenSquare, Store, ArrowRight } from "lucide-react";

const actions = [
  {
    title: "Create Post",
    description: "Share your thoughts and ideas with your communities.",
    icon: PenSquare,
    color: "from-violet-500 to-purple-600",
    href: "/feed",
  },
  {
    title: "Upload Photo",
    description: "Capture moments and share memories instantly.",
    icon: Image,
    color: "from-pink-500 to-rose-500",
    href: undefined,
  },
  {
    title: "Sell Item",
    description: "List products and start selling in the marketplace.",
    icon: Store,
    color: "from-amber-500 to-orange-600",
    href: "/marketplace/sell",
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <section>
      <div className="mb-6">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.3em] text-violet-600">
          Get started
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-[28px] italic leading-none text-[#13131A]">
          Quick actions
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.href ? () => router.push(action.href!) : undefined}
            disabled={!action.href}
            className="group relative overflow-hidden rounded-2xl border border-[#ECE9F6] bg-white p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_20px_50px_-24px_rgba(15,15,20,0.2)] disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-[#ECE9F6] disabled:hover:shadow-none"
          >
            <div className={`absolute right-0 top-0 h-1.5 w-20 bg-gradient-to-r ${action.color} rounded-bl-2xl`} />

            <div className="flex items-start justify-between">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} text-white transition-transform duration-300 group-hover:scale-110`}>
                <action.icon size={24} />
              </div>

              <ArrowRight
                size={18}
                className="text-[#CBD5E1] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-violet-600"
              />
            </div>

            <h3 className="mt-6 text-[17px] font-semibold text-[#13131A]">{action.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#64748B]">{action.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
