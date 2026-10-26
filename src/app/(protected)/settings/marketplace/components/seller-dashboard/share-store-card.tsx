"use client";

import { useState } from "react";
import { Check, Copy, Download, ImageIcon, Loader2, QrCode, Share2 } from "lucide-react";
import toast from "react-hot-toast";

import { useMyStore } from "@/src/hooks/use-my-store";
import { useMyProducts } from "@/src/hooks/use-my-products";
import { SITE_URL } from "@/src/lib/site";
import { shareLinks } from "@/src/lib/social";
import { downloadBlob, qrImage, storyImage } from "@/src/lib/share-image";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, XIcon } from "@/src/components/ui/social-icons";

// "Share your store": the link, one-tap posts to WhatsApp/Facebook/X, a
// story image for Instagram/WhatsApp Status, and a printable QR code.
export default function ShareStoreCard() {
  const { data: store } = useMyStore();
  const { data: productsData } = useMyProducts({ limit: 6, status: "PUBLISHED" }, { enabled: !!store });
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<"story" | "qr" | null>(null);

  if (!store) return null;

  const url = `${SITE_URL}/marketplace/seller/${store.slug}`;
  const message = `Shop ${store.name} on Nestly - order securely with Paystack and get it delivered:`;
  const links = shareLinks(url, message);
  const location = [...new Set([store.city, store.state].filter(Boolean))].join(", ");
  const productImages = (productsData?.products ?? [])
    .map((p) => p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url)
    .filter(Boolean) as string[];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy - select the link and copy it");
    }
  };

  // On a phone, share the image straight to Instagram/WhatsApp; otherwise
  // (or if sharing isn't possible) download it to post from the gallery.
  const shareOrDownload = async (blob: Blob, filename: string) => {
    const file = new File([blob], filename, { type: "image/png" });
    const onPhone = window.matchMedia("(pointer: coarse)").matches;
    if (onPhone && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: store.name, text: `${message} ${url}` });
        return;
      } catch (error) {
        // They closed the share sheet - nothing to do.
        if ((error as Error).name === "AbortError") return;
      }
    }
    downloadBlob(blob, filename);
    toast.success("Saved - post it from your gallery");
  };

  const makeStory = async () => {
    setBusy("story");
    try {
      const blob = await storyImage({ storeName: store.name, location, url, logo: store.logo, productImages });
      await shareOrDownload(blob, `${store.slug}-nestly-story.png`);
    } catch {
      toast.error("Couldn't create the image - try again");
    } finally {
      setBusy(null);
    }
  };

  const makeQr = async () => {
    setBusy("qr");
    try {
      downloadBlob(await qrImage(url, store.name), `${store.slug}-nestly-qr.png`);
    } catch {
      toast.error("Couldn't create the QR code - try again");
    } finally {
      setBusy(null);
    }
  };

  const pill = "flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-[13px] font-semibold text-ink-2 transition-colors hover:border-violet-300 dark:hover:border-violet-500/40";

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
          <Share2 size={18} />
        </div>
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic leading-tight text-ink">Share your store</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            Your followers already trust you - send them to your Nestly store. Post it on your status, stories and bio.
          </p>
        </div>
      </div>

      {/* The link */}
      <div className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-surface-sunken p-1.5 pl-3.5">
        <p className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-ink-2">{url.replace(/^https?:\/\//, "")}</p>
        <button type="button" onClick={copy} className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[12.5px] font-semibold text-white">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* One-tap posts */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={pill}>
          <WhatsAppIcon size={17} className="text-emerald-600" /> <span className="hidden sm:inline">WhatsApp</span>
        </a>
        <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={pill}>
          <FacebookIcon size={17} className="text-blue-600" /> <span className="hidden sm:inline">Facebook</span>
        </a>
        <a href={links.x} target="_blank" rel="noopener noreferrer" className={pill}>
          <XIcon size={15} className="text-ink" /> <span className="hidden sm:inline">X</span>
        </a>
      </div>

      {/* Images to post */}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <button type="button" onClick={makeStory} disabled={busy !== null} className="flex items-center gap-3 rounded-xl border border-line p-3.5 text-left transition-colors hover:border-violet-300 disabled:opacity-60 dark:hover:border-violet-500/40">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-500/10">
            {busy === "story" ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
          </span>
          <span className="min-w-0">
            <span className="block text-[13.5px] font-semibold text-ink">Story image</span>
            <span className="block text-[12px] leading-snug text-muted">For Instagram stories and WhatsApp Status - with your products and a QR code</span>
          </span>
        </button>
        <button type="button" onClick={makeQr} disabled={busy !== null} className="flex items-center gap-3 rounded-xl border border-line p-3.5 text-left transition-colors hover:border-violet-300 disabled:opacity-60 dark:hover:border-violet-500/40">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10">
            {busy === "qr" ? <Loader2 size={18} className="animate-spin" /> : <QrCode size={18} />}
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">QR code <Download size={13} className="text-subtle" /></span>
            <span className="block text-[12px] leading-snug text-muted">Print it for your shop, packaging or flyers</span>
          </span>
        </button>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-xl bg-surface-sunken px-3.5 py-3 text-[12.5px] leading-relaxed text-muted">
        <InstagramIcon size={16} className="mt-0.5 shrink-0 text-pink-600" />
        <span>
          <span className="font-semibold text-ink-2">Tip:</span> add your store link to your Instagram and TikTok bio, and pin a post about it.
        </span>
      </p>
    </section>
  );
}
