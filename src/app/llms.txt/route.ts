import { areaSlug, stateLabel, stateSlug } from "@/src/lib/locations";
import { RETURN_WINDOW_DAYS } from "@/src/lib/legal";
import { serverGet } from "@/src/lib/server-api";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/src/lib/site";
import { AreaIndex } from "@/src/types/areas";
import { Catalogue } from "@/src/types/catalogue";

// /llms.txt (llmstxt.org): a plain summary of Nestly and links to its
// public pages, for AI assistants (ChatGPT, Claude, Perplexity, Google AI)
// that answer questions like "where can I buy cakes in Lekki?". Built from
// the same live data as the sitemap.

export const revalidate = 3600;

const link = (title: string, path: string, note?: string) => `- [${title}](${SITE_URL}${path})${note ? `: ${note}` : ""}`;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export async function GET() {
  const [catalogue, areas] = await Promise.all([
    serverGet<Catalogue>("/seo/catalogue", revalidate).then((r) => r?.data).catch(() => undefined),
    serverGet<AreaIndex>("/seo/areas", revalidate).then((r) => r?.data).catch(() => undefined),
  ]);

  const categories = (catalogue?.categories ?? []).filter((c) => c.productCount > 0).sort((a, b) => b.productCount - a.productCount);

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${SITE_NAME} (${SITE_URL}) is a Nigerian social marketplace. Independent local sellers - many of whom also sell on Instagram and WhatsApp - list products in a store on ${SITE_NAME}, and buyers order and pay online.`,
    "",
    "Key facts:",
    "- Payments go through Paystack (card, bank transfer, USSD). The buyer's money is held until delivery is confirmed, and card details never reach the seller.",
    "- Every order has a delivery code; buyers give it to the seller only when the order is in their hands.",
    `- Buyers can ask for a return or refund within ${RETURN_WINDOW_DAYS} days of delivery from their order page.`,
    "- Each seller sets their own delivery areas and fees, or offers pickup. Store pages show where the seller is based, their delivery zones and reviews from buyers.",
    "- Sellers can also share protected payment links for orders agreed in chat.",
    "",
    "## Shop by category",
    "",
    ...(categories.length
      ? categories.map((c) =>
          link(
            c.name,
            `/marketplace/categories/${c.slug}`,
            `${plural(c.productCount, "listing")}${c.states.length ? `; sold in ${c.states.slice(0, 6).map((s) => stateLabel(s.name)).join(", ")}` : ""}`
          )
        )
      : [link("All categories", "/marketplace/categories")]),
    "",
    "## Shop by area",
    "",
    "Sellers based in or delivering to each area:",
    "",
    ...(areas?.states ?? []).flatMap((state) =>
      state.areas.map((area) =>
        link(`${area.name}, ${stateLabel(state.name)}`, `/marketplace/locations/${stateSlug(state.name)}/${areaSlug(area.name)}`, `${plural(area.storeCount, "seller")}, ${plural(area.productCount, "listing")}`)
      )
    ),
    link("All areas", "/marketplace/locations"),
    "",
    "## Guides",
    "",
    link("How to buy on Nestly", "/guides/buyers"),
    link("How to sell on Nestly", "/guides/sellers"),
    link("Getting started", "/guides/community"),
    link("Features", "/features"),
    "",
    "## Policies",
    "",
    link("Terms of Service", "/terms"),
    link("Privacy Policy", "/privacy"),
    link("Seller Agreement", "/seller-terms"),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
