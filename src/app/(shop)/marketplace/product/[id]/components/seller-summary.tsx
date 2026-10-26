"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, MessageCircle, Store } from "lucide-react";

import { ProductStoreSummary } from "@/src/types/product";
import UserAvatar from "@/src/components/ui/user-avatar";
import { useCreateConversation } from "@/src/hooks/use-create-conversation";
import { useRequireLogin } from "@/src/hooks/use-session";
import { useAuthStore } from "@/src/store/auth-store";

interface Props {
  store: ProductStoreSummary;
  productId: string;
}

export default function SellerSummary({ store, productId }: Props) {
  const location = [store.city, store.state].filter(Boolean).join(", ");
  const router = useRouter();
  const requireLogin = useRequireLogin();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { mutate: createConversation, isPending } = useCreateConversation();
  const isOwnStore = !!currentUserId && currentUserId === store.sellerUserId;

  // Opens the chat with this product attached to the first message.
  const askSeller = () => {
    if (!store.sellerUserId) return;
    if (!requireLogin("Log in or create a free account to message sellers.")) return;
    createConversation(store.sellerUserId, {
      onSuccess: (response) => router.push(`/messages/${response.data.id}?product=${productId}`),
    });
  };

  return (
    <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {store.logo ? (
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={store.logo} alt={store.name} className="h-full w-full object-cover" />
            </div>
          ) : (
            <UserAvatar name={store.name} size={72} />
          )}

          <div className="space-y-1.5">
            <h3 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-ink">
              {store.name}
            </h3>

            {location && (
              <div className="flex items-center gap-1 text-[12.5px] text-muted">
                <MapPin size={13} />
                {location}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {store.sellerUserId && !isOwnStore && (
            <button
              type="button"
              onClick={askSeller}
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl border border-violet-600 px-4 py-2.5 text-[13.5px] font-semibold text-violet-700 transition-colors hover:bg-violet-50 disabled:opacity-60 dark:text-violet-300 dark:hover:bg-violet-500/10"
            >
              {isPending ? <Loader2 size={15} className="animate-spin" /> : <MessageCircle size={15} />}
              Ask about this product
            </button>
          )}
          <Link
            href={`/marketplace/seller/${store.slug}`}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
          >
            <Store size={15} />
            View store
          </Link>
        </div>
      </div>
    </section>
  );
}
