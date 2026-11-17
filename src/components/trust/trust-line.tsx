"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { useStoreTrust } from "@/src/hooks/use-store-trust";
import { useSession } from "@/src/hooks/use-session";
import { TRUST_LEVEL, trustSummary } from "@/src/lib/trust";

// One line of a seller's track record, for tight spots (the pay page's
// seller box). Links to the full record. Drawn only once the page has
// loaded in the browser - it's extra, and this keeps the server-rendered
// page and the first browser render identical.
export default function TrustLine({ slug }: { slug: string }) {
  const { isHydrated } = useSession();
  const { data: trust } = useStoreTrust(slug);
  if (!isHydrated || !trust) return null;

  return (
    <div className="w-full">
      <Link
        href={`/s/${trust.store.slug}`}
        className="mt-2 flex items-start gap-1.5 text-[12px] leading-snug text-ink-2 hover:text-violet-700 dark:hover:text-violet-300"
      >
        <ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>
          <span className="font-semibold">{TRUST_LEVEL[trust.level].label}</span> · {trustSummary(trust)}
        </span>
      </Link>
    </div>
  );
}
