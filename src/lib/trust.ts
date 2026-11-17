import { StoreTrust, TrustLevel } from "../types/trust";

// Words for a trust record - shared by the card, the strip and the share image.

export const TRUST_LEVEL: Record<TrustLevel, { label: string; hint: string }> = {
  TRUSTED: { label: "Trusted seller", hint: "Verified business with a strong record of delivered orders" },
  ESTABLISHED: { label: "Established seller", hint: "Has delivered orders on Nestly" },
  NEW: { label: "New on Nestly", hint: "Just getting started - every order is still protected" },
};

/** "within a day", "in about 3 days", "within hours". */
export const shipTimeLabel = (hours: number | null) => {
  if (hours === null) return null;
  if (hours < 6) return "within hours";
  if (hours <= 24) return "within a day";
  const days = Math.round(hours / 24);
  return `in about ${days} day${days === 1 ? "" : "s"}`;
};

/** "Nov 2026" */
export const sinceLabel = (iso: string) => new Date(iso).toLocaleDateString("en-NG", { month: "short", year: "numeric" });

/** The headline facts, in order of how much they say. */
export const trustFacts = (trust: StoreTrust) => {
  const facts: { label: string; value: string; good?: boolean }[] = [];
  facts.push({ label: "Delivered orders", value: trust.deliveredOrders.toLocaleString("en-NG"), good: trust.deliveredOrders >= 5 });
  if (trust.completionRate !== null) facts.push({ label: "Orders completed", value: `${trust.completionRate}%`, good: trust.completionRate >= 95 });
  const ship = shipTimeLabel(trust.typicalShipHours);
  if (ship) facts.push({ label: "Usually ships", value: ship, good: (trust.typicalShipHours ?? 99) <= 48 });
  if (trust.rating !== null) facts.push({ label: `${trust.reviewCount} review${trust.reviewCount === 1 ? "" : "s"}`, value: `${trust.rating} ★`, good: trust.rating >= 4 });
  if (trust.refundRate !== null) facts.push({ label: "Refunded after a problem", value: `${trust.refundRate}%`, good: trust.refundRate <= 5 });
  facts.push({ label: "Selling since", value: sinceLabel(trust.sellingSince) });
  return facts;
};

/** One line for link previews and compact places: "Verified business · 214 delivered orders · ships within a day". */
export const trustSummary = (trust: StoreTrust) =>
  [
    trust.verifiedBusiness ? "Verified business" : null,
    trust.deliveredOrders > 0 ? `${trust.deliveredOrders.toLocaleString("en-NG")} delivered order${trust.deliveredOrders === 1 ? "" : "s"}` : "New on Nestly",
    shipTimeLabel(trust.typicalShipHours) ? `ships ${shipTimeLabel(trust.typicalShipHours)}` : null,
    trust.rating !== null ? `${trust.rating}★ (${trust.reviewCount})` : null,
  ]
    .filter(Boolean)
    .join(" · ");
