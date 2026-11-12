"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../lib/query-client";
import { ThemeProvider } from "../providers/theme-provider";
import AuthInitializer from "../components/auth/auth-initializer";
import RouteMemory from "../components/navigation/route-memory";
import PushSync from "../components/push/push-sync";
import InstallPrompt from "../components/pwa/install-prompt";
import { LiveDockProvider } from "../components/live/live-dock-context";
import LiveDock from "../components/live/live-dock";



interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({
  children,
}: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LiveDockProvider>
          <AuthInitializer />
          <RouteMemory />
          <PushSync />
          <InstallPrompt />
          {children}
          {/* A live keeps running here while the person uses the rest of the app. */}
          <LiveDock />
        </LiveDockProvider>

        <ReactQueryDevtools
          initialIsOpen={false}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}