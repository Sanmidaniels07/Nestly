import { ReactNode } from "react";
import SettingsHeader from "./components/settings-header";
import SettingsSidebar from "./components/settings-sidebar";

interface Props {
  children: ReactNode;
}

export default function SettingsLayout({ children }: Props) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <SettingsHeader />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-start">
        <SettingsSidebar />
        {/* Safety net: if any tab's content (a table, a wide grid, a form
            row) ends up wider than the viewport, it scrolls within this
            container instead of forcing the whole page — navbar and sidebar
            included — to scroll horizontally on mobile. min-w-0 is required
            alongside it: without it, a grid/flex child won't shrink below
            its content's intrinsic width, so overflow-x-auto would never
            actually engage. */}
        <div className="min-w-0 overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}