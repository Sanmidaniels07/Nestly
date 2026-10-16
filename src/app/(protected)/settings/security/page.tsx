"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, UserX } from "lucide-react";

import { useProfile } from "@/src/hooks/use-profile";
import { useSetupTwoFactor } from "@/src/hooks/use-setup-two-factor";
import { useVerifyTwoFactorSetup } from "@/src/hooks/use-verify-two-factor-setup";
import { useDisableTwoFactor } from "@/src/hooks/use-disable-two-factor";
import { useBlockedUsers } from "@/src/hooks/use-blocked-users";
import { useUnblockUser } from "@/src/hooks/use-unblock-user";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import UserAvatar from "@/src/components/ui/user-avatar";
import { FormCardSkeleton } from "@/src/components/skeletons/form-card-skeleton";

export default function SettingsSecurityPage() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <div className="space-y-6">
        <FormCardSkeleton fields={1} />
        <FormCardSkeleton fields={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-ink">
          Security
        </h2>
        <p className="mt-1 text-[13.5px] text-muted">
          Two-factor authentication and blocked accounts.
        </p>
      </div>

      <TwoFactorSection enabled={profile.twoFactorEnabled} />
      <BlockedUsersSection />
    </div>
  );
}

function TwoFactorSection({ enabled }: { enabled: boolean }) {
  const { mutate: setup, data: setupData, isPending: isSettingUp } = useSetupTwoFactor();
  const { mutate: verify, isPending: isVerifying } = useVerifyTwoFactorSetup();
  const { mutate: disable, isPending: isDisabling } = useDisableTwoFactor();

  const [code, setCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [disabling, setDisabling] = useState(false);

  const qr = setupData?.data;

  if (enabled) {
    return (
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
            <ShieldCheck size={17} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-ink">
              Two-factor authentication is on
            </h3>
            <p className="mt-1 text-[13px] text-muted">
              You&apos;ll be asked for a code from your authenticator app each time you log in.
            </p>
          </div>
        </div>

        {disabling ? (
          <div className="mt-4 space-y-3">
            <Input
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code to disable"
              inputMode="numeric"
              className="max-w-[220px] text-center tracking-[0.3em]"
            />
            <div className="flex gap-2.5">
              <Button
                variant="outline"
                onClick={() => setDisabling(false)}
                className="h-11 rounded-xl px-6"
              >
                Cancel
              </Button>
              <button
                onClick={() => disable(disableCode, { onSuccess: () => setDisabling(false) })}
                disabled={disableCode.length !== 6 || isDisabling}
                className="h-11 rounded-xl bg-red-600 px-6 text-[13.5px] font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDisabling ? "Disabling..." : "Confirm disable"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setDisabling(true)}
            className="mt-4 h-11 rounded-xl border border-red-200 dark:border-red-500/30 px-6 text-[13.5px] font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            Disable two-factor authentication
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <ShieldCheck size={17} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold text-ink">
            Two-factor authentication
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            Add an extra layer of security using an authenticator app like Google
            Authenticator or Authy.
          </p>
        </div>
      </div>

      {!qr ? (
        <Button
          variant="outline"
          onClick={() => setup()}
          loading={isSettingUp}
          className="mt-4 h-11 rounded-xl px-6"
        >
          Get started
        </Button>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-surface-sunken p-5 sm:flex-row sm:items-start">
            <Image
              src={qr.qrCodeDataUrl}
              alt="Two-factor QR code"
              width={140}
              height={140}
              className="shrink-0 rounded-xl border border-line bg-surface p-2"
              unoptimized
            />
            <div className="min-w-0">
              <p className="text-[13px] text-muted">
                Scan this with your authenticator app, or enter the code manually:
              </p>
              <p className="mt-2 break-all rounded-lg bg-surface px-3 py-2 font-[family-name:var(--font-mono)] text-[12.5px] text-ink">
                {qr.secret}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              label="Enter the 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              inputMode="numeric"
              className="max-w-[220px] text-center tracking-[0.3em]"
            />
            <Button
              variant="tribely"
              onClick={() => verify(code)}
              loading={isVerifying}
              disabled={code.length !== 6}
              className="h-11 rounded-xl px-6"
            >
              Verify &amp; enable
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function BlockedUsersSection() {
  const { data, isLoading } = useBlockedUsers({ limit: 20 });
  const { mutate: unblock, isPending } = useUnblockUser();

  const blockedUsers = data?.blockedUsers ?? [];

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <h3 className="text-[15px] font-semibold text-ink">Blocked accounts</h3>
      <p className="mt-1 text-[13px] text-muted">
        People you&apos;ve blocked can&apos;t follow you, message you, or see your posts.
      </p>

      <div className="mt-4 space-y-2.5">
        {isLoading ? (
          <div className="h-14 animate-pulse rounded-2xl bg-surface-2" />
        ) : blockedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong py-8 text-center">
            <UserX size={22} className="text-faint" strokeWidth={1.5} />
            <p className="mt-2.5 text-[13px] text-subtle">No blocked accounts.</p>
          </div>
        ) : (
          blockedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 rounded-2xl border border-line p-3.5"
            >
              <UserAvatar name={user.name} src={user.avatar} size={36} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-ink">{user.name}</p>
                {user.username && (
                  <p className="text-[12px] text-subtle">@{user.username}</p>
                )}
              </div>
              <button
                onClick={() => unblock(user.id)}
                disabled={isPending}
                className="shrink-0 rounded-lg border border-line-strong px-3 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-violet-200 dark:hover:border-violet-500/30 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-50"
              >
                Unblock
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
