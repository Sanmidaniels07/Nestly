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

export interface DetectedLocation {
  state: string | null;
  city: string | null;
}
