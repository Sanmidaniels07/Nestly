"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  KeyRound,
  Laptop,
  LogOut,
  ShieldAlert,
  Smartphone,
  Star,
} from "lucide-react";

import { useProfile } from "@/src/hooks/use-profile";
import { useLogout } from "@/src/hooks/use-logout";
import { useChangePassword } from "@/src/hooks/use-change-password";
import { useDeleteAccount } from "@/src/hooks/use-delete-account";
import { useAccountSessions } from "@/src/hooks/use-account-sessions";
import { useRevokeSession } from "@/src/hooks/use-revoke-session";
import { useRevokeOtherSessions } from "@/src/hooks/use-revoke-other-sessions";
import { useSavedCards } from "@/src/hooks/use-saved-cards";
import { useDeleteSavedCard } from "@/src/hooks/use-delete-saved-card";
import { useSetDefaultSavedCard } from "@/src/hooks/use-set-default-saved-card";
import { AccountSession } from "@/src/types/auth";
import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import PasswordInput from "@/src/components/ui/password-input";
import { FormCardSkeleton } from "@/src/components/skeletons/form-card-skeleton";
import { formatRelativeTime } from "@/src/lib/date";

export default function SettingsAccountPage() {
  const { data: profile, isLoading } = useProfile();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (isLoading || !profile) {
    return (
      <div className="space-y-6">
        <FormCardSkeleton fields={4} />
        <FormCardSkeleton fields={2} />
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-ink">
          Account
        </h2>
        <p className="mt-1 text-[13.5px] text-muted">
          Your account details, password, and sign-in.
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
        <h3 className="text-[15px] font-semibold text-ink">
          Account details
        </h3>

        <div className="mt-5 divide-y divide-line-soft">
          <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
            <span className="text-[13px] text-muted">Email</span>
              <div className="flex min-w-0 items-center gap-1.5">
             <span className="min-w-0 truncate text-[13.5px] font-medium text-ink">
                {profile.email}
              </span>
              {profile.isVerified ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  <BadgeCheck size={12} />
                  Verified
                </span>
              ) : (
            <span className="shrink-0 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                  Unverified
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <span className="text-[13px] text-muted">Username</span>
            <span className="text-[13.5px] font-medium text-ink">
              {profile.username ? `@${profile.username}` : "Not set"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5">
            <span className="text-[13px] text-muted">Account type</span>
            <span className="rounded-full bg-violet-50 dark:bg-violet-500/10 px-2.5 py-1 text-[11.5px] font-medium capitalize text-violet-700 dark:text-violet-300">
              {profile.role.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 py-3.5 last:pb-0">
            <span className="text-[13px] text-muted">Member since</span>
            <span className="text-[13.5px] font-medium text-ink">
              {memberSince}
            </span>
          </div>
        </div>

        <p className="mt-4 text-[12px] text-subtle">
          Want to update your name, bio, or other public details? Head to{" "}
          <Link
            href="/settings/profile"
            className="font-medium text-violet-600 dark:text-violet-400 hover:underline"
          >
            Profile settings
          </Link>
          .
        </p>
      </section>

      <ChangePasswordSection />

      <SessionsSection />

      <SavedCardsSection />

      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
            <LogOut size={17} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-ink">
              Sign out
            </h3>
            <p className="mt-1 text-[13px] text-muted">
              End your session on this device.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => logout()}
          loading={isLoggingOut}
          className="mt-4 h-11 rounded-xl px-6"
        >
          Log out
        </Button>
      </section>

      <DeleteAccountSection />
    </div>
  );
}

function ChangePasswordSection() {
  const { mutate: changePassword, isPending } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canSubmit =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length >= 6 &&
    newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <KeyRound size={17} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold text-ink">
            Change password
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            You&apos;ll be signed out everywhere after changing your password.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <PasswordInput
          label="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordInput
            label="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordInput
            label="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={
              confirmPassword && newPassword !== confirmPassword
                ? "Passwords don't match"
                : undefined
            }
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          loading={isPending}
          disabled={!canSubmit}
          className="h-11 rounded-xl px-6"
        >
          Update password
        </Button>
      </form>
    </section>
  );
}

function SessionsSection() {
  const { data: sessions, isLoading } = useAccountSessions();
  const { mutate: revokeSession, isPending: isRevoking } = useRevokeSession();
  const { mutate: revokeOthers, isPending: isRevokingOthers } =
    useRevokeOtherSessions();

  const hasOtherSessions = (sessions ?? []).some((s) => !s.isCurrent);

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">
            Active sessions
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            Devices currently signed in to your account.
          </p>
        </div>

        {hasOtherSessions && (
          <button
            onClick={() => revokeOthers()}
            disabled={isRevokingOthers}
            className="text-[12.5px] font-medium text-red-600 dark:text-red-400 transition-colors hover:underline disabled:opacity-50"
          >
            Sign out other sessions
          </button>
        )}
      </div>

      <div className="mt-4 space-y-2.5">
        {isLoading ? (
          <>
            <div className="h-16 animate-pulse rounded-2xl bg-surface-2" />
            <div className="h-16 animate-pulse rounded-2xl bg-surface-2" />
          </>
        ) : (
          sessions?.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              onRevoke={() => revokeSession(session.id)}
              isRevoking={isRevoking}
            />
          ))
        )}
      </div>
    </section>
  );
}

