import { Address } from "../types/shipping-address";

export const addresses: Address[] = [
  {
    id: "1",

    label: "Home",

    fullName: "Daniel Sanmi",

    phone: "+2348130000000",

    email: "daniel@gmail.com",

    address: "12 Admiralty Way",

    city: "Lekki",

    state: "Lagos",

    country: "Nigeria",

    postalCode: "101245",

    landmark: "Near GTBank",

    isDefault: true,
  },

  {
    id: "2",

    label: "Office",

    fullName: "Daniel Sanmi",

    phone: "+2348130000000",

    email: "daniel@gmail.com",

    address: "34 Adeola Odeku",

    city: "Victoria Island",

    state: "Lagos",

    country: "Nigeria",

    postalCode: "100211",

    landmark: "Opposite Eko Hotel",

    isDefault: false,
  },
];