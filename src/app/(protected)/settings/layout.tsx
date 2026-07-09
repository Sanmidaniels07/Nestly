import { ReactNode } from "react";
import SettingsHeader from "./components/settings-header";

interface Props {
  children: ReactNode;
}

export default function SettingsLayout({ children }: Props) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <SettingsHeader />
      {children}
    </div>
  );
}