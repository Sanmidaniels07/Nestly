import Link from "next/link";

import NestlyMark from "@/src/components/ui/nestly-mark";
import CookieSettingsLink from "@/src/components/consent/cookie-settings-link";
import { supportWhatsAppUrl } from "@/src/lib/support";

// The public site footer - homepage, features and preview pages.
export default function SiteFooter() {
  return (
    <footer className="bg-[#1A1A2E] text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <NestlyMark size={44} />
          <div className="font-bold text-3xl">Nestly</div>
        </div>
        <p className="text-white/60 max-w-md mx-auto">
          Connect, Celebrate, Commerce — All in one place.
        </p>{" "}
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
          <Link href="/guides/sellers" className="hover:text-white">Seller guide</Link>
          <Link href="/guides/buyers" className="hover:text-white">Buyer guide</Link>
          <Link href="/guides/community" className="hover:text-white">Getting started</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/seller-terms" className="hover:text-white">Seller Agreement</Link>
          <CookieSettingsLink className="hover:text-white" />
          <a href={supportWhatsAppUrl("Hi Nestly Support, ")} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Support
          </a>
          <a href="https://www.instagram.com/thenestlyapp" target="_blank" rel="me noopener noreferrer" className="hover:text-white">
            Instagram
          </a>
        </nav>
        <div className="mt-8 text-xs text-white/40">
          © 2026 Nestly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
