"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Lock, Mail, MapPin, MessageCircle, Phone, ShieldAlert, ShieldCheck } from "lucide-react";
import { Store } from "@/src/types/store";
import UserAvatar from "@/src/components/ui/user-avatar";
import ReportButton from "@/src/components/ui/report-button";
import { useAuthStore } from "@/src/store/auth-store";
import { useStoreFollowStatus } from "@/src/hooks/use-store-follow-status";
import { useToggleStoreFollow } from "@/src/hooks/use-toggle-store-follow";
import { useCreateConversation } from "@/src/hooks/use-create-conversation";
import { useVerifyStore } from "@/src/hooks/use-verify-store";
import { useRequireLogin } from "@/src/hooks/use-session";
import { useMyStore } from "@/src/hooks/use-my-store";
import { getStoreBySlug } from "@/src/services/store.services";
import ShareButton from "@/src/components/ui/share-button";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/src/components/ui/social-icons";
import { SITE_URL } from "@/src/lib/site";
import { socialUrl } from "@/src/lib/social";

interface Props {
  store: Store;
}

// The seller's contact details and social pages. Buyers never see these
// (the API leaves them out) so every conversation and sale stays in the
// app; the owner sees their own, and admins use them to check a store is
// genuine.
function PrivateContacts({ slug, isOwnStore }: { slug: string; isOwnStore: boolean }) {
  // The page's store data may have been fetched before login (server
  // render), so ask again as the signed-in owner/admin.
  const { data: myStore } = useMyStore(isOwnStore);
  const { data: adminStore } = useQuery({
    queryKey: ["store", slug, "admin"],
    queryFn: () => getStoreBySlug(slug),
    select: (response) => response.data,
    enabled: !isOwnStore,
  });
  const store = isOwnStore ? myStore : adminStore;
  if (!store) return null;

  const links = [
    store.whatsapp && { href: socialUrl("whatsapp", store.whatsapp), label: "WhatsApp", Icon: WhatsAppIcon, tone: "text-emerald-600" },
    store.instagram && { href: socialUrl("instagram", store.instagram), label: "Instagram", Icon: InstagramIcon, tone: "text-pink-600" },
    store.facebook && { href: socialUrl("facebook", store.facebook), label: "Facebook", Icon: FacebookIcon, tone: "text-blue-600" },
    store.tiktok && { href: socialUrl("tiktok", store.tiktok), label: "TikTok", Icon: TikTokIcon, tone: "text-ink" },
    store.email && { href: `mailto:${store.email}`, label: store.email, Icon: Mail, tone: "text-violet-600" },
    store.phone && { href: `tel:${store.phone}`, label: store.phone, Icon: Phone, tone: "text-violet-600" },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof WhatsAppIcon; tone: string }[];

  if (links.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-2.5 dark:border-amber-500/30 dark:bg-amber-500/5">
      <p className="mb-2 flex items-center gap-1.5 text-[11.5px] font-medium text-amber-700 dark:text-amber-300">
        <Lock size={12} /> {isOwnStore ? "Only you and Nestly admins see your contact details" : "Only admins see this"}
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map(({ href, label, Icon, tone }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 min-w-0 max-w-full items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[12px] font-medium text-ink-2"
          >
            <Icon size={14} className={`shrink-0 ${tone}`} /> <span className="truncate">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SellerProfile({ store }: Props) {
  const location = [store.city, store.state].filter(Boolean).join(", ");
  const authUser = useAuthStore((state) => state.user);
  const isOwnStore = !!authUser && store.seller?.user.id === authUser.id;
  const isAdmin = authUser?.role === "ADMIN";

  return (
    <section className="relative z-10 -mt-16 sm:-mt-20">
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_20px_50px_-24px_rgba(15,15,20,0.15)] sm:p-7">
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
                <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink sm:text-[30px]">
                  {store.name}
                </h1>
                {store.isVerified && (
                  <BadgeCheck size={20} className="shrink-0 fill-violet-600 text-white" />
                )}
              </div>

              {typeof store.followersCount === "number" && (
                <p className="mt-1 font-[family-name:var(--font-mono)] text-[12.5px] text-subtle">
                  {store.followersCount} follower{store.followersCount === 1 ? "" : "s"}
                </p>
              )}

              {store.description && (
                <p className="mt-2 max-w-xl text-[13.5px] leading-6 text-muted">
                  {store.description}
                </p>
              )}

              {(isAdmin || isOwnStore) && <PrivateContacts slug={store.slug} isOwnStore={isOwnStore} />}

              {location && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-violet-600 dark:text-violet-400" />
                    {location}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {isAdmin && !isOwnStore && <VerifyStoreButton store={store} />}

            {!authUser && <GuestFollowButton />}

            {!authUser && <GuestMessageButton />}

            <ShareButton
              url={`${SITE_URL}/marketplace/seller/${store.slug}`}
              title={store.name}
              text={`Shop ${store.name} on Nestly:`}
              label="Share"
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line-strong px-4 text-[13px] font-semibold text-ink-2 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40"
            />

            {!isOwnStore && authUser && (
              <>
                <MessageSellerButton sellerId={store.seller!.user.id} />
                <FollowStoreButton slug={store.slug} />
                <ReportButton
                  targetType="STORE"
                  targetId={store.id}
                  label=""
                  className="flex h-11 items-center justify-center rounded-xl border border-line-strong px-3.5 text-subtle transition-colors hover:border-red-200 dark:hover:border-red-500/30 hover:text-red-500"
                />
              </>
            )}
          </div>
        </div>

        {!isOwnStore && <KeepPaymentsOnNestly />}
      </div>
    </section>
  );
}

// Buyers talk to sellers through in-app messages (no phone or email shown)
// and pay through Nestly checkout - say so under the store header.
function KeepPaymentsOnNestly() {
  return (
    <p className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/5 dark:text-amber-200">
      <ShieldAlert size={15} className="mt-0.5 shrink-0 text-amber-600" />
      <span>
        <span className="font-semibold">Keep it on Nestly.</span> Tap Message to chat with the seller, and only pay through Nestly checkout - money
        sent straight to a seller (bank transfer, cash, POS) isn&apos;t covered by buyer protection. If a seller asks you to pay or talk outside
        Nestly, please report them.
      </span>
    </p>
  );
}

function GuestMessageButton() {
  const requireLogin = useRequireLogin();
  return (
    <button
      onClick={() => requireLogin("Log in or create a free account to message sellers.")}
      className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line-strong px-5 text-[13px] font-semibold text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-600 dark:hover:border-violet-500/40 dark:hover:text-violet-400"
    >
      <MessageCircle size={14} />
      Message
    </button>
  );
}

function GuestFollowButton() {
  const requireLogin = useRequireLogin();
  return (
    <button
      onClick={() => requireLogin("Log in or create a free account to follow stores.")}
      className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-violet-600 px-5 text-[13px] font-semibold text-violet-700 transition-colors hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10"
    >
      Follow
    </button>
  );
}

function FollowStoreButton({ slug }: { slug: string }) {
  const { data: isFollowingReal, isLoading } = useStoreFollowStatus(slug);

  if (isLoading) {
    return <div className="h-11 w-24 animate-pulse rounded-xl bg-surface-2" />;
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
          ? "border border-line-strong text-muted hover:border-red-200 dark:hover:border-red-500/30 hover:text-red-500"
          : "border border-violet-600 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10"
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
      className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line-strong px-5 text-[13px] font-semibold text-ink-2 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-violet-400 disabled:opacity-50"
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
          ? "border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
          : "border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
      }`}
    >
      <ShieldCheck size={15} />
      {store.isVerified ? "Unverify store" : "Verify store"}
    </button>
  );
}
