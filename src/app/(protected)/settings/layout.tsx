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
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}