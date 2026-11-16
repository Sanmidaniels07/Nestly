import { SUPPORT_WHATSAPP } from "./support";

// Shared facts for the legal pages. The registered company behind Nestly
// (CAC certificate of incorporation, 11 November 2026).
export const LEGAL_COMPANY_NAME = "Nestlyapp Limited";
export const LEGAL_RC_NUMBER = "10001733";
export const LEGAL_ENTITY = `${LEGAL_COMPANY_NAME} (RC ${LEGAL_RC_NUMBER})`;
/** ", operated by X" - used in the opening line of each legal document. */
export const OPERATED_BY = `, operated by ${LEGAL_ENTITY}`;
export const LEGAL_LAST_UPDATED = "13 November 2026";
export const LEGAL_EMAIL = "hello@nestlyapp.site";
export const LEGAL_WHATSAPP_DISPLAY = `+${SUPPORT_WHATSAPP.slice(0, 3)} ${SUPPORT_WHATSAPP.slice(3, 6)} ${SUPPORT_WHATSAPP.slice(6, 9)} ${SUPPORT_WHATSAPP.slice(9)}`;
export const LEGAL_WHATSAPP_URL = `https://wa.me/${SUPPORT_WHATSAPP}`;

// Mirrors the backend so the documents say what the app actually does.
// Nestly's returns policy (from RETURN_POLICY_EFFECTIVE): report a problem
// within 3 days of delivery being confirmed, 24 hours for perishables.
export const RETURN_WINDOW_DAYS = 3;
export const PERISHABLE_REPORT_HOURS = 24;
export const PREVIOUS_RETURN_WINDOW_DAYS = 7;
export const RETURN_POLICY_EFFECTIVE = "10 November 2026";
export const AUTO_CONFIRM_DAYS = 5;
export const PAYOUT_HOLD_HOURS = 48;
export const MIN_AGE = 13;
