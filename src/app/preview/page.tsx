"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Users2,
  CalendarDays,
  MessageCircle,
  ShoppingBag,
  Truck,
  Heart,
  MessageSquare,
  Check,
  ArrowRight,
} from "lucide-react";

import Button from "@/src/components/ui/button";
import Card from "@/src/components/ui/card";
import GuestGuard from "@/src/components/guards/GuestGuard";

function MockCard({
  icon: Icon,
  color,
  label,
  children,
  className = "",
}: {
  icon: typeof Users;
  color: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden border-[#E5E7EB] ${className}`}>
      <div className="flex items-center gap-2.5 border-b border-[#F1F0F5] bg-white px-5 py-4">
        <Icon size={17} style={{ color }} />
        <span className="text-[13.5px] font-semibold text-[#1A1A2E]">{label}</span>
      </div>
      <div className="p-6">{children}</div>
    </Card>
  );
}

export default function PreviewPage() {
  return (
    <GuestGuard>
      <main className="min-h-screen overflow-x-hidden bg-[#F5F7FA] pb-24 pt-32 text-[#1A1A2E]">
        <section className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F1FF] px-4 py-1.5 text-[13px] font-semibold text-[#2B7FFF]">
              A closer look
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tighter md:text-6xl">
              See Nestly
              <br />
              in action
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[#6B7280] md:text-xl">
              A quick look at what&apos;s waiting for you inside — feed, communities,
              messaging, and a full marketplace.
            </p>
          </motion.div>
        </section>

        <section className="mx-auto mt-20 grid max-w-6xl gap-6 px-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <MockCard icon={Users} color="#2B7FFF" label="Social Feed">
              <div className="space-y-5">
                <div className="flex gap-3.5">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold">
                      John Doe <span className="font-normal text-[#9CA3AF]">· 2h</span>
                    </div>
                    <p className="mt-1 text-[13.5px] text-[#6B7280]">
                      Weekend vibes with the crew! 🎉
                    </p>
                    <div className="mt-3 flex items-center gap-5 text-[#9CA3AF]">
                      <span className="flex items-center gap-1.5 text-[12.5px]">
                        <Heart size={14} className="fill-red-500 text-red-500" /> 24
                      </span>
                      <span className="flex items-center gap-1.5 text-[12.5px]">
                        <MessageSquare size={14} /> 6
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-violet-600" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold">
                      Alice Smith <span className="font-normal text-[#9CA3AF]">· 4h</span>
                    </div>
                    <p className="mt-1 text-[13.5px] text-[#6B7280]">
                      New recipe turned out amazing 🍜
                    </p>
                  </div>
                </div>
              </div>
            </MockCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <MockCard icon={Users2} color="#8B5CF6" label="Communities">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F3EEFD] text-[28px]">
                  🎨
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-semibold">Indie Makers</p>
                  <p className="mt-0.5 text-[12.5px] text-[#9CA3AF]">3.2K members · 48 posts today</p>
                  <div className="mt-2.5 flex -space-x-2">
                    {["#F87171", "#FBBF24", "#34D399", "#60A5FA"].map((c) => (
                      <div
                        key={c}
                        className="h-6 w-6 rounded-full border-2 border-white"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-violet-200 px-3.5 py-1.5 text-[12px] font-semibold text-violet-600">
                  Joined
                </span>
              </div>
            </MockCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <MockCard icon={CalendarDays} color="#EC4899" label="Events">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#FCE7F3]">
                  <span className="text-[11px] font-bold uppercase text-[#EC4899]">Aug</span>
                  <span className="text-[20px] font-bold text-[#EC4899]">15</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-semibold">Rooftop Sunset Mixer</p>
                  <p className="mt-0.5 text-[12.5px] text-[#9CA3AF]">6:00 PM · 128 going</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#EC4899] px-3.5 py-1.5 text-[12px] font-semibold text-white">
                  <Check size={12} strokeWidth={3} /> Going
                </span>
              </div>
            </MockCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <MockCard icon={MessageCircle} color="#10B981" label="Real-time Messaging">
              <div className="space-y-3">
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-[#F3F4F6] px-4 py-2.5 text-[13.5px]">
                    Hey! Are we still on for tomorrow?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-emerald-500 px-4 py-2.5 text-[13.5px] text-white">
                    Wouldn&apos;t miss it 🙌
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pl-1 text-[#9CA3AF]">
                  <span className="text-[12px]">Alex is typing</span>
                  <div className="flex gap-1">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9CA3AF]"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </MockCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="md:col-span-2"
          >
            <MockCard icon={ShoppingBag} color="#FF7A45" label="Marketplace">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  { emoji: "👟", name: "Running Shoes", price: "₦48,000" },
                  { emoji: "⌚", name: "Smart Watch", price: "₦95,000" },
                  { emoji: "🎧", name: "Headphones", price: "₦34,000" },
                  { emoji: "🧴", name: "Skincare Set", price: "₦18,500" },
                ].map((product) => (
                  <div key={product.name}>
                    <div className="flex h-20 items-center justify-center rounded-2xl bg-[#F5F7FA] text-4xl">
                      {product.emoji}
                    </div>
                    <p className="mt-2.5 truncate text-[13px] font-medium">{product.name}</p>
                    <p className="text-[13px] font-bold text-[#FF7A45]">{product.price}</p>
                  </div>
                ))}
              </div>
            </MockCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-2"
          >
            <MockCard icon={Truck} color="#0EA5E9" label="Order Tracking">
              <div className="flex items-center justify-between px-2">
                {["Placed", "Paid", "Shipped", "Delivered"].map((step, i) => (
                  <div key={step} className="flex flex-1 flex-col items-center">
                    <div className="flex w-full items-center">
                      {i > 0 && <div className="h-0.5 flex-1 bg-emerald-400" />}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${
                          i < 3 ? "bg-emerald-500" : "bg-emerald-500"
                        }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </div>
                      {i < 3 && <div className="h-0.5 flex-1 bg-emerald-400" />}
                    </div>
                    <span className="mt-2 text-[11.5px] font-medium text-[#6B7280]">{step}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-[13px] text-emerald-600">
                Arrived today · Order #NESTLY_8F2A91
              </p>
            </MockCard>
          </motion.div>
        </section>

        <section className="mx-auto mt-24 max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-8 py-16 text-center text-white sm:px-16"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
              This could be your feed.
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-white/80">
              Create your account and start building your own — free, in under a minute.
            </p>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-2xl bg-white px-9 py-6 text-base font-semibold text-[#2A1B4D] shadow-lg hover:bg-white/90"
                >
                  Join free
                </Button>
              </Link>
              <Link
                href="/features"
                className="group flex items-center gap-1.5 px-4 py-3 text-[14.5px] font-semibold text-white/90 hover:text-white"
              >
                Explore all features
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </GuestGuard>
  );
}
