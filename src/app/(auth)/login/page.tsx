"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Sparkles } from "lucide-react";
import LoginForm from "@/src/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#F0F4FF] to-[#F5F0FF] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Visual */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col justify-center"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold">
                N
              </div>
              <div className="text-4xl font-bold tracking-tight text-gray-900">Nestly</div>
            </div>
            <h1 className="text-5xl font-bold leading-tight text-gray-900">
              Welcome back to<br />your nest
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-md">
              Continue building meaningful connections and growing together.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <span>Secure &amp; Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-500" />
              <span>Real Community</span>
            </div>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
            <div className="text-center mb-10">
              <div className="md:hidden flex justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold">
                  T
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
            </div>

            <LoginForm />

            <p className="text-center text-sm text-gray-600 mt-8">
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
  );
}