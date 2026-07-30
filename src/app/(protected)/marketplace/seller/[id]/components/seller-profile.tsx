"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BadgeCheck, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Store } from "@/src/types/store";
import UserAvatar from "@/src/components/ui/user-avatar";
import ReportButton from "@/src/components/ui/report-button";
import Tooltip from "@/src/components/ui/tooltip";
import { useAuthStore } from "@/src/store/auth-store";
import { useStoreFollowStatus } from "@/src/hooks/use-store-follow-status";
import { useToggleStoreFollow } from "@/src/hooks/use-toggle-store-follow";
import { useCreateConversation } from "@/src/hooks/use-create-conversation";
import { useVerifyStore } from "@/src/hooks/use-verify-store";

async function copyToClipboard(value: string, message: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(message);
  } catch {
    toast.error("Couldn't copy to clipboard");
  }
}

interface Props {
  store: Store;
}

export default function SellerProfile({ store }: Props) {
  const location = [store.city, store.state].filter(Boolean).join(", ");
  const authUser = useAuthStore((state) => state.user);
  const isOwnStore = !!authUser && store.seller?.user.id === authUser.id;
  const isAdmin = authUser?.role === "ADMIN";

  return (
    <section className="relative z-10 -mt-16 sm:-mt-20">
      <div className="rounded-2xl border border-[#ECE9F6] bg-white p-6 shadow-[0_20px_50px_-24px_rgba(15,15,20,0.15)] sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-[0_8px_20px_-8px_rgba(15,15,20,0.25)] sm:h-28 sm:w-28">
              {store.logo ? (
                <Image src={store.logo} alt={store.name} fill className="object-cover" />
              ) : (
                <UserAvatar name={store.name} size={112} />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A] sm:text-[30px]">
                  {store.name}
                </h1>
                {store.isVerified && (
                  <BadgeCheck size={20} className="shrink-0 fill-violet-600 text-white" />
                )}
              </div>

              {typeof store.followersCount === "number" && (
                <p className="mt-1 font-[family-name:var(--font-mono)] text-[12.5px] text-[#94A3B8]">
                  {store.followersCount} follower{store.followersCount === 1 ? "" : "s"}
                </p>
              )}

              {store.description && (
                <p className="mt-2 max-w-xl text-[13.5px] leading-6 text-[#64748B]">
                  {store.description}
                </p>
              )}

              {location && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#475569]">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-violet-600" />
                    {location}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {isAdmin && !isOwnStore && <VerifyStoreButton store={store} />}

            {!isOwnStore && authUser && (
              <>
                <MessageSellerButton sellerId={store.seller!.user.id} />
                <FollowStoreButton slug={store.slug} />
                <ReportButton
                  targetType="STORE"
                  targetId={store.id}
                  label=""
                  className="flex h-11 items-center justify-center rounded-xl border border-[#E5E7EB] px-3.5 text-[#94A3B8] transition-colors hover:border-red-200 hover:text-red-500"
                />
              </>
            )}

            {store.email && (
              <Tooltip label={store.email}>
                <a
                  href={`mailto:${store.email}`}
                  onClick={() => copyToClipboard(store.email!, "Email copied to clipboard")}
                  className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-violet-600 px-5 text-[13px] font-semibold text-violet-700 transition-colors hover:bg-violet-50"
                >
                  <Mail size={14} />
                  Email
                </a>
              </Tooltip>
            )}

            {store.phone && (
              <Tooltip label={store.phone}>
                <a
                  href={`tel:${store.phone}`}
                  onClick={() => copyToClipboard(store.phone!, "Phone number copied to clipboard")}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[13px] font-semibold text-white transition-all hover:brightness-110"
                >
                  <Phone size={15} />
                  Call
                </a>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FollowStoreButton({ slug }: { slug: string }) {
  const { data: isFollowingReal, isLoading } = useStoreFollowStatus(slug);

  if (isLoading) {
    return <div className="h-11 w-24 animate-pulse rounded-xl bg-[#F7F7FB]" />;
  }

  return (
    <FollowStoreButtonInner
      key={String(isFollowingReal)}
      slug={slug}
      initialIsFollowing={isFollowingReal ?? false}
    />
  );
}

function FollowStoreButtonInner({
  slug,
  initialIsFollowing,
}: {
  slug: string;
  initialIsFollowing: boolean;
}) {
  const { isFollowing, toggleFollow, isToggling } = useToggleStoreFollow(
    slug,
    initialIsFollowing
  );

  return (
    <button
      onClick={toggleFollow}
      disabled={isToggling}
      className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-5 text-[13px] font-semibold transition-colors disabled:opacity-50 ${
        isFollowing
          ? "border border-[#E5E7EB] text-[#64748B] hover:border-red-200 hover:text-red-500"
          : "border border-violet-600 text-violet-700 hover:bg-violet-50"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

function MessageSellerButton({ sellerId }: { sellerId: string }) {
  const router = useRouter();
  const { mutate: createConversation, isPending } = useCreateConversation();

  return (
    <button
      onClick={() =>
        createConversation(sellerId, {
          onSuccess: (response) => router.push(`/messages/${response.data.id}`),
        })
      }
      disabled={isPending}
      className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] px-5 text-[13px] font-semibold text-[#334155] transition-colors hover:border-violet-300 hover:text-violet-600 disabled:opacity-50"
    >
      <MessageCircle size={14} />
      Message
    </button>
  );
}

function VerifyStoreButton({ store }: { store: Store }) {
  const { mutate: verifyStore, isPending } = useVerifyStore(store.slug);

  return (
    <button
      onClick={() => verifyStore({ id: store.id, isVerified: !store.isVerified })}
      disabled={isPending}
      className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-5 text-[13px] font-semibold transition-colors disabled:opacity-50 ${
        store.isVerified
          ? "border border-red-200 text-red-600 hover:bg-red-50"
          : "border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
      }`}
    >
      <ShieldCheck size={15} />
      {store.isVerified ? "Unverify store" : "Verify store"}
    </button>
  );
}
