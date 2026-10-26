"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import toast from "react-hot-toast";

import { shareLinks } from "@/src/lib/social";
import { FacebookIcon, WhatsAppIcon, XIcon } from "./social-icons";

interface Props {
  url: string;
  title: string;
  text: string;
  className?: string;
  label?: string;
}

// Share a page: the phone's own share sheet where there is one (WhatsApp,
// Instagram, anything installed), otherwise WhatsApp / Facebook / X / copy.
export default function ShareButton({ url, title, text, className, label }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Cancelled - nothing to do.
        return;
      }
    }
    setOpen((v) => !v);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy - long-press the address bar instead");
    }
  };

  const links = shareLinks(url, text);
  const item = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-ink-2 hover:bg-surface-2";

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={share} aria-label={label || "Share"} aria-expanded={open} className={className}>
        <Share2 size={17} className="text-muted" />
        {label && <span>{label}</span>}
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-line bg-surface p-1.5 shadow-lg">
          <a role="menuitem" href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
            <WhatsAppIcon size={16} className="text-emerald-600" /> WhatsApp
          </a>
          <a role="menuitem" href={links.facebook} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
            <FacebookIcon size={16} className="text-blue-600" /> Facebook
          </a>
          <a role="menuitem" href={links.x} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
            <XIcon size={15} className="text-ink" /> X (Twitter)
          </a>
          <button role="menuitem" type="button" onClick={copy} className={item}>
            {copied ? <Check size={16} className="text-emerald-600" /> : <Link2 size={16} className="text-muted" />} Copy link
          </button>
        </div>
      )}
    </div>
  );
}
