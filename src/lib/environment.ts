// "staging" on the staging deployment (set in Vercel for the staging
// branch); unset in production. Baked in at build time.
export const isStaging = process.env.NEXT_PUBLIC_APP_ENV === "staging";
