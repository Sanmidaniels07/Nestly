import { ImageResponse } from "next/og";

import { serverGet } from "@/src/lib/server-api";
import { SITE_NAME } from "@/src/lib/site";
import { TRUST_LEVEL, shipTimeLabel, sinceLabel } from "@/src/lib/trust";
import { StoreTrust } from "@/src/types/trust";

// The picture WhatsApp, Instagram DMs and X show when a seller shares
// nestlyapp.site/s/{slug}: their name and track record, at a glance.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Seller track record on Nestly";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trust = (await serverGet<StoreTrust>(`/stores/${encodeURIComponent(slug)}/trust`, 600).catch(() => null))?.data;

  const name = trust?.store.name ?? "A seller";
  const facts = trust
    ? [
        { value: trust.deliveredOrders.toLocaleString("en-NG"), label: "delivered orders" },
        trust.completionRate !== null ? { value: `${trust.completionRate}%`, label: "orders completed" } : null,
        shipTimeLabel(trust.typicalShipHours) ? { value: shipTimeLabel(trust.typicalShipHours)!, label: "usually ships" } : null,
        // The image font has no star or tick characters - plain text only.
        trust.rating !== null ? { value: `${trust.rating} / 5`, label: `${trust.reviewCount} reviews` } : null,
        { value: sinceLabel(trust.sellingSince), label: "selling since" },
      ].filter((fact): fact is { value: string; label: string } => !!fact).slice(0, 4)
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #f6f3ff 0%, #ffffff 55%, #eefbf4 100%)",
          color: "#16141f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#6d28d9" }}>{SITE_NAME}</div>
          {trust && (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                padding: "10px 22px",
                borderRadius: 999,
                background: trust.level === "TRUSTED" ? "#d1fae5" : trust.level === "ESTABLISHED" ? "#ede9fe" : "#e0f2fe",
                color: trust.level === "TRUSTED" ? "#065f46" : trust.level === "ESTABLISHED" ? "#5b21b6" : "#075985",
              }}
            >
              {TRUST_LEVEL[trust.level].label}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1 }}>{name}</div>
          {trust?.verifiedBusiness && (
            <div style={{ display: "flex", marginTop: 14, fontSize: 30, color: "#5b21b6", fontWeight: 600 }}>Registered business (CAC checked)</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 22 }}>
          {facts.map((fact) => (
            <div
              key={fact.label}
              style={{ display: "flex", flexDirection: "column", padding: "20px 26px", borderRadius: 22, background: "rgba(255,255,255,0.9)", border: "2px solid #e6e1f3" }}
            >
              <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>{fact.value}</div>
              <div style={{ display: "flex", fontSize: 22, color: "#6a6680", marginTop: 4 }}>{fact.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#047857", fontWeight: 600 }}>
          Pay through Nestly - your money is held until you receive your order.
        </div>
      </div>
    ),
    size
  );
}
