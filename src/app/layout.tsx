import Navbar from "../components/ui/navbar";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar/>
          {children}
        </Providers>
         <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}