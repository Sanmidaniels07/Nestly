// Nestly Support runs on the WhatsApp Business app for now. The number can
// be overridden per environment with NEXT_PUBLIC_SUPPORT_WHATSAPP
// (international format, digits only - e.g. 2348159671809).
export const SUPPORT_WHATSAPP = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "2348159671809";

/** Opens a WhatsApp chat with Nestly Support, optionally with a pre-filled message. */
export const supportWhatsAppUrl = (message?: string) =>
  `https://wa.me/${SUPPORT_WHATSAPP}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/** Short order reference shown across the app, e.g. #PTTKF066. */
export const orderReference = (orderId: string) => `#${orderId.slice(-8).toUpperCase()}`;
