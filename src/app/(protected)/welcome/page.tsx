"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AtSign, Cake } from "lucide-react";

import { useProfile } from "@/src/hooks/use-profile";
import { useUpdateProfile } from "@/src/hooks/use-update-profile";
import { rememberedReturnTo } from "@/src/lib/return-to";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import DateOfBirthPicker from "@/src/components/ui/date-picker";
import UserAvatar from "@/src/components/ui/user-avatar";
import Skeleton from "@/src/components/ui/skeleton";

const welcomeSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(30, "30 characters or fewer")
    .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, underscores and periods"),
  dateOfBirth: z.string().optional(),
});

type WelcomeValues = z.infer<typeof welcomeSchema>;

// "ada.okafor" from "Ada Okafor" - a starting point they can change.
const suggestUsername = (name: string) =>
  name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 24);

// First stop after creating an account with Google, which only gives us a
// name, email and photo. Everything here is optional - the dashboard
// checklist covers whatever they skip.
export default function WelcomePage() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<WelcomeValues>({ resolver: zodResolver(welcomeSchema) });
  const { register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (!profile) return;
    const suggestion = suggestUsername(profile.name);
    reset({
      username: profile.username ?? (suggestion.length >= 3 ? suggestion : ""),
      dateOfBirth: profile.dateOfBirth?.slice(0, 10) ?? "",
    });
  }, [profile, reset]);

  const next = () => router.push(rememberedReturnTo() ?? "/dashboard");

  const onSubmit = (values: WelcomeValues) => {
    updateProfile(
      {
        username: values.username,
        ...(values.dateOfBirth ? { dateOfBirth: values.dateOfBirth } : {}),
      },
      { onSuccess: next }
    );
  };

  if (isLoading || !profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <Skeleton className="h-[460px] w-full rounded-3xl" />
      </div>
    );
  }

  const firstName = profile.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <div className="rounded-3xl border border-line-soft bg-surface px-5 py-8 shadow-xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <UserAvatar name={profile.name} src={profile.avatar} size={76} className="ring-4 ring-violet-100 dark:ring-violet-500/20" />
          <h1 className="mt-5 text-[26px] font-bold leading-tight text-ink">Welcome to Nestly, {firstName}!</h1>
          <p className="mt-2 text-[14px] text-muted">Two quick things so people can find you. You can change them any time.</p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div>
              <Input
                label="Username"
                placeholder="e.g. ada.okafor"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                {...register("username")}
                error={errors.username?.message}
                icon={<AtSign className="h-5 w-5" />}
              />
              <p className="mt-2 text-[12.5px] text-muted">Your profile link and how people mention you.</p>
            </div>

            <div>
              <DateOfBirthPicker label="Birthday (optional)" placeholder="Select your date of birth" />
              <p className="mt-2 flex items-start gap-1.5 text-[12.5px] leading-snug text-muted">
                <Cake className="mt-px h-3.5 w-3.5 shrink-0 text-violet-500" />
                So your followers can celebrate you. Only the day is shared — your age stays private.
              </p>
            </div>

            <Button loading={isPending} variant="tribely" className="h-14 w-full rounded-2xl text-base font-semibold">
              Continue
            </Button>

            <button
              type="button"
              onClick={next}
              className="w-full text-center text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Skip for now
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
