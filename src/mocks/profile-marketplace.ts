export interface MarketplaceItem {
  id: string;
  title: string;
  image: string;
  price: number;
  status: "ACTIVE" | "SOLD" | "PURCHASED";
  location: string;
  views: number;
  likes: number;
}

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: "1",
    title: "MacBook Pro M3",
    image: "/images/market/macbook.jpg",
    price: 1850,
    status: "ACTIVE",
    location: "Lagos",
    views: 312,
    likes: 52,
  },
  {
    id: "2",
    title: "Sony Camera",
    image: "/images/market/camera.jpg",
    price: 900,
    status: "ACTIVE",
    location: "Abuja",
    views: 120,
    likes: 14,
  },
  {
    id: "3",
    title: "Gaming Chair",
    image: "/images/market/chair.jpg",
    price: 230,
    status: "SOLD",
    location: "Ibadan",
    views: 84,
    likes: 6,
  },
  {
    id: "4",
    title: "AirPods Pro",
    image: "/images/market/airpods.jpg",
    price: 160,
    status: "PURCHASED",
    location: "Lagos",
    views: 0,
    likes: 0,
  },
];