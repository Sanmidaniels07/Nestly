"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signupSchema, SignupValues } from "@/src/lib/validations/auth";
import { useSignup } from "@/src/hooks/use-signup";
import Input from "@/src/components/ui/input";
import PasswordInput from "@/src/components/ui/password-input";
import Button from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { Users, Sparkles, User, Mail, Lock, LockKeyhole } from "lucide-react";
import GuestGuard from "@/src/components/guards/GuestGuard";
import NestlyMark from "@/src/components/ui/nestly-mark";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = useSignup();

  const onSubmit = (data: SignupValues) => {
    signupMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <GuestGuard>
      <div className="min-h-screen bg-gradient-to-br from-canvas via-canvas-via to-canvas-to flex items-center justify-center pt-20 pb-12 px-3 sm:px-6">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex flex-col justify-center"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <NestlyMark size={44} />

                <div className="text-4xl font-bold tracking-tight text-ink">
                  Nestly
                </div>
              </div>
              <h1 className="text-5xl font-bold leading-tight text-ink">
                Join the
                <br />
                nest
              </h1>
              <p className="mt-6 text-xl text-muted max-w-md">
                Connect with like-minded people, discover communities, and grow
                together.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                <span>Meaningful connections</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-500" />
                <span>Real communities</span>
              </div>
            </div>
          </motion.div>

          {/* Signup Form */}
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
                <h2 className="text-3xl font-bold text-ink">
                  Create your account
                </h2>
                <p className="text-muted mt-2">
                  Join thousands already in the nest
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...register("name")}
                  error={errors.name?.message}
                  icon={<User className="w-5 h-5" />}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                  icon={<Mail className="w-5 h-5" />}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Create a strong password"
                  {...register("password")}
                  error={errors.password?.message}
                  icon={<Lock className="w-5 h-5" />}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                  icon={<LockKeyhole className="w-5 h-5" />}
                />

                <Button
                  loading={signupMutation.isPending}
                  variant="tribely"
                  className="w-full h-14 text-base font-semibold rounded-2xl mt-4"
                >
                  Create Account
                </Button>
              </form>

              <p className="text-center text-sm text-muted mt-8">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Trust signals */}
            <div className="text-center text-xs text-muted mt-6">
              Protected by industry-leading security
            </div>
          </motion.div>
        </div>
      </div>
    </GuestGuard>
  );
}
