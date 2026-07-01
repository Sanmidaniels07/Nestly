"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import Link from "next/link";

import {
  resetPasswordSchema,
  ResetPasswordValues,
} from "@/src/lib/validations/auth";

import { useResetPassword } from "@/src/hooks/use-reset-password";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const mutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordValues) => {
    mutation.mutate({
      token,
      password: data.password,
    });
  };

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
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
          <div className="text-center mb-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
              <Lock className="h-8 w-8 text-violet-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">Reset your password</h1>
            <p className="mt-3 text-gray-600">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              {...register("password")}
              error={errors.password?.message}
              icon={<Lock className="w-5 h-5" />}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              icon={<Lock className="w-5 h-5" />}
            />

            <Button
              loading={mutation.isPending}
              variant="tribely"
              className="w-full h-14 text-base font-semibold rounded-2xl"
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}