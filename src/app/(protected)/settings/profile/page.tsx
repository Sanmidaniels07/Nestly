"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/src/hooks/use-profile";
import EditProfileForm from "@/src/app/(protected)/profile/components/edit-profile-form";
import Skeleton from "@/src/components/ui/skeleton";
import ShippingAddress from "@/src/app/(protected)/marketplace/checkout/components/shipping-address";

export default function SettingsProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const loaded = !!profile;

  // /settings/profile#addresses (dashboard checklist) - the section only
  // exists once the profile has loaded, so scroll to it then.
  useEffect(() => {
    if (loaded && window.location.hash === "#addresses") {
      document.getElementById("addresses")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loaded]);

  if (isLoading || !profile) {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <Skeleton className="h-52 w-full rounded-none sm:h-64" />
        <div className="-mt-14 px-6 sm:-mt-16 sm:pl-8">
          <Skeleton className="h-28 w-28 rounded-full ring-4 ring-white sm:h-32 sm:w-32" />
        </div>
        <div className="space-y-5 px-6 pb-8 pt-6 sm:px-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic text-ink">
          Profile
        </h2>
        <p className="mt-1 text-[13.5px] text-muted">
          This is what other people see when they visit your profile.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <EditProfileForm variant="page" onClose={() => router.push("/profile")} />
      </div>

      {/* Linked from the dashboard's "Save a delivery address" step. */}
      <div id="addresses" className="scroll-mt-24">
        <ShippingAddress mode="manage" />
      </div>
    </div>
  );
}
