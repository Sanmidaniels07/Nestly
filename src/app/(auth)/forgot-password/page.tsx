"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import { useForgotPassword } from "@/src/hooks/use-forgot-password";
import { forgotPasswordSchema, ForgotPasswordValues } from "@/src/lib/validations/auth";
import GuestGuard from "@/src/components/guards/GuestGuard";


export default function ForgotPasswordPage() {
  const mutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    mutation.mutate(data.email);
  };

  return (
    <GuestGuard>
    <div className="min-h-screen bg-gradient-to-br from-canvas via-canvas-via to-canvas-to flex items-center justify-center px-3 py-6 pt-20 sm:p-6 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface rounded-3xl shadow-2xl border border-line-soft px-5 py-8 sm:p-10">
          <div className="text-center mb-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/15">
              <Mail className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold text-ink">Forgot Password?</h1>
            <p className="mt-3 text-muted">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
              icon={<Mail className="w-5 h-5" />}
            />

            <Button
              loading={mutation.isPending}
              variant="tribely"
              className="w-full h-14 text-base font-semibold rounded-2xl"
            >
              Send Reset Link
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-muted hover:text-ink font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
    </GuestGuard>
  );
}