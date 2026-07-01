"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signupSchema, SignupValues } from "@/src/lib/validations/auth";
import { useSignup } from "@/src/hooks/use-signup";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { Users, Sparkles, User, Mail, Lock, LockKeyhole } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#F0F4FF] to-[#F5F0FF] flex items-center justify-center pt-20 pb-12 px-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Visual / Branding */}
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
              Join the<br />nest
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-md">
              Connect with like-minded people, discover communities, and grow together.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
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
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
            <div className="text-center mb-10">
              <div className="md:hidden flex justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold">
                  N
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
              <p className="text-gray-600 mt-2">Join thousands already in the nest</p>
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

              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                {...register("password")}
                error={errors.password?.message}
                icon={<Lock className="w-5 h-5" />}
              />

              <Input
                label="Confirm Password"
                type="password"
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

            <p className="text-center text-sm text-gray-600 mt-8">
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
          <div className="text-center text-xs text-gray-500 mt-6">
            Protected by industry-leading security
          </div>
        </motion.div>
      </div>
    </div>
  );
}