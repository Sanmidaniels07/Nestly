export interface SellerStore {
  id: string;

  name: string;

  slug: string;

  logo: string;

  banner: string;

  description: string;

  email: string;

  phone: string;

  address: string;

  verified: boolean;

  followers: number;

  rating: number;

  totalProducts: number;

  totalSales: number;

  joinedAt: string;
}

export const sellerStore: SellerStore = {
  id: "seller-1",

  name: "Apple Official Store",

  slug: "apple-official",

  logo: "/images/stores/apple-logo.png",

  banner: "/images/stores/apple-banner.jpg",

  description:
    "Official Apple authorised reseller offering genuine Apple devices and accessories.",

  email: "store@apple.ng",

  phone: "+234 803 111 2222",

  address: "Victoria Island, Lagos",

  verified: true,

  followers: 24810,

  rating: 4.9,

  totalProducts: 148,

  totalSales: 12384,

  joinedAt: "2022",
};