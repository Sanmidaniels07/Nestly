"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import SettingsHeader from "./settings-header";
import SettingsSidebar from "./settings-sidebar";

// Seller Hub lives under /settings/marketplace but is its own workspace:
// it gets the full width, without the "Account settings" heading and the
// Profile / Account / Security tabs above it.
export default function SettingsFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/settings/marketplace")) {
    return <div className="mx-auto min-w-0 max-w-6xl py-3 sm:px-2 sm:py-6 lg:px-4">{children}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <SettingsHeader />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-start">
        <SettingsSidebar />
        {/* Safety net: if any tab's content (a table, a wide grid, a form
            row) ends up wider than the viewport, it scrolls within this
            container instead of forcing the whole page - navbar and sidebar
            included - to scroll horizontally on mobile. min-w-0 is required
            alongside it: without it, a grid/flex child won't shrink below
            its content's intrinsic width, so overflow-x-auto would never
            actually engage. */}
        <div className="min-w-0 overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}
