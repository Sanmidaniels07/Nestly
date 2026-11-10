"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Package, Gift } from "lucide-react";
import LoginForm from "@/src/components/auth/LoginForm";
import GuestGuard from "@/src/components/guards/GuestGuard";
import NestlyMark from "@/src/components/ui/nestly-mark";

export default function LoginPage() {
  return (
      <GuestGuard>
    {/* pt-20 clears the fixed navbar so the card's top isn't hidden under it. */}
    <div className="min-h-screen bg-gradient-to-br from-canvas via-canvas-via to-canvas-to flex items-center justify-center px-3 pb-6 pt-20 sm:px-6 sm:pb-6 sm:pt-24">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Visual */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col justify-center"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
             <NestlyMark size={44} />
              <div className="text-4xl font-bold tracking-tight text-ink">Nestly</div>
            </div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-5xl leading-[1.05] tracking-tight text-ink">
              Welcome back
              <br />
              <em className="text-violet-600 dark:text-violet-400">to your nest.</em>
            </h1>
            <p className="mt-6 text-lg text-muted max-w-md">
              Pick up right where you left off. Your people, your orders and your plans are waiting.
            </p>
          </div>

          <ul className="space-y-4 max-w-md">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                <Bell className="h-[18px] w-[18px]" />
              </span>
              <span>
                <span className="block font-semibold text-ink">Catch up on what you missed</span>
                <span className="block text-sm text-muted">New posts, messages and replies from your people.</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                <Package className="h-[18px] w-[18px]" />
              </span>
              <span>
                <span className="block font-semibold text-ink">Track your orders</span>
                <span className="block text-sm text-muted">See every order&apos;s progress, from paid to delivered.</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                <Gift className="h-[18px] w-[18px]" />
              </span>
              <span>
                <span className="block font-semibold text-ink">See who&apos;s celebrating</span>
                <span className="block text-sm text-muted">Upcoming birthdays, so you never miss one.</span>
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-surface rounded-3xl shadow-2xl border border-line-soft px-5 py-8 sm:p-10">
            <div className="text-center mb-10">
              <div className="md:hidden flex justify-center mb-6">
                <NestlyMark size={56} />
              </div>
              <h2 className="text-3xl font-bold text-ink">Welcome back</h2>
              <p className="text-muted mt-2">Sign in to pick up where you left off.</p>
            </div>

            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>

            <p className="text-center text-sm text-muted mt-8">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
        </GuestGuard>

  );
}