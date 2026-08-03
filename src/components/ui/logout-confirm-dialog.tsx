"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { useLogout } from "@/src/hooks/use-logout";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LogoutConfirmDialog({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const { mutate: logout, isPending } = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-opacity-25 backdrop-brightness-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-[#ECE9F6] bg-white p-6 shadow-2xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle size={22} className="text-red-500" />
        </div>

        <h2 className="mt-4 text-[17px] font-semibold text-[#13131A]">Log out?</h2>
        <p className="mt-1.5 text-[13.5px] text-[#64748B]">
          You&apos;ll need to sign in again to access your account.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 rounded-xl border border-[#ECE9F6] py-2.5 text-[13.5px] font-semibold text-[#334155] transition-colors hover:bg-[#F7F7FB] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            disabled={isPending}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Logging out..." : "Continue"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
