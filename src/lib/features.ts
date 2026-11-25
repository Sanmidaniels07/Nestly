// Product features that can be switched off while Nestly stays focused on
// shopping. Off = hidden everywhere in the app (nav, dashboard, feed,
// search, guides) and its pages send people to the marketplace. The data
// and the API stay as they are, so turning one back on is just `true` here.
export const featureOn = {
  communities: false,
  events: false,
} as const;

export type Feature = keyof typeof featureOn;
