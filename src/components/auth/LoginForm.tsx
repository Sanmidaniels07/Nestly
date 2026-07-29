"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/src/hooks/use-login";
import { useLoginWithTwoFactor } from "@/src/hooks/use-login-with-two-factor";
import { loginSchema, LoginValues } from "@/src/lib/validations/auth";
import Input from "../ui/input";
import PasswordInput from "../ui/password-input";
import Button from "../ui/button";
import Link from "next/link";
import { Mail, Lock, ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const { mutate, isPending } = useLogin();
  const [twoFactorToken, setTwoFactorToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginValues) => {
    mutate(data, {
      onSuccess: (response) => {
        if ("requires2FA" in response.data) {
          setTwoFactorToken(response.data.twoFactorToken);
        }
      },
    });
  };

  if (twoFactorToken) {
    return (
      <TwoFactorChallengeForm
        twoFactorToken={twoFactorToken}
        onBack={() => setTwoFactorToken(null)}
      />
    );
  }

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

      <PasswordInput
        label="Password"
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

function TwoFactorChallengeForm({
  twoFactorToken,
  onBack,
}: {
  twoFactorToken: string;
  onBack: () => void;
}) {
  const { mutate, isPending } = useLoginWithTwoFactor();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) return;

    mutate({ twoFactorToken, token: code.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
          <ShieldCheck className="h-7 w-7 text-violet-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Two-factor verification
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="000000"
        inputMode="numeric"
        className="text-center tracking-[0.5em]"
        icon={<ShieldCheck className="w-5 h-5" />}
      />

      <Button
        loading={isPending}
        disabled={code.trim().length !== 6}
        variant="tribely"
        className="w-full h-14 text-base font-semibold rounded-2xl mt-2"
      >
        Verify &amp; sign in
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-sm font-medium text-primary hover:underline"
      >
        Back to login
      </button>
    </form>
  );
}
