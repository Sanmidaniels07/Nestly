import { Bike, Car, Truck, type LucideIcon } from "lucide-react";

// Mirrors the backend rule (utils/deliveryVehicle.ts): a bigger vehicle
// carries anything a smaller one can. Zones with no vehicle (made before
// vehicles existed) and pickup take anything.

export type DeliveryVehicle = "BIKE" | "CAR" | "TRUCK";

export const VEHICLES: { id: DeliveryVehicle; label: string; short: string; icon: LucideIcon; examples: string }[] = [
  { id: "BIKE", label: "Dispatch bike", short: "Bike", icon: Bike, examples: "Small items: food, cakes, clothes, phones, documents" },
  { id: "CAR", label: "Car", short: "Car", icon: Car, examples: "Fragile or bulky: big cakes, TVs, large boxes, many items" },
  { id: "TRUCK", label: "Truck / van", short: "Truck", icon: Truck, examples: "Heavy: furniture, fridges, generators, building materials" },
];

const RANK: Record<DeliveryVehicle, number> = { BIKE: 0, CAR: 1, TRUCK: 2 };

export const vehicleInfo = (vehicle?: DeliveryVehicle | null) => VEHICLES.find((v) => v.id === vehicle) ?? null;

export const requiredVehicle = (products: { deliveryVehicle?: DeliveryVehicle | null }[]): DeliveryVehicle =>
  products.reduce<DeliveryVehicle>((needed, product) => {
    const vehicle = product.deliveryVehicle ?? "BIKE";
    return RANK[vehicle] > RANK[needed] ? vehicle : needed;
  }, "BIKE");

export const canCarry = (option: { type: string; vehicle?: DeliveryVehicle | null }, needed: DeliveryVehicle) =>
  option.type === "PICKUP" || !option.vehicle || RANK[option.vehicle] >= RANK[needed];
