export interface SavedCard {
  id: string;
  brand: "Visa" | "Mastercard" | "Verve";
  last4: string;
  expiry: string;
  holder: string;
  default: boolean;
}

export const savedCards: SavedCard[] = [
  {
    id: "1",
    brand: "Visa",
    last4: "2839",
    expiry: "08/27",
    holder: "Daniel Sanmi",
    default: true,
  },
  {
    id: "2",
    brand: "Mastercard",
    last4: "7721",
    expiry: "01/29",
    holder: "Daniel Sanmi",
    default: false,
  },
];