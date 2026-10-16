"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MailCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";

import Button from "@/src/components/ui/button";

function VerifyEmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen bg-gradient-to-br from-canvas via-canvas-via to-canvas-to flex items-center justify-center p-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface rounded-3xl shadow-2xl border border-line-soft p-10 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/15">
            <MailCheck className="h-10 w-10 text-violet-600 dark:text-violet-400" />
          </div>

          <h1 className="text-3xl font-bold text-ink mb-3">Check your email</h1>

          <p className="text-muted">We've sent a verification link to</p>
          <p className="mt-1 font-semibold text-violet-600 dark:text-violet-400 break-all">{email || "your email"}</p>

          <p className="mt-6 text-muted">
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
              className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>

          <div className="mt-10 rounded-2xl bg-violet-50 dark:bg-violet-500/10 p-5 text-sm text-violet-700 dark:text-violet-300">
            Didn't receive the email? Check your spam folder or try resending.
          </div>
        </div>
      </motion.div>
    </div>
    
  );
}

export default function VerifyEmailSentPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailSentContent />
    </Suspense>
  );
}