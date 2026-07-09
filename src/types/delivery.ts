export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  icon: "truck" | "zap" | "store";
}