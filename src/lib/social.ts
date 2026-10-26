// Links to a seller's social profiles (handles are stored without "@" or
// URL; WhatsApp as 234XXXXXXXXXX) and share links for posting a page.

export type SocialKind = "instagram" | "facebook" | "tiktok" | "whatsapp";

export const SOCIAL_LABEL: Record<SocialKind, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
};

export const socialUrl = (kind: SocialKind, value: string, message?: string) => {
  switch (kind) {
    case "instagram":
      return `https://instagram.com/${value}`;
    case "facebook":
      return `https://facebook.com/${value}`;
    case "tiktok":
      return `https://www.tiktok.com/@${value}`;
    case "whatsapp":
      return `https://wa.me/${value}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  }
};

// Posting a link somewhere (no account connection needed).
export const shareLinks = (url: string, text: string) => ({
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
});
