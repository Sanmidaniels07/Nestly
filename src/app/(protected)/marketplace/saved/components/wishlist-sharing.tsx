"use client";

import Link from "next/link";
import { Globe, Gift, Lock, Loader2, Users } from "lucide-react";

import { useUpdateWishlistVisibility, useWishlistVisibility } from "@/src/hooks/use-wishlist";
import { useAuthStore } from "@/src/store/auth-store";
import { WishlistVisibility } from "@/src/types/wishlist";

const CHOICES: { value: WishlistVisibility; label: string; hint: string; icon: typeof Lock }[] = [
  { value: "PRIVATE", label: "Only me", hint: "Nobody else can see it", icon: Lock },
  { value: "FOLLOWERS", label: "Followers", hint: "Gift ideas for your birthday", icon: Users },
  { value: "EVERYONE", label: "Everyone", hint: "Anyone with your profile", icon: Globe },
];

// Who can see your wishlist. Shared with followers, it's what they see in
// "your birthday is tomorrow" reminders - and they can send you any item as
// a gift without knowing your address.
export default function WishlistSharing() {
  const { data: visibility } = useWishlistVisibility();
  const { mutate: update, isPending, variables } = useUpdateWishlistVisibility();
  const me = useAuthStore((state) => state.user);
  const current = isPending && variables ? variables : visibility;

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            <Gift size={18} />
          </span>
          <div>
            <p className="text-[14.5px] font-semibold text-ink">Who can see your wishlist?</p>
            <p className="mt-0.5 max-w-xl text-[12.5px] leading-relaxed text-muted">
              Share it and friends can send you anything on it as a gift - they never need your address. Followers get your
              wishlist in a reminder the day before your birthday.
            </p>
          </div>
        </div>
        {me && current && current !== "PRIVATE" && (
          <Link
            href={`/users/${me.id}?tab=wishlist`}
            className="text-[12.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300"
          >
            See how it looks
          </Link>
        )}
      </div>

      <div role="radiogroup" aria-label="Who can see your wishlist" className="mt-4 grid gap-2 sm:grid-cols-3">
        {CHOICES.map(({ value, label, hint, icon: Icon }) => {
          const active = current === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={!visibility || isPending}
              onClick={() => value !== visibility && update(value)}
              className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors disabled:cursor-wait ${
                active
                  ? "border-violet-500 bg-violet-50 dark:border-violet-400/60 dark:bg-violet-500/10"
                  : "border-line hover:border-violet-300 dark:hover:border-violet-500/40"
              }`}
            >
              {isPending && variables === value ? (
                <Loader2 size={16} className="shrink-0 animate-spin text-violet-600" />
              ) : (
                <Icon size={16} className={`shrink-0 ${active ? "text-violet-600 dark:text-violet-300" : "text-subtle"}`} />
              )}
              <span>
                <span className="block text-[13px] font-semibold text-ink">{label}</span>
                <span className="block text-[11.5px] text-muted">{hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