function SessionRow({
  session,
  onRevoke,
  isRevoking,
}: {
  session: AccountSession;
  onRevoke: () => void;
  isRevoking: boolean;
}) {
  const isMobile = /mobile|android|iphone/i.test(session.userAgent ?? "");
  const Icon = isMobile ? Smartphone : Laptop;

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-line p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13.5px] font-medium text-ink">
            {session.userAgent
              ? session.userAgent.slice(0, 60)
              : "Unknown device"}
          </p>
          {session.isCurrent && (
            <span className="shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10.5px] font-medium text-emerald-700 dark:text-emerald-300">
              This device
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[12px] text-subtle">
          {session.ipAddress ?? "Unknown IP"} · Active{" "}
          {formatRelativeTime(session.createdAt)}
        </p>
      </div>

      {!session.isCurrent && (
        <button
          onClick={onRevoke}
          disabled={isRevoking}
          className="shrink-0 rounded-lg border border-line-strong px-3 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-red-200 dark:hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
        >
          Sign out
        </button>
      )}
    </div>
  );
}

function SavedCardsSection() {
  const { data: cards, isLoading } = useSavedCards();
  const { mutate: deleteCard, isPending: isDeleting } = useDeleteSavedCard();
  const { mutate: setDefault, isPending: isSettingDefault } =
    useSetDefaultSavedCard();

  return (
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <CreditCard size={17} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold text-ink">
            Saved cards
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            Cards you&apos;ve saved from a previous checkout.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {isLoading ? (
          <div className="h-14 animate-pulse rounded-2xl bg-surface-2" />
        ) : !cards?.length ? (
          <p className="text-[13px] text-subtle">
            No saved cards yet. They&apos;ll appear here after your next
            checkout.
          </p>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-line p-3.5"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard size={15} className="shrink-0 text-muted" />
                <span className="text-[13.5px] font-medium text-ink">
                  {card.cardType ?? "Card"} •••• {card.last4}
                </span>
                {card.isDefault && (
                  <span className="flex items-center gap-1 rounded-full bg-violet-50 dark:bg-violet-500/10 px-2 py-0.5 text-[10.5px] font-medium text-violet-700 dark:text-violet-300">
                    <Star size={10} className="fill-violet-700" />
                    Default
                  </span>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {!card.isDefault && (
                  <button
                    onClick={() => setDefault(card.id)}
                    disabled={isSettingDefault}
                    className="rounded-lg border border-line-strong px-3 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-violet-200 dark:hover:border-violet-500/30 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-50"
                  >
                    Make default
                  </button>
                )}
                <button
                  onClick={() => deleteCard(card.id)}
                  disabled={isDeleting}
                  className="rounded-lg border border-line-strong px-3 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-red-200 dark:hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function DeleteAccountSection() {
  const { mutate: deleteAccount, isPending } = useDeleteAccount();
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");

  const handleDelete = () => {
    if (!password.trim()) return;
    deleteAccount(password);
  };

  return (
    <section className="rounded-2xl border border-red-100 dark:border-red-500/20 bg-red-50/40 p-6 sm:p-7">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
          <ShieldAlert size={17} className="text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold text-ink">
            Delete account
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            Permanently delete your account. This cannot be undone.
          </p>
        </div>
      </div>

      {confirming ? (
        <div className="mt-4 space-y-3">
          <Input
            type="password"
            label="Confirm your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password to confirm"
          />
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setConfirming(false);
                setPassword("");
              }}
              className="h-11 w-full rounded-xl px-6 sm:w-auto"
            >
              Cancel
            </Button>
            <button
              onClick={handleDelete}
              disabled={!password.trim() || isPending}
              className="h-11 w-full whitespace-nowrap rounded-xl bg-red-600 px-6 text-[13.5px] font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isPending ? "Deleting..." : "Permanently delete my account"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="mt-4 h-11 rounded-xl border border-red-200 dark:border-red-500/30 px-6 text-[13.5px] font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          Delete my account
        </button>
      )}
    </section>
  );
}
