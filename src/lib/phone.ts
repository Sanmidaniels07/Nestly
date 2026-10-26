/** A phone number as typed: digits with optional +, spaces, dashes or brackets. Mirrors the backend's deliveryPhone check. */
export const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;
