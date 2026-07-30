"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TimerOff } from "lucide-react";

import Button from "@/src/components/ui/button";

function SessionExpiredContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const handleLogin = () => {
    router.push(
      returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"
    );
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[#ECE9F6] bg-white px-8 py-12 text-center shadow-sm sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
        <TimerOff size={26} className="text-violet-600" />
      </div>

      <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-[26px] italic text-[#13131A]">
        Session expired
      </h1>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#64748B]">
        You&apos;ve been signed out for your security. Log in again to pick up right
        where you left off.
      </p>

      <Button variant="tribely" className="mx-auto mt-7 w-fit" onClick={handleLogin}>
        Log in again
      </Button>
    </div>
  );
}

export default function SessionExpiredPage() {
  return (
    <Suspense fallback={null}>
      <SessionExpiredContent />
    </Suspense>
  );
}
