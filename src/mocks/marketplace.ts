export interface SellerPolicy {
  returns: string;
  shipping: string;
  warranty: string;
}

export interface SellerSocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface SellerReview {
  id: string;

  customer: {
    name: string;
    avatar: string;
  };

  rating: number;

  date: string;

  verifiedBuyer: boolean;

  purchasedProduct: string;

  helpful: number;

  comment: string;
}

export interface MarketplaceSeller {
  id: string;

  name: string;

  avatar: string;

  coverImage: string;

  verified: boolean;

  rating: number;

  reviews: number;

  followers: number;

  following: number;

  productsCount: number;

  joined: string;

  responseRate: number;

  responseTime: string;

  bio: string;

  email: string;

  phone: string;

  location: string;

  distance: string;

  policies: SellerPolicy;

  socialLinks: SellerSocialLinks;

  reviewsData: SellerReview[];
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
    avatar: "https://i.pravatar.cc/300?img=12",
    coverImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    verified: true,
    rating: 4.9,
    reviews: 184,
    followers: 3520,
    following: 91,
    productsCount: 148,
    joined: "2021",
    responseRate: 98,
    responseTime: "Within 10 mins",
    bio:
      "Premium Apple devices, accessories and professional electronics with nationwide delivery and warranty.",
    email: "hello@danieltech.ng",
    phone: "+234 803 000 1122",
    location: "Lekki, Lagos",
    distance: "2 km",
    policies: {
      returns: "Returns accepted within 7 days",
      shipping: "Nationwide delivery",
      warranty: "6 Months warranty",
    },
    socialLinks: {
      website: "https://danieltech.ng",
      instagram: "@danieltech",
      facebook: "Daniel Tech",
    },
    reviewsData: [
      {
        id: "1",
        customer: {
          name: "John Paul",
          avatar: "https://i.pravatar.cc/150?img=21",
        },
        rating: 5,
        verifiedBuyer: true,
        purchasedProduct: "MacBook Pro M3",
        helpful: 14,
        date: "12 Nov 2025",
        comment:
          "Fantastic seller. Product arrived exactly as described and delivery was faster than expected.",
      },
      {
        id: "2",
        customer: {
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?img=45",
        },
        rating: 5,
        verifiedBuyer: true,
        purchasedProduct: "iPhone 16 Pro",
        helpful: 7,
        date: "6 Nov 2025",
        comment: "Very responsive seller and excellent packaging. I'll definitely purchase again.",
      },
      {
        id: "3",
        customer: {
          name: "Michael James",
          avatar: "https://i.pravatar.cc/150?img=18",
        },
        rating: 4,
        verifiedBuyer: true,
        purchasedProduct: "MacBook Pro M3",
        helpful: 3,
        date: "28 Oct 2025",
        comment: "Everything was great. Communication was excellent throughout the purchase.",
      },
    ],
  },
  {
    id: "2",
    name: "Phone World",
    avatar: "https://i.pravatar.cc/150?img=33",
    coverImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    verified: true,
    rating: 4.8,
    reviews: 91,
    followers: 2210,
    following: 0,
    productsCount: 93,
    joined: "2022",
    responseRate: 97,
    responseTime: "Within 15 mins",
    bio: "Smartphones and accessories. Premium mobile devices with great deals.",
    email: "info@phoneworld.ng",
    phone: "+234 803 111 2233",
    location: "Ikeja, Lagos",
    distance: "4 km",
    policies: {
      returns: "Returns accepted within 5 days",
      shipping: "Nationwide delivery",
      warranty: "3 Months warranty",
    },
    socialLinks: {
      website: "https://phoneworld.ng",
      instagram: "@phoneworld",
      facebook: "Phone World",
    },
    reviewsData: [
      {
        id: "1",
        customer: {
          name: "John Paul",
          avatar: "https://i.pravatar.cc/150?img=21",
        },
        rating: 5,
        verifiedBuyer: true,
        purchasedProduct: "MacBook Pro M3",
        helpful: 14,
        date: "12 Nov 2025",
        comment:
          "Fantastic seller. Product arrived exactly as described and delivery was faster than expected.",
      },
      {
        id: "2",
        customer: {
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?img=45",
        },
        rating: 5,
        verifiedBuyer: true,
        purchasedProduct: "iPhone 16 Pro",
        helpful: 7,
        date: "6 Nov 2025",
        comment: "Very responsive seller and excellent packaging. I'll definitely purchase again.",
      },
      {
        id: "3",
        customer: {
          name: "Michael James",
          avatar: "https://i.pravatar.cc/150?img=18",
        },
        rating: 4,
        verifiedBuyer: true,
        purchasedProduct: "MacBook Pro M3",
        helpful: 3,
        date: "28 Oct 2025",
        comment: "Everything was great. Communication was excellent throughout the purchase.",
      },
    ],
  },
  {
    id: "3",
    name: "Auto Hub",
    avatar: "https://i.pravatar.cc/150?img=51",
    coverImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    verified: false,
    rating: 4.7,
    reviews: 58,
    followers: 980,
    following: 0,
    productsCount: 61,
    joined: "2023",
    responseRate: 92,
    responseTime: "Within 30 mins",
    bio: "Automobile gadgets and accessories. Quality auto electronics and parts.",
    email: "hello@autohub.ng",
    phone: "+234 803 222 3344",
    location: "Victoria Island, Lagos",
    distance: "6 km",
    policies: {
      returns: "Returns accepted within 3 days",
      shipping: "Nationwide delivery",
      warranty: "1 Month warranty",
    },
    socialLinks: {
      website: "https://autohub.ng",
      instagram: "@autohub",
      facebook: "Auto Hub",
    },

    reviewsData: [
      {
        id: "1",
        customer: {
          name: "John Paul",
          avatar: "https://i.pravatar.cc/150?img=21",
        },
        rating: 5,
        verifiedBuyer: true,
        purchasedProduct: "MacBook Pro M3",
        helpful: 14,
        date: "12 Nov 2025",
        comment:
          "Fantastic seller. Product arrived exactly as described and delivery was faster than expected.",
      },
      {
        id: "2",
        customer: {
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?img=45",
        },
        rating: 5,
        verifiedBuyer: true,
        purchasedProduct: "iPhone 16 Pro",
        helpful: 7,
        date: "6 Nov 2025",
        comment: "Very responsive seller and excellent packaging. I'll definitely purchase again.",
      },
      {
        id: "3",
        customer: {
          name: "Michael James",
          avatar: "https://i.pravatar.cc/150?img=18",
        },
        rating: 4,
        verifiedBuyer: true,
        purchasedProduct: "MacBook Pro M3",
        helpful: 3,
        date: "28 Oct 2025",
        comment: "Everything was great. Communication was excellent throughout the purchase.",
      },
    ],
    
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