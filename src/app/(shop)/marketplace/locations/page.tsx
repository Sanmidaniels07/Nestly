import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { stateLabel } from "@/src/lib/locations";
import { OG_IMAGE, SITE_NAME } from "@/src/lib/site";
import { areaPath, loadAreaIndex } from "./area-parts";

const title = "Shop by area";
const description = `Find ${SITE_NAME} sellers based in or delivering to your area - Lekki, Ikeja, Festac, Wuse and more - with secure Paystack checkout and local delivery.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/marketplace/locations" },
  openGraph: { title: `${title} · ${SITE_NAME}`, description, url: "/marketplace/locations", type: "website", images: [OG_IMAGE] },
};

// Public hub linking every area page, grouped by state.
export default async function LocationsPage() {
  const index = await loadAreaIndex();
  const states = index?.states ?? [];

  return (
    <div className="mx-auto max-w-[1600px] space-y-10 px-1 py-6 sm:px-3 lg:px-4">
      <header>
        <p className="font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">Marketplace</p>
        <h1 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-[36px] italic text-ink sm:text-[42px]">Shop by area</h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-muted">{description}</p>
      </header>

      {states.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface py-16 text-center text-[13.5px] text-subtle">
          Areas are loading slowly - please refresh in a moment.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {states.map((state) => (
            <section key={state.name} id={stateLabel(state.name)} className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5">
              <h2 className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
                <MapPin size={15} className="text-violet-600 dark:text-violet-400" />
                {stateLabel(state.name)}
                <span className="font-[family-name:var(--font-mono)] text-[12px] font-normal text-subtle">{state.areas.length} areas</span>
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {state.areas.map((area) => (
                  <Link
                    key={area.name}
                    href={areaPath(state.name, area.name)}
                    className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink-2 transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
                  >
                    {area.name}{" "}
                    <span className="font-[family-name:var(--font-mono)] text-[11.5px] text-subtle">
                      {area.storeCount} {area.storeCount === 1 ? "seller" : "sellers"}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
