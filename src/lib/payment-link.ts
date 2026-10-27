import { SITE_URL } from "./site";

// nestlyapp.site/pay/{code}, tagged with the store's referral code so
// buyers who sign up through it count for that store.
export const paymentLinkUrl = (code: string, referralCode?: string) =>
  `${SITE_URL}/pay/${code}${referralCode ? `?ref=${referralCode}` : ""}`;

export const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
