"use client";

import { useState } from "react";
import { BadgeCheck, Search, ShieldCheck, Users as UsersIcon } from "lucide-react";

import { useAuthStore } from "@/src/store/auth-store";
import { useAdminUsers } from "@/src/hooks/use-admin-users";
import { useUpdateUserRole } from "@/src/hooks/use-update-user-role";
import { useUpdateUserStatus } from "@/src/hooks/use-update-user-status";
import { AdminUser, UserAccountStatus, UserRole } from "@/src/types/admin-user";
import Input from "@/src/components/ui/input";
import Pagination from "@/src/components/ui/pagination";

const STATUS_TONE: Record<UserAccountStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  SUSPENDED: "bg-amber-50 text-amber-700",
  BANNED: "bg-red-50 text-red-700",
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

export default function UsersManager() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [status, setStatus] = useState<UserAccountStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminUsers({
    page,
    limit: 15,
    search: search.trim() || undefined,
    role: role !== "ALL" ? role : undefined,
    status: status !== "ALL" ? status : undefined,
  });

  const users = data?.users ?? [];

  return (
    <div className="space-y-5">
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
          className="h-14 rounded-3xl border border-gray-200 bg-white px-4 text-[14px] text-[#13131A] outline-none transition-colors focus:border-violet-400"
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
          className="h-14 rounded-3xl border border-gray-200 bg-white px-4 text-[14px] text-[#13131A] outline-none transition-colors focus:border-violet-400"
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
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#F7F7FB]" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ECE9F6] bg-[#FAFAFD] px-8 py-16 text-center">
          <UsersIcon className="mx-auto h-8 w-8 text-[#C4C0DC]" strokeWidth={1.5} />
          <p className="mt-4 text-[13.5px] text-[#94A3B8]">No users match your filters.</p>
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

function UserRow({ user }: { user: AdminUser }) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isSelf = user.id === currentUserId;

  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();

  const [pendingAction, setPendingAction] = useState<"SUSPENDED" | "BANNED" | null>(null);
  const [reason, setReason] = useState("");

  const handleConfirmAction = () => {
    if (!pendingAction || !reason.trim()) return;
    updateStatus(
      { id: user.id, data: { status: pendingAction, reason: reason.trim() } },
      { onSuccess: () => setPendingAction(null) }
    );
    setReason("");
  };

  return (
    <div className="rounded-2xl border border-[#ECE9F6] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-semibold text-[#13131A]">{user.name}</p>
            {user.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
            {isSelf && (
              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10.5px] font-medium text-violet-700">
                You
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[12.5px] text-[#64748B]">
            {user.email}
            {user.username && ` · @${user.username}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#F1F0F5] px-2.5 py-1 text-[11px] font-medium capitalize text-[#64748B]">
            {user.role.toLowerCase()}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_TONE[user.status]}`}
          >
            {user.status.toLowerCase()}
          </span>
        </div>
      </div>

      {user.statusReason && user.status !== "ACTIVE" && (
        <p className="mt-2 rounded-lg bg-[#FAFAFD] px-3 py-2 text-[12px] text-[#64748B]">
          Reason: {user.statusReason}
        </p>
      )}

      {!isSelf && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-[#F2F1F8] pt-3.5">
          <button
            onClick={() => updateRole({ id: user.id, role: user.role === "ADMIN" ? "USER" : "ADMIN" })}
            disabled={isUpdatingRole}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-medium text-[#334155] transition-colors hover:border-violet-200 hover:text-violet-700 disabled:opacity-50"
          >
            <ShieldCheck size={13} />
            {user.role === "ADMIN" ? "Remove admin" : "Make admin"}
          </button>

          {user.status !== "ACTIVE" ? (
            <button
              onClick={() => updateStatus({ id: user.id, data: { status: "ACTIVE" } })}
              disabled={isUpdatingStatus}
              className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[12px] font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50"
            >
              Reactivate
            </button>
          ) : (
            <>
              <button
                onClick={() => setPendingAction(pendingAction === "SUSPENDED" ? null : "SUSPENDED")}
                className="rounded-lg border border-amber-200 px-3 py-1.5 text-[12px] font-medium text-amber-700 transition-colors hover:bg-amber-50"
              >
                Suspend
              </button>
              <button
                onClick={() => setPendingAction(pendingAction === "BANNED" ? null : "BANNED")}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Ban
              </button>
            </>
          )}
        </div>
      )}

      {pendingAction && (
        <div className="mt-3 space-y-2.5 rounded-xl border border-dashed border-[#E2E0EE] bg-[#FAFAFD] p-3.5">
          <p className="text-[12.5px] text-[#64748B]">
            Reason for {pendingAction === "SUSPENDED" ? "suspending" : "banning"}{" "}
            {user.name} (required):
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-[#E4E6EB] bg-white px-3.5 py-2.5 text-[13px] text-[#13131A] outline-none focus:border-violet-400"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setPendingAction(null);
                setReason("");
              }}
              className="rounded-lg px-3.5 py-2 text-[12.5px] font-medium text-[#64748B] hover:bg-gray-100"
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
