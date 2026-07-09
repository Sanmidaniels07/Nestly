import { DeliveryOption } from "@/src/types/delivery";

export const deliveryOptions: DeliveryOption[] = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "Delivered by our trusted logistics partners.",
    duration: "2 - 4 business days",
    price: 5000,
    icon: "truck",
  },
  {
    id: "express",
    name: "Express Delivery",
    description: "Fastest delivery available.",
    duration: "Same day / Next day",
    price: 12000,
    icon: "zap",
  },
  {
    id: "pickup",
    name: "Store Pickup",
    description: "Pick up directly from the seller.",
    duration: "Ready today",
    price: 0,
    icon: "store",
  },
];