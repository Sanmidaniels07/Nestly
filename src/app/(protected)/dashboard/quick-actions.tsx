"use client";

import { Image, PenSquare, Store, ArrowRight } from "lucide-react";

const actions = [
  {
    title: "Create Post",
    description: "Share your thoughts and ideas with your communities.",
    icon: PenSquare,
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Upload Photo",
    description: "Capture moments and share memories instantly.",
    icon: Image,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Sell Item",
    description: "List products and start selling in the marketplace.",
    icon: Store,
    color: "from-amber-500 to-orange-600",
  },
];

export default function QuickActions() {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Quick Actions</h2>
        <p className="text-gray-500 mt-1">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, i) => (
          <button
            key={i}
            className="group relative overflow-hidden rounded-3xl bg-white p-8 text-left shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
          >
            {/* Gradient Accent */}
            <div className={`absolute top-0 right-0 h-2 w-24 bg-gradient-to-r ${action.color} rounded-bl-3xl`} />

            <div className="flex justify-between items-start">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} text-white transition-transform duration-300 group-hover:scale-110`}>
                <action.icon size={32} />
              </div>

              <ArrowRight className="text-gray-300 transition-all duration-300 group-hover:text-violet-600 group-hover:translate-x-1" size={24} />
            </div>

            <h3 className="mt-10 text-2xl font-semibold text-gray-900">{action.title}</h3>
            <p className="mt-4 text-gray-600 leading-relaxed">{action.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}