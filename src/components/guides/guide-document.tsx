import Link from "next/link";
import { ArrowDown, ArrowRight, Lightbulb, MapPin, MessageCircle, ShieldAlert } from "lucide-react";

import NestlyMark from "@/src/components/ui/nestly-mark";
import LegalBackLink from "@/src/components/legal/legal-back-link";
import { supportWhatsAppUrl } from "@/src/lib/support";

export interface GuideStep {
  id: string;
  title: string;
  /** Where in the app this happens, e.g. "Seller Hub → Store". */
  where?: { label: string; href?: string };
  body: React.ReactNode;
  tip?: React.ReactNode;
  warning?: React.ReactNode;
}

export interface GuidePart {
  heading: string;
  steps: GuideStep[];
}

export const GUIDES = [
  { href: "/guides/sellers", label: "Sellers", blurb: "Open a store and get paid" },
  { href: "/guides/buyers", label: "Buyers", blurb: "Shop safely and track orders" },
  { href: "/guides/community", label: "Community", blurb: "Connect, post and celebrate" },
] as const;

interface Props {
  current: (typeof GUIDES)[number]["href"];
  title: string;
  intro: React.ReactNode;
  parts: GuidePart[];
  /** Big button at the end, e.g. "Apply to sell". */
  finish: { label: string; href: string };
}

// Step-by-step help guides (/guides/*): numbered steps that run on from
// one to the next, grouped into parts, with "where in the app" chips.
export default function GuideDocument({ current, title, intro, parts, finish }: Props) {
  const total = parts.reduce((sum, part) => sum + part.steps.length, 0);
  // Steps are numbered straight through all parts.
  const firstNumber = parts.map((_, i) => parts.slice(0, i).reduce((sum, part) => sum + part.steps.length, 1));

  return (
    <main className="min-h-screen bg-canvas px-4 pb-24 pt-24 sm:pt-28">
      <article className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <LegalBackLink />
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink">
            <NestlyMark size={26} /> Nestly
          </Link>
        </div>

        <p className="mt-8 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.25em] text-violet-600 dark:text-violet-400">
          Nestly guide · {total} steps
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[36px] italic leading-tight text-ink sm:text-[46px]">{title}</h1>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-2">{intro}</div>

        {/* Switch guide */}
        <nav aria-label="Guides" className="mt-7 grid gap-2 sm:grid-cols-3">
          {GUIDES.map((guide) => {
            const active = guide.href === current;
            return (
              <Link
                key={guide.href}
                href={guide.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-xl border px-4 py-3 transition-colors ${
                  active
                    ? "border-violet-500 bg-violet-50 dark:border-violet-400/60 dark:bg-violet-500/10"
                    : "border-line bg-surface hover:border-violet-300 dark:hover:border-violet-500/40"
                }`}
              >
                <span className={`block text-[14px] font-semibold ${active ? "text-violet-700 dark:text-violet-300" : "text-ink"}`}>{guide.label}</span>
                <span className="block text-[12px] text-muted">{guide.blurb}</span>
              </Link>
            );
          })}
        </nav>

        {/* Contents */}
        <nav aria-label="Contents" className="mt-6 rounded-2xl border border-line bg-surface p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-subtle">Contents</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {parts.map((part, partIndex) => (
              <div key={part.heading}>
                <p className="text-[12.5px] font-semibold text-ink">{part.heading}</p>
                <ol className="mt-1.5 space-y-1 text-[13px]">
                  {part.steps.map((step, i) => (
                    <li key={step.id}>
                      <a href={`#${step.id}`} className="text-violet-700 hover:underline dark:text-violet-300">
                        {firstNumber[partIndex] + i}. {step.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </nav>

        <div className="mt-10 space-y-12">
          {parts.map((part, partIndex) => (
            <section key={part.heading}>
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-subtle">Part {partIndex + 1}</p>
              <h2 className="mt-1 font-[family-name:var(--font-fraunces)] text-[26px] italic text-ink">{part.heading}</h2>

              <ol className="mt-5">
                {part.steps.map((step, i) => {
                  const number = firstNumber[partIndex] + i;
                  const last = partIndex === parts.length - 1 && i === part.steps.length - 1;
                  return (
                    <li key={step.id} id={step.id} className="scroll-mt-24">
                      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                        <div className="flex items-start gap-3.5">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-[14px] font-bold text-white">
                            {number}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="pt-1 text-[17px] font-bold leading-snug text-ink">{step.title}</h3>
                            {step.where && (
                              <p className="mt-2">
                                {step.where.href ? (
                                  <Link
                                    href={step.where.href}
                                    className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[12px] font-medium text-violet-700 hover:underline dark:bg-violet-500/10 dark:text-violet-300"
                                  >
                                    <MapPin size={12} className="shrink-0" /> <span className="min-w-0">{step.where.label}</span>
                                  </Link>
                                ) : (
                                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1 text-[12px] font-medium text-ink-2">
                                    <MapPin size={12} className="shrink-0" /> <span className="min-w-0">{step.where.label}</span>
                                  </span>
                                )}
                              </p>
                            )}
                            <div className="guide-body mt-3 space-y-2.5 text-[14.5px] leading-relaxed text-ink-2">{step.body}</div>
                            {step.tip && (
                              <p className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50/80 px-3.5 py-2.5 text-[13px] leading-relaxed text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200">
                                <Lightbulb size={15} className="mt-0.5 shrink-0" />
                                <span>{step.tip}</span>
                              </p>
                            )}
                            {step.warning && (
                              <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50/80 px-3.5 py-2.5 text-[13px] leading-relaxed text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                                <ShieldAlert size={15} className="mt-0.5 shrink-0" />
                                <span>{step.warning}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {!last && (
                        <div aria-hidden className="flex justify-center py-2 text-violet-400 dark:text-violet-500">
                          <ArrowDown size={20} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[16px] font-semibold text-ink">Ready?</p>
            <p className="mt-0.5 text-[13px] text-muted">
              Stuck on a step?{" "}
              <a
                href={supportWhatsAppUrl("Hi Nestly Support, I need help with ")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-violet-700 hover:underline dark:text-violet-300"
              >
                <MessageCircle size={13} /> Chat with Nestly Support
              </a>
            </p>
          </div>
          <Link
            href={finish.href}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[14px] font-semibold text-white hover:brightness-110"
          >
            {finish.label} <ArrowRight size={16} />
          </Link>
        </div>

        <footer className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6 text-[13px]">
          {[
            { href: "/guides", label: "All guides" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/seller-terms", label: "Seller Agreement" },
          ].map((doc) => (
            <Link key={doc.href} href={doc.href} className="text-muted hover:text-violet-600 dark:hover:text-violet-400">
              {doc.label}
            </Link>
          ))}
        </footer>
      </article>
    </main>
  );
}
