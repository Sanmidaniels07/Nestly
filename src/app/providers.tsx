"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../lib/query-client";
import { ThemeProvider } from "../providers/theme-provider";



interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({
  children,
}: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}

        <ReactQueryDevtools
          initialIsOpen={false}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}