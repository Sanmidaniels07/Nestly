import toast from "react-hot-toast";

import { Order } from "../types/order";

/**
 * Where to send the buyer once their payment is confirmed. If the item sold
 * out to someone else just before the payment landed, the order comes back
 * CANCELLED and is being refunded - its order page explains that.
 */
export const afterPaymentPath = (order: Pick<Order, "id" | "status">) => {
  if (order.status === "CANCELLED") {
    toast.error("Sorry, it sold out just before your payment went through. We're refunding you.", { duration: 8000 });
    return `/marketplace/orders/${order.id}`;
  }
  return `/marketplace/order-success?orderId=${order.id}`;
};
