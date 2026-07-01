"use client";
import Link from "next/link";
import ThemeToggle from "@/src/components/ui/theme-toggle";
import { motion } from "framer-motion";
import { Users, Gift, ShoppingBag, Heart, Calendar, Star } from "lucide-react";
import Button from "../components/ui/button";
import Card from "../components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#1A1A2E] overflow-x-hidden">
      <Nav />

      <Hero />

      <Features />

      <Preview />

      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#E5E7EB] h-16 flex items-center px-6 md:px-8">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            N
          </div>
          <div className="font-bold text-2xl tracking-tight">Nestly</div>
        </div>

        <div className="hidden md:flex items-center gap-10 font-medium text-sm">
          <a
            href="#features"
            className="text-[#6B7280] hover:text-[#2B7FFF] transition-colors"
          >
            Features
          </a>
          <a
            href="#preview"
            className="text-[#6B7280] hover:text-[#2B7FFF] transition-colors"
          >
            Preview
          </a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="tribely" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tighter">
              Connect, <span className="text-[#2B7FFF]">Celebrate</span>,<br />
              and Shop Together
            </h1>
            <p className="mt-6 text-xl text-[#6B7280] max-w-lg">
              The all-in-one platform where social networking meets birthday
              discovery and seamless shopping.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F1FF] text-[#2B7FFF] rounded-full text-sm font-medium">
              <Users className="w-4 h-4" /> Social Feed
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3EEFD] text-[#8B5CF6] rounded-full text-sm font-medium">
              <Gift className="w-4 h-4" /> Birthday Match
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF0E8] text-[#FF7A45] rounded-full text-sm font-medium">
              <ShoppingBag className="w-4 h-4" /> Marketplace
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-10 py-7 rounded-2xl"
              >
                Join Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base px-10 py-7 rounded-2xl"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <div className="flex gap-12 pt-8">
            <div>
              <div className="text-4xl font-bold text-[#2B7FFF]">50K+</div>
              <div className="text-sm text-[#6B7280]">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#2B7FFF]">12K+</div>
              <div className="text-sm text-[#6B7280]">Birthday Matches</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#2B7FFF]">8K+</div>
              <div className="text-sm text-[#6B7280]">Products Sold</div>
            </div>
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="relative w-[280px] h-[560px] bg-white border-8 border-[#1A1A2E] rounded-[42px] shadow-2xl overflow-hidden">
            {/* Phone Screen Mock */}
            <div className="h-full p-4 overflow-hidden bg-[#F5F7FA]">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-9 h-9 rounded-full bg-[#2B7FFF] flex items-center justify-center text-white text-sm font-semibold">
                  JD
                </div>
                <div>
                  <div className="font-semibold">John Doe</div>
                  <div className="text-xs text-[#9CA3AF]">@johndoe</div>
                </div>
              </div>

              <div className="space-y-6 mt-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-xs">
                    AS
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Alice Smith{" "}
                      <span className="text-[#9CA3AF] text-xs">2h</span>
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      Happy birthday to my best friend! 🎉
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="text-xs font-semibold text-[#2B7FFF] mb-3">
                    Featured
                  </div>
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-[#F5F7FA] rounded-xl flex items-center justify-center text-3xl">
                      🎧
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        Wireless Headphones
                      </div>
                      <div className="text-[#2B7FFF] font-bold">$89.99</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Cards */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl w-52"
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-sm">
                SJ
              </div>
              <div>
                <div className="font-semibold text-sm">Sarah J.</div>
                <div className="text-xs text-[#9CA3AF]">
                  Birthday in 3 days!
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
            className="absolute bottom-20 -left-8 bg-white rounded-2xl p-5 shadow-xl w-48 text-center"
          >
            <div className="text-4xl mb-2">🎉</div>
            <div className="font-bold text-sm text-[#8B5CF6]">New Match!</div>
            <div className="text-xs text-[#6B7280]">
              You and Alex share a birthday
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 3 }}
            className="absolute top-1/2 -right-16 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3"
          >
            <div className="text-3xl">📦</div>
            <div>
              <div className="font-semibold text-sm">Order Delivered</div>
              <div className="text-emerald-600 text-xs font-medium">
                Arrived today
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ==================== FEATURES ==================== */
function Features() {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      color: "bg-[#E8F1FF] text-[#2B7FFF]",
      title: "Social Network",
      desc: "Share moments, post updates, comment on friends' stories, and build your community.",
    },
    {
      icon: <Gift className="w-8 h-8" />,
      color: "bg-[#F3EEFD] text-[#8B5CF6]",
      title: "Birthday Matching",
      desc: "Discover people who share your birthday. Get celebration reminders and find your birthday twin.",
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      color: "bg-[#FFF0E8] text-[#FF7A45]",
      title: "Marketplace",
      desc: "Buy and sell products with a seamless shopping experience. Browse, cart, checkout.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Three Platforms, One Experience
          </h2>
          <p className="mt-4 text-xl text-[#6B7280] max-w-md mx-auto">
            Everything you need to connect, celebrate, and shop.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white border border-[#E5E7EB] rounded-3xl p-10 hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-[#6B7280] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================== PREVIEW ==================== */
function Preview() {
  return (
    <section
      id="preview"
      className="py-20 bg-gradient-to-b from-[#F5F7FA] to-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            See Nestly In Action
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Social Feed Preview */}
          <Card className="overflow-hidden border-[#E5E7EB]">
            <div className="p-5 border-b flex items-center gap-3 bg-white">
              <Users className="text-[#2B7FFF]" />
              <span className="font-semibold">Social Feed</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-[#2B7FFF] flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">
                    John Doe <span className="text-[#9CA3AF]">2h</span>
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    Weekend vibes with the crew!
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-[#8B5CF6] flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">
                    Alice Smith <span className="text-[#9CA3AF]">4h</span>
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    New recipe turned out amazing
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Birthday Preview */}
          <Card className="overflow-hidden border-[#E5E7EB]">
            <div className="p-5 border-b flex items-center gap-3 bg-white">
              <Gift className="text-[#8B5CF6]" />
              <span className="font-semibold">Birthday Matching</span>
            </div>
            <div className="p-8 text-center bg-[#F3EEFD] rounded-b-3xl">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#8B5CF6] flex items-center justify-center text-4xl text-white mb-4">
                SJ
              </div>
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-[#8B5CF6] text-sm my-1">Leo • Aug 15</div>
              <div className="text-sm text-[#6B7280]">
                You share 85% compatibility!
              </div>
            </div>
          </Card>

          {/* Marketplace Preview */}
          <Card className="overflow-hidden border-[#E5E7EB] md:col-span-2 lg:col-span-1">
            <div className="p-5 border-b flex items-center gap-3 bg-white">
              <ShoppingBag className="text-[#FF7A45]" />
              <span className="font-semibold">Marketplace</span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <div className="h-24 bg-[#F5F7FA] rounded-2xl flex items-center justify-center text-5xl mb-3">
                  👟
                </div>
                <div className="font-medium text-sm">Running Shoes</div>
                <div className="text-[#2B7FFF] font-bold">$129.99</div>
              </div>
              <div>
                <div className="h-24 bg-[#F5F7FA] rounded-2xl flex items-center justify-center text-5xl mb-3">
                  ⌚
                </div>
                <div className="font-medium text-sm">Smart Watch</div>
                <div className="text-[#2B7FFF] font-bold">$249</div>
              </div>
            </div>
          </Card>

          {/* Real-time Preview */}
          <Card className="overflow-hidden border-[#E5E7EB]">
            <div className="p-5 border-b flex items-center gap-3 bg-white">
              <Star className="text-emerald-500" />
              <span className="font-semibold">Real-time</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />{" "}
                  LIVE
                </div>
                <span className="text-sm">3 friends online now</span>
              </div>
              <div className="bg-white border p-4 rounded-2xl flex items-center gap-3 text-sm text-[#6B7280]">
                Alice is typing...
                <div className="flex gap-1">
                  <div
                    className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            N
          </div>{" "}
          <div className="font-bold text-3xl">Nestly</div>
        </div>
        <p className="text-white/60 max-w-md mx-auto">
          Connect, Celebrate, Commerce — All in one place.
        </p>{" "}
        <div className="mt-12 text-xs text-white/40">
          © 2026 Nestly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
