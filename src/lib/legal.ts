import { SUPPORT_WHATSAPP } from "./support";

// Shared facts for the legal pages. Update LEGAL_ENTITY once the CAC
// registration is complete (e.g. "Nestlyapp Limited (RC 1234567)").
export const LEGAL_ENTITY = "Nestly";
/** ", operated by X" once a registered company name is set; empty until then. */
export const OPERATED_BY = LEGAL_ENTITY === "Nestly" ? "" : `, operated by ${LEGAL_ENTITY}`;
export const LEGAL_LAST_UPDATED = "28 October 2026";
export const LEGAL_EMAIL = "hello@nestlyapp.site";
export const LEGAL_WHATSAPP_DISPLAY = `+${SUPPORT_WHATSAPP.slice(0, 3)} ${SUPPORT_WHATSAPP.slice(3, 6)} ${SUPPORT_WHATSAPP.slice(6, 9)} ${SUPPORT_WHATSAPP.slice(9)}`;
export const LEGAL_WHATSAPP_URL = `https://wa.me/${SUPPORT_WHATSAPP}`;

// Mirrors the backend so the documents say what the app actually does.
export const RETURN_WINDOW_DAYS = 7;
export const AUTO_CONFIRM_DAYS = 5;
export const PAYOUT_HOLD_HOURS = 48;
export const MIN_AGE = 13;
