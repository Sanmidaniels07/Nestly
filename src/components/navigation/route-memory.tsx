"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { rememberPath } from "@/src/lib/return-path";

// Records each page visited (see lib/return-path). Renders nothing.
export default function RouteMemory() {
  const pathname = usePathname();

  useEffect(() => {
    rememberPath(`${pathname}${window.location.search}`);
  }, [pathname]);

  return null;
}
