export interface MarketplaceSeller {
  id: string;
  name: string;
  avatar: string;

  verified: boolean;

  rating: number;

  reviews: number;

  productsCount: number;

  followers: number;

  joined: string;

  responseRate: number;

  distance: string;

  bio: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface MarketplaceProduct {
  id: string;

  name: string;

  slug: string;

  category: string;

  brand: string;

  description: string;

  highlights: string[];

  specifications: ProductSpecification[];

  images: string[];

  price: number;

  originalPrice?: number;

  discount?: number;

  stock: number;

  sku: string;

  condition: "New" | "Used";

  delivery: boolean;

  pickup: boolean;

  warranty: string;

  isFlashDeal?: boolean;

  dealEnds?: string;

  rating: number;

  reviews: number;

  seller: MarketplaceSeller;

  reviewsData: ProductReview[];
}

export interface ProductReview {
  id: string;

  user: {
    name: string;

    avatar: string;
  };

  rating: number;

  createdAt: string;

  comment: string;

  helpful: number;

  images?: string[];
}


export const trendingSellers: MarketplaceSeller[] = [
  {
    id: "1",
    name: "Daniel Tech",

    avatar: "https://i.pravatar.cc/150?img=12",

    verified: true,

    rating: 4.9,

    reviews: 184,

    productsCount: 148,

    followers: 3520,

    joined: "2021",

    responseRate: 98,

    distance: "2 km",

    bio: "Trusted Apple devices seller with nationwide delivery.",
  },

  {
    id: "2",

    name: "Phone World",

    avatar: "https://i.pravatar.cc/150?img=33",

    verified: true,

    rating: 4.8,

    reviews: 91,

    productsCount: 93,

    followers: 2210,

    joined: "2022",

    responseRate: 97,

    distance: "4 km",

    bio: "Smartphones and accessories.",
  },

  {
    id: "3",

    name: "Auto Hub",

    avatar: "https://i.pravatar.cc/150?img=51",

    verified: false,

    rating: 4.7,

    reviews: 58,

    productsCount: 61,

    followers: 980,

    joined: "2023",

    responseRate: 92,

    distance: "6 km",

    bio: "Automobile gadgets and accessories.",
  },
];

export const sampleReviews: ProductReview[] = [
  {
    id: "1",

    user: {
      name: "Daniel Sanmi",
      avatar: "https://i.pravatar.cc/100?img=12",
    },

    rating: 5,

    createdAt: "2 days ago",

    comment:
      "Fantastic laptop. Battery life is incredible and performance is exactly as described. Seller delivered quickly.",

    helpful: 18,

    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    ],
  },

  {
    id: "2",

    user: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/100?img=32",
    },

    rating: 5,

    createdAt: "Last week",

    comment:
      "Excellent seller. Product came well packaged and exactly matched the description.",

    helpful: 11,
  },

  {
    id: "3",

    user: {
      name: "Michael James",
      avatar: "https://i.pravatar.cc/100?img=54",
    },

    rating: 4,

    createdAt: "2 weeks ago",

    comment:
      "Very satisfied with the purchase. Delivery took one extra day but everything else was perfect.",

    helpful: 6,
  },

  {
    id: "4",

    user: {
      name: "Grace Peters",
      avatar: "https://i.pravatar.cc/100?img=47",
    },

    rating: 5,

    createdAt: "3 weeks ago",

    comment:
      "The MacBook works perfectly. Highly recommend both the product and this seller.",

    helpful: 21,

    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
    ],
  },

  {
    id: "5",

    user: {
      name: "John Williams",
      avatar: "https://i.pravatar.cc/100?img=23",
    },

    rating: 4,

    createdAt: "1 month ago",

    comment:
      "Overall great experience. Would definitely buy again.",

    helpful: 5,
  },
];



