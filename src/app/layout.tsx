import Navbar from "../components/ui/navbar";
import "./globals.css";
import Providers from "./providers";
import { fraunces, jetbrainsMono } from "@/src/lib/fonts";
import AppToaster from "../components/ui/toaster";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning   className={`${fraunces.variable} ${jetbrainsMono.variable}`}
>
      <body>
        <Providers>
          <Navbar/>
          {children}
        </Providers>
        <AppToaster />
      </body>
    </html>
  );
}