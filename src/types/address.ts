export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string | null;
  // Map pin (Google Maps); null when typed by hand.
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
}

export interface CreateAddressPayload {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  isDefault?: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;
