import Navbar from "../components/ui/navbar";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { fraunces, jetbrainsMono } from "@/src/lib/fonts";


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
         <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              border: "1px solid #ECE9F6",
              color: "#13131A",
            },
            success: {
              iconTheme: { primary: "#7C3AED", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}