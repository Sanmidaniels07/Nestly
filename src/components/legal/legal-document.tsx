import Link from "next/link";

import NestlyMark from "@/src/components/ui/nestly-mark";
import { LEGAL_LAST_UPDATED } from "@/src/lib/legal";

export interface LegalSection {
  id: string;
  heading: string;
  body: React.ReactNode;
}

interface Props {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}

const OTHER_DOCS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/seller-terms", label: "Seller Agreement" },
];

// Shared layout for the public legal pages: readable column, table of
// contents, anchors for linking to a section (e.g. /terms#refunds).
export default function LegalDocument({ eyebrow, title, intro, sections }: Props) {
  return (
    <main className="min-h-screen bg-canvas px-4 pb-24 pt-24 sm:pt-28">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink">
          <NestlyMark size={26} /> Nestly
        </Link>

        <p className="mt-8 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.25em] text-violet-600 dark:text-violet-400">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[38px] italic leading-tight text-ink sm:text-[46px]">
          {title}
        </h1>
        <p className="mt-2 text-[13px] text-subtle">Last updated {LEGAL_LAST_UPDATED}</p>

        <div className="mt-6 space-y-3 text-[15px] leading-relaxed text-ink-2">{intro}</div>

        <nav aria-label="Contents" className="mt-8 rounded-2xl border border-line bg-surface p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-subtle">Contents</p>
          <ol className="mt-3 grid gap-1.5 text-[13.5px] sm:grid-cols-2">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-violet-700 hover:underline dark:text-violet-300">
                  {i + 1}. {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-10">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-[19px] font-bold text-ink">
                {i + 1}. {section.heading}
              </h2>
              <div className="legal-body mt-3 space-y-3 text-[14.5px] leading-relaxed text-ink-2">{section.body}</div>
            </section>
          ))}
        </div>

        <footer className="mt-14 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6 text-[13px]">
          {OTHER_DOCS.map((doc) => (
            <Link key={doc.href} href={doc.href} className="text-muted hover:text-violet-600 dark:hover:text-violet-400">
              {doc.label}
            </Link>
          ))}
        </footer>
      </article>
    </main>
  );
}
