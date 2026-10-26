import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Store, Users } from "lucide-react";

import NestlyMark from "@/src/components/ui/nestly-mark";
import LegalBackLink from "@/src/components/legal/legal-back-link";
import { GUIDES } from "@/src/components/guides/guide-document";
import { OG_IMAGE } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Guides",
  description: "Step-by-step guides for selling, shopping and connecting on Nestly.",
  alternates: { canonical: "/guides" },
  openGraph: { title: "Nestly guides", url: "/guides", images: [OG_IMAGE] },
};

const ICONS = { "/guides/sellers": Store, "/guides/buyers": ShoppingBag, "/guides/community": Users } as const;

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-canvas px-4 pb-24 pt-24 sm:pt-28">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <LegalBackLink />
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink">
            <NestlyMark size={26} /> Nestly
          </Link>
        </div>

        <h1 className="mt-8 font-[family-name:var(--font-fraunces)] text-[38px] italic leading-tight text-ink sm:text-[46px]">How Nestly works</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">Pick a guide - each one takes you step by step from the very start.</p>

        <div className="mt-8 grid gap-3">
          {GUIDES.map((guide) => {
            const Icon = ICONS[guide.href];
            return (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                  <Icon size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-semibold text-ink">{guide.label} guide</span>
                  <span className="block text-[13.5px] text-muted">{guide.blurb}</span>
                </span>
                <ArrowRight size={18} className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-violet-600" />
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
