import type { Metadata } from "next";
import { Suspense } from "react";

import ChipInPage from "./chip-in-page";

interface Props {
  params: Promise<{ code: string }>;
}

// A group gift's page - shared among friends, never indexed.
export const metadata: Metadata = {
  title: "Chip in on a gift",
  description: "Friends are chipping in for a gift on Nestly. Add your part - you're refunded if it doesn't come together.",
  robots: { index: false, follow: false },
};

export default async function Page({ params }: Props) {
  const { code } = await params;
  return (
    <Suspense>
      <ChipInPage code={code} />
    </Suspense>
  );
}
