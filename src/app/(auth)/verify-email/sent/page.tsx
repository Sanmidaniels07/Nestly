"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MailCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";

import Button from "@/src/components/ui/button";

export default function VerifyEmailSentPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#F0F4FF] to-[#F5F0FF] flex items-center justify-center p-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
            <MailCheck className="h-10 w-10 text-violet-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">Check your email</h1>

          <p className="text-gray-600">We've sent a verification link to</p>
          <p className="mt-1 font-semibold text-violet-600 break-all">{email || "your email"}</p>

          <p className="mt-6 text-gray-500">
            Please click the link inside to verify your account.
          </p>

          <div className="mt-10 space-y-4">
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="tribely"
                className="w-full h-14 text-base font-semibold rounded-2xl"
              >
                Open Gmail
              </Button>
            </a>

            <Link href="/resend-verification" className="block">
              <Button
                variant="outline"
                className="w-full h-14 text-base rounded-2xl"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Resend Verification Email
              </Button>
            </Link>
          </div>

          <div className="mt-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>

          <div className="mt-10 rounded-2xl bg-violet-50 p-5 text-sm text-violet-700">
            Didn't receive the email? Check your spam folder or try resending.
          </div>
        </div>
      </motion.div>
    </div>
  );
}