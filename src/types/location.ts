export interface NigerianState {
  name: string;
  lgaCount: number;
  hasSuggestedZones: boolean;
}

export interface SuggestedZone {
  name: string;
  areas: string[];
}

export interface StateLocations {
  state: string;
  lgas: string[];
  // Popular neighbourhoods + every LGA, sorted.
  areas: string[];
  // Ready-made zone groupings (big cities only).
  suggestedZones: SuggestedZone[];
}

// GET /locations/reverse - the place at the browser's coordinates. Area and
// city are set when the neighbourhood is a known one.
export interface DetectedLocation {
  state: string | null;
  city: string | null;
  area?: string | null;
  label?: string | null;
}

// A place to shop near: an area (LGA / neighbourhood), a city or a whole state.
export interface NearbyPlace {
  state: string;
  city: string | null;
  area: string | null;
  // "Bodija, Ibadan, Oyo" / "Festac, Lagos" / "Port Harcourt, Rivers" / "Lagos State"
  label: string;
}

// GET /locations/search
export interface PlaceSuggestion extends NearbyPlace {
  type: "area" | "city" | "state";
  // Live sellers based in or delivering to it.
  storeCount: number;
}
