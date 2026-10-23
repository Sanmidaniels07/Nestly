// State names in URLs and headings for the public category pages
// ("/marketplace/categories/cakes-pastries/lagos" -> "Cakes & Pastries in Lagos").

const FCT = "Federal Capital Territory";

// What people call it - "Abuja" rather than "Federal Capital Territory".
export const stateLabel = (state: string) => (state === FCT ? "Abuja" : state);

export const stateSlug = (state: string) =>
  stateLabel(state)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// The state a URL slug refers to, from the states that have listings.
export const stateFromSlug = (slug: string, states: string[]) =>
  states.find((state) => stateSlug(state) === slug.toLowerCase()) ?? null;
