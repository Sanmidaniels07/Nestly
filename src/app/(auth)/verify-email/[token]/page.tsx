"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useVerifyEmail } from "@/src/hooks/use-verify-email";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const mutation = useVerifyEmail();

  useEffect(() => {
    if (token) {
      mutation.mutate(token);
    }
  }, [token]);

  useEffect(() => {
    if (mutation.isSuccess) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [mutation.isSuccess, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#F0F4FF] to-[#F5F0FF] flex items-center justify-center p-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 text-center">
          {mutation.isPending && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
                <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Verifying your email</h1>
              <p className="mt-4 text-gray-600">Please wait a moment...</p>
            </>
          )}

          {mutation.isSuccess && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Email Verified!</h1>
              <p className="mt-4 text-gray-600">Redirecting you to login...</p>
            </>
          )}

          {mutation.isError && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Verification Failed</h1>
              <p className="mt-4 text-gray-600">
                This link is invalid or has expired.
              </p>

              <div className="mt-10 space-y-4">
                <Link
                  href="/resend-verification"
                  className="block w-full rounded-2xl bg-violet-600 py-4 font-semibold text-white hover:bg-violet-700 transition-colors"
                >
                  Resend Verification Email
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}