import type { Metadata } from "next";

import TrackOrderPage from "./track-order-page";

interface Props {
  params: Promise<{ token: string }>;
}

// A guest's private order page - the link is the only key, so it's never
// indexed and never shared further by the page itself.
export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function Page({ params }: Props) {
  const { token } = await params;
  return <TrackOrderPage token={token} />;
}
