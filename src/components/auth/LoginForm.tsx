"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/src/hooks/use-login";
import { loginSchema, LoginValues } from "@/src/lib/validations/auth";
import Input from "../ui/input";
import Button from "../ui/button";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginValues) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        placeholder="Enter your password"
        {...register("password")}
        error={errors.password?.message}
        icon={<Lock className="w-5 h-5" />}
      />

      <Button
        loading={isPending}
        variant="tribely"
        className="w-full h-14 text-base font-semibold rounded-2xl mt-2"
      >
        Sign In
      </Button>

      <div className="text-center pt-2">
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline font-medium"
        >
          Forgot your password?
        </Link>
      </div>
    </form>
  );
}