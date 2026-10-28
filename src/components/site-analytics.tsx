"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

// Pages whose address carries a one-time secret - only the page type is
// counted, never the token. Emails in the address (?email= on "check your
// inbox") are dropped too.
const SECRET_PATHS = ["/reset-password/", "/verify-email/"];

const redact = (event: BeforeSendEvent): BeforeSendEvent => {
  const url = new URL(event.url);
  const secret = SECRET_PATHS.find((path) => url.pathname.startsWith(path) && url.pathname !== `${path}sent`);
  if (secret) url.pathname = `${secret}[token]`;
  url.searchParams.delete("email");
  return { ...event, url: url.toString() };
};

// Vercel Web Analytics: page views and where visitors came from (Google,
// WhatsApp, Instagram, ?ref= links). Cookieless and anonymous; the numbers
// are only visible in the Vercel dashboard. Off until Analytics is enabled
// for the project in Vercel.
export default function SiteAnalytics() {
  return <Analytics beforeSend={redact} />;
}
