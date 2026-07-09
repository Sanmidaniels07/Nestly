export interface Address {
  id: string;

  label: "Home" | "Office" | "Other";

  fullName: string;

  phone: string;

  email?: string;

  address: string;

  city: string;

  state: string;

  country: string;

  postalCode?: string;

  landmark?: string;

  isDefault: boolean;
}