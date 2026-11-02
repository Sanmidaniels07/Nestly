// Google Maps for delivery addresses: the buyer drops a pin (Uber-style)
// and we turn it into the address form's fields. The key is public by
// design - restrict it in Google Cloud to nestlyapp.site and to the Maps
// JavaScript, Places (New) and Geocoding APIs. Without a key the map is
// hidden and addresses are typed by hand, as before.

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || null;
export const mapsConfigured = Boolean(GOOGLE_MAPS_API_KEY);

// Lagos - where the map opens when we can't get the buyer's location.
export const DEFAULT_CENTER = { lat: 6.5244, lng: 3.3792 };

// Same box the API accepts for a pin.
export const inNigeria = ({ lat, lng }: { lat: number; lng: number }) => lat >= 4 && lat <= 14 && lng >= 2.5 && lng <= 15;

/** Opens the exact spot in Google Maps (sellers delivering an order). */
export const mapsLink = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory",
];
const STATE_ALIASES: Record<string, string> = {
  fct: "Federal Capital Territory",
  abuja: "Federal Capital Territory",
  "abuja federal capital territory": "Federal Capital Territory",
  "federal capital territory abuja": "Federal Capital Territory",
  nassarawa: "Nasarawa",
  "akwa-ibom": "Akwa Ibom",
};

/** "Lagos State", "FCT", "Abuja" -> one of Nestly's state names, else the input. */
export const nigerianState = (name: string) => {
  const cleaned = name.toLowerCase().replace(/,?\s*nigeria$/, "").replace(/\s+state$/, "").replace(/\s+/g, " ").trim();
  const alias = STATE_ALIASES[cleaned];
  if (alias) return alias;
  return STATES.find((state) => state.toLowerCase() === cleaned) ?? name.trim();
};

export interface AddressComponent {
  longText: string | null;
  types: string[];
}

export interface PickedAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  /** False when the pin is outside Nigeria. */
  inNigeria: boolean;
}

/**
 * Builds the form's fields from a geocoder / place result. Several results
 * can be passed (best first): a field missing from the first is taken from
 * the next, e.g. the neighbourhood.
 */
export const toPickedAddress = (
  results: { components: AddressComponent[]; formattedAddress?: string | null }[],
  location: { lat: number; lng: number }
): PickedAddress => {
  const find = (...types: string[]) => {
    for (const result of results) {
      for (const type of types) {
        const hit = result.components.find((component) => component.types.includes(type) && component.longText);
        if (hit?.longText) return hit.longText;
      }
    }
    return "";
  };
  const first = results[0];
  const country = find("country");
  const state = nigerianState(find("administrative_area_level_1"));
  const area = find("neighborhood", "sublocality_level_1", "sublocality", "sublocality_level_2");
  const city = find("locality", "postal_town", "administrative_area_level_2") || area || state;

  const streetNumber = first?.components.find((c) => c.types.includes("street_number"))?.longText ?? "";
  const route = first?.components.find((c) => c.types.includes("route"))?.longText ?? "";
  const placeName = first?.components.find((c) => c.types.includes("premise") || c.types.includes("establishment") || c.types.includes("point_of_interest"))?.longText ?? "";
  const street = [streetNumber, route].filter(Boolean).join(" ");
  // No street from the geocoder: the first part of the formatted address
  // (often a building or estate name) - unless it's just a plus code.
  const firstPart = (first?.formattedAddress ?? "").split(",")[0].trim();
  const fallback = /^[23456789CFGHJMPQRVWX]{4,}\+[23456789CFGHJMPQRVWX]{2,}/i.test(firstPart) ? "" : firstPart;

  const parts: string[] = [];
  for (const part of [placeName, street || fallback, area]) {
    const clean = part.trim();
    const lower = clean.toLowerCase();
    if (!clean || parts.some((p) => p.toLowerCase() === lower)) continue;
    if (lower === city.toLowerCase() || lower === state.toLowerCase()) continue;
    parts.push(clean);
  }

  return {
    address: parts.join(", "),
    city,
    state,
    country: country === "Nigeria" || !country ? "Nigeria" : country,
    postalCode: find("postal_code"),
    latitude: Number(location.lat.toFixed(6)),
    longitude: Number(location.lng.toFixed(6)),
    inNigeria: (country ? country === "Nigeria" : true) && inNigeria(location),
  };
};
