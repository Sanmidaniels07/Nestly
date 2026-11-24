"use client";

import { useState } from "react";
import { BadgeCheck, Search, ShieldCheck, Users as UsersIcon } from "lucide-react";

import { useAuthStore } from "@/src/store/auth-store";
import { useAdminUsers } from "@/src/hooks/use-admin-users";
import { useUpdateUserRole } from "@/src/hooks/use-update-user-role";
import { useUpdateUserStatus } from "@/src/hooks/use-update-user-status";
import {
  AdminGuestFilter,
  AdminGuestSummary,
  AdminUser,
  UserAccountStatus,
  UserRole,
} from "@/src/types/admin-user";
import Input from "@/src/components/ui/input";
import Pagination from "@/src/components/ui/pagination";
import { useFormDraft } from "@/src/hooks/use-form-draft";

const STATUS_TONE: Record<UserAccountStatus, string> = {
  ACTIVE: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  SUSPENDED: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
  BANNED: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300",
};

const ROLE_FILTERS: { label: string; value: UserRole | "ALL" }[] = [
  { label: "All roles", value: "ALL" },
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];

const STATUS_FILTERS: { label: string; value: UserAccountStatus | "ALL" }[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Banned", value: "BANNED" },
];

// People who checked out without an account, split by whether they later
// turned it into a full account.
const GUEST_FILTERS: { label: string; value: AdminGuestFilter }[] = [
  { label: "All guests", value: "all" },
  { label: "Signed up", value: "signed_up" },
  { label: "Not signed up", value: "not_signed_up" },
  { label: "Said no thanks", value: "declined" },
];

const chipClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
    active
      ? "bg-violet-600 text-white"
      : "border border-line-strong text-muted hover:border-violet-200 dark:hover:border-violet-500/30"
  }`;

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function UsersManager() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [status, setStatus] = useState<UserAccountStatus | "ALL">("ALL");
  // null = the normal user list; otherwise the guest-shopper view.
  const [guests, setGuests] = useState<AdminGuestFilter | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminUsers({
    page,
    limit: 15,
    search: search.trim() || undefined,
    role: role !== "ALL" ? role : undefined,
    status: status !== "ALL" ? status : undefined,
    guests: guests ?? undefined,
  });

  const users = data?.users ?? [];

  const changeGuests = (value: AdminGuestFilter | null) => {
    setGuests(value);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => changeGuests(null)} className={chipClass(guests === null)}>
          All users
        </button>
        <button onClick={() => changeGuests(guests ?? "all")} className={chipClass(guests !== null)}>
          Guest shoppers
        </button>
      </div>

      {guests !== null && (
        <div className="space-y-3 rounded-2xl border border-line bg-surface-sunken p-3.5 sm:p-4">
          <p className="text-[12.5px] text-muted">
            People who checked out without an account, and whether they signed up afterwards.
          </p>
          <div className="flex flex-wrap gap-2">
            {GUEST_FILTERS.map((f) => (
              <button key={f.value} onClick={() => changeGuests(f.value)} className={chipClass(guests === f.value)}>
                {f.label}
              </button>
            ))}
          </div>
          <GuestSummaryTiles summary={data?.guestSummary ?? null} isLoading={isLoading} />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-[1fr_160px_160px]">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, or username..."
          icon={<Search size={16} />}
        />

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value as UserRole | "ALL");
            setPage(1);
          }}
          className="h-14 rounded-3xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-colors focus:border-violet-400"
        >
          {ROLE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as UserAccountStatus | "ALL");
            setPage(1);
          }}
          className="h-14 rounded-3xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-colors focus:border-violet-400"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-8 py-16 text-center">
          <UsersIcon className="mx-auto h-8 w-8 text-faint" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-subtle">
            {guests !== null ? "No guest shoppers match your filters." : "No users match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

function GuestSummaryTiles({
  summary,
  isLoading,
}: {
  summary: AdminGuestSummary | null;
  isLoading: boolean;
}) {
  if (!summary) {
    return isLoading ? (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[68px] animate-pulse rounded-xl bg-surface-2" />
        ))}
      </div>
    ) : null;
  }

  const rate = summary.total > 0 ? Math.round((summary.signedUp / summary.total) * 100) : 0;
  const tiles: { label: string; value: string; tone?: string }[] = [
    { label: "Guests", value: summary.total.toLocaleString() },
    { label: "Signed up", value: summary.signedUp.toLocaleString(), tone: "text-emerald-700 dark:text-emerald-300" },
    { label: "Not signed up", value: summary.notSignedUp.toLocaleString(), tone: "text-amber-700 dark:text-amber-300" },
    { label: "Said no thanks", value: summary.declined.toLocaleString(), tone: "text-red-600 dark:text-red-400" },
    { label: "Sign-up rate", value: summary.total > 0 ? `${rate}%` : "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
      {tiles.map((t, i) => (
        <div
          key={t.label}
          className={`min-w-0 rounded-xl border border-line bg-surface px-3.5 py-3 ${
            i === tiles.length - 1 ? "col-span-2 sm:col-span-1" : ""
          }`}
        >
          <p className="truncate text-[11.5px] text-muted">{t.label}</p>
          <p className={`mt-1 truncate text-[20px] font-semibold leading-tight tabular-nums ${t.tone ?? "text-ink"}`}>
            {t.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// Badge + small dates for anyone who ever checked out as a guest.
function GuestInfo({ user }: { user: AdminUser }) {
  if (!user.guestSince) return null;

  const badge = !user.isGuest
    ? {
        label: "Guest → signed up",
        tone: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      }
    : user.guestDeclinedAt
      ? {
          label: "Guest – said no thanks",
          tone: "bg-red-50 dark:bg-red-500/10 text-red-700/80 dark:text-red-300/80",
        }
      : {
          label: "Guest – not signed up",
          tone: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
        };

  const orders = user._count?.orders ?? 0;
  const details = [
    `First guest checkout ${formatShortDate(user.guestSince)}`,
    !user.isGuest && user.guestJoinedAt ? `Signed up ${formatShortDate(user.guestJoinedAt)}` : null,
    user.isGuest && user.guestDeclinedAt ? `Said no ${formatShortDate(user.guestDeclinedAt)}` : null,
    `${orders} paid order${orders === 1 ? "" : "s"}`,
  ].filter(Boolean);

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.tone}`}>{badge.label}</span>
      <span className="text-[11.5px] text-subtle">{details.join(" · ")}</span>
    </div>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isSelf = user.id === currentUserId;

  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();

  const [pendingAction, setPendingAction] = useState<"SUSPENDED" | "BANNED" | null>(null);
  const [reason, setReason] = useState("");

  // A half-written suspend/ban reason is kept in this browser (and the box
  // reopened) until it's sent or cancelled.
  const { clear: clearSaved } = useFormDraft(
    `admin:user-action:${user.id}`,
    { pendingAction, reason },
    (saved) => {
      setPendingAction(saved.pendingAction ?? null);
      setReason(saved.reason ?? "");
    },
    { isEmpty: (value) => !value.pendingAction || !value.reason.trim() }
  );

  const handleConfirmAction = () => {
    if (!pendingAction || !reason.trim()) return;
    updateStatus(
      { id: user.id, data: { status: pendingAction, reason: reason.trim() } },
      { onSuccess: () => setPendingAction(null) }
    );
    clearSaved();
    setReason("");
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-semibold text-ink">{user.name}</p>
            {user.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
            {isSelf && (
              <span className="rounded-full bg-violet-50 dark:bg-violet-500/10 px-2 py-0.5 text-[10.5px] font-medium text-violet-700 dark:text-violet-300">
                You
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[12.5px] text-muted [overflow-wrap:anywhere]">
            {user.email}
            {user.username && ` · @${user.username}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium capitalize text-muted">
            {user.role.toLowerCase()}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_TONE[user.status]}`}
          >
            {user.status.toLowerCase()}
          </span>
        </div>
      </div>

      <GuestInfo user={user} />

      {user.statusReason && user.status !== "ACTIVE" && (
        <p className="mt-2 rounded-lg bg-surface-sunken px-3 py-2 text-[12px] text-muted">
          Reason: {user.statusReason}
        </p>
      )}

      {!isSelf && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3.5">
          <button
            onClick={() => updateRole({ id: user.id, role: user.role === "ADMIN" ? "USER" : "ADMIN" })}
            disabled={isUpdatingRole}
            className="flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:border-violet-200 dark:hover:border-violet-500/30 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-50"
          >
            <ShieldCheck size={13} />
            {user.role === "ADMIN" ? "Remove admin" : "Make admin"}
          </button>

          {user.status !== "ACTIVE" ? (
            <button
              onClick={() => updateStatus({ id: user.id, data: { status: "ACTIVE" } })}
              disabled={isUpdatingStatus}
              className="rounded-lg border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:opacity-50"
            >
              Reactivate
            </button>
          ) : (
            <>
              <button
                onClick={() => setPendingAction(pendingAction === "SUSPENDED" ? null : "SUSPENDED")}
                className="rounded-lg border border-amber-200 dark:border-amber-500/30 px-3 py-1.5 text-[12px] font-medium text-amber-700 dark:text-amber-300 transition-colors hover:bg-amber-50 dark:hover:bg-amber-500/10"
              >
                Suspend
              </button>
              <button
                onClick={() => setPendingAction(pendingAction === "BANNED" ? null : "BANNED")}
                className="rounded-lg border border-red-200 dark:border-red-500/30 px-3 py-1.5 text-[12px] font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                Ban
              </button>
            </>
          )}
        </div>
      )}

      {pendingAction && (
        <div className="mt-3 space-y-2.5 rounded-xl border border-dashed border-line-strong bg-surface-sunken p-3.5">
          <p className="text-[12.5px] text-muted">
            Reason for {pendingAction === "SUSPENDED" ? "suspending" : "banning"}{" "}
            {user.name} (required):
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-violet-400"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                clearSaved();
                setPendingAction(null);
                setReason("");
              }}
              className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-muted hover:bg-surface-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={!reason.trim() || isUpdatingStatus}
              className={`rounded-lg px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-50 ${
                pendingAction === "BANNED"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {isUpdatingStatus ? "Saving..." : `Confirm ${pendingAction === "BANNED" ? "ban" : "suspension"}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