export const nearbyProducts: MarketplaceProduct[] = [
  {
    id: "1",

    slug: "macbook-pro-m3",

    name: "MacBook Pro M3",

    brand: "Apple",

    category: "Electronics",

    description:
      "Powerful Apple MacBook Pro M3 with exceptional battery life, Retina display and premium performance for professionals.",

    highlights: [
      "Apple M3 Chip",
      "18GB Unified Memory",
      "512GB SSD",
      "Retina Display",
      "97% Battery Health",
    ],

    specifications: [
      {
        label: "Processor",
        value: "Apple M3",
      },
      {
        label: "RAM",
        value: "18GB",
      },
      {
        label: "Storage",
        value: "512GB SSD",
      },
      {
        label: "Display",
        value: "14-inch Retina",
      },
      {
        label: "Battery",
        value: "97%",
      },
      {
        label: "Condition",
        value: "Used",
      },
    ],

    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    ],

    price: 2350000,

    originalPrice: 2500000,

    discount: 6,

    stock: 8,

    sku: "MBP-M3-512",

    condition: "Used",

    delivery: true,

    pickup: true,

    warranty: "6 Months",

    rating: 4.9,

    reviews: 184,

    seller: trendingSellers[0],

    reviewsData: sampleReviews,
  },

  {
    id: "2",

    slug: "macbook-pro-m3",

    name: "MacBook Pro M3",

    brand: "Apple",

    category: "Electronics",

    description:
      "Powerful Apple MacBook Pro M3 with exceptional battery life, Retina display and premium performance for professionals.",

    highlights: [
      "Apple M3 Chip",
      "18GB Unified Memory",
      "512GB SSD",
      "Retina Display",
      "97% Battery Health",
    ],

    specifications: [
      {
        label: "Processor",
        value: "Apple M3",
      },
      {
        label: "RAM",
        value: "18GB",
      },
      {
        label: "Storage",
        value: "512GB SSD",
      },
      {
        label: "Display",
        value: "14-inch Retina",
      },
      {
        label: "Battery",
        value: "97%",
      },
      {
        label: "Condition",
        value: "Used",
      },
    ],

    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    ],

    price: 2350000,

    originalPrice: 2500000,

    discount: 6,

    stock: 8,

    sku: "MBP-M3-512",

    condition: "Used",

    delivery: true,

    pickup: true,

    warranty: "6 Months",

    rating: 4.9,

    reviews: 184,

    seller: trendingSellers[0], 

    reviewsData: sampleReviews,
  },
  {
    id: "3",

    slug: "macbook-pro-m3",

    name: "MacBook Pro M3",

    brand: "Apple",

    category: "Electronics",

    description:
      "Powerful Apple MacBook Pro M3 with exceptional battery life, Retina display and premium performance for professionals.",

    highlights: [
      "Apple M3 Chip",
      "18GB Unified Memory",
      "512GB SSD",
      "Retina Display",
      "97% Battery Health",
    ],

    specifications: [
      {
        label: "Processor",
        value: "Apple M3",
      },
      {
        label: "RAM",
        value: "18GB",
      },
      {
        label: "Storage",
        value: "512GB SSD",
      },
      {
        label: "Display",
        value: "14-inch Retina",
      },
      {
        label: "Battery",
        value: "97%",
      },
      {
        label: "Condition",
        value: "Used",
      },
    ],

    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    ],

    price: 2350000,

    originalPrice: 2500000,

    discount: 6,

    stock: 8,

    sku: "MBP-M3-512",

    condition: "Used",

    delivery: true,

    pickup: true,

    warranty: "6 Months",

    rating: 4.9,

    reviews: 184,

    seller: trendingSellers[0],

    reviewsData: sampleReviews,
  },
];

export const marketplaceCategories = [
  "All",
  "Electronics",
  "Phones",
  "Computers",
  "Gaming",
  "Fashion",
  "Beauty",
  "Home",
  "Furniture",
  "Vehicles",
  "Sports",
];