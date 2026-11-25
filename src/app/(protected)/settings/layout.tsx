import { ReactNode } from "react";

import SettingsFrame from "./components/settings-frame";

interface Props {
  children: ReactNode;
}

export default function SettingsLayout({ children }: Props) {
  return <SettingsFrame>{children}</SettingsFrame>;
}
