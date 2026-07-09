import { nearbyProducts } from "./marketplace";

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  status: "Processing" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  items: {
    product: (typeof nearbyProducts)[0];
    quantity: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  payment: {
    method: string;
    reference: string;
    paidAt: string;
  };
  timeline: {
    title: string;
    description: string;
    date: string;
    completed: boolean;
  }[];
}

export const orders: MarketplaceOrder[] = [
  {
    id: "1",
    orderNumber: "NST-202500184",
    status: "Paid",
    paymentMethod: "Visa **** 2839",
    createdAt: "24 Nov 2025",
    estimatedDelivery: "28 Nov 2025",
    subtotal: 2350000,
    deliveryFee: 5000,
    tax: 176625,
    total: 2531625,
    items: [
      {
        product: nearbyProducts[0],
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: "Daniel Sanmi",
      phone: "+234 803 123 4567",
      address: "12 Admiralty Way, Lekki Phase 1",
      city: "Lagos",
      state: "Lagos",
    },
    payment: {
      method: "Visa **** 2839",
      reference: "PSK-8823910234",
      paidAt: "24 Nov 2025, 10:42 AM",
    },
    timeline: [
      {
        title: "Order placed",
        description: "Your order has been received.",
        date: "24 Nov 2025, 10:41 AM",
        completed: true,
      },
      {
        title: "Payment confirmed",
        description: "Payment was successfully processed.",
        date: "24 Nov 2025, 10:42 AM",
        completed: true,
      },
      {
        title: "Processing",
        description: "Seller is preparing your order.",
        date: "",
        completed: false,
      },
      {
        title: "Shipped",
        description: "Order has been handed to the courier.",
        date: "",
        completed: false,
      },
      {
        title: "Delivered",
        description: "Order arrives at your address.",
        date: "",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    orderNumber: "NST-202500185",
    status: "Processing",
    paymentMethod: "Mastercard **** 7721",
    createdAt: "26 Nov 2025",
    estimatedDelivery: "30 Nov 2025",
    subtotal: 1180000,
    deliveryFee: 5000,
    tax: 88875,
    total: 1273875,
    items: [
      {
        product: nearbyProducts[1] ?? nearbyProducts[0],
        quantity: 2,
      },
    ],
    shippingAddress: {
      fullName: "Daniel Sanmi",
      phone: "+234 803 123 4567",
      address: "45 Awolowo Road, Ikoyi",
      city: "Lagos",
      state: "Lagos",
    },
    payment: {
      method: "Mastercard **** 7721",
      reference: "PSK-8823910235",
      paidAt: "26 Nov 2025, 2:15 PM",
    },
    timeline: [
      {
        title: "Order placed",
        description: "Your order has been received.",
        date: "26 Nov 2025, 2:14 PM",
        completed: true,
      },
      {
        title: "Payment confirmed",
        description: "Payment was successfully processed.",
        date: "26 Nov 2025, 2:15 PM",
        completed: true,
      },
      {
        title: "Processing",
        description: "Seller is preparing your order.",
        date: "26 Nov 2025, 4:00 PM",
        completed: true,
      },
      {
        title: "Shipped",
        description: "Order has been handed to the courier.",
        date: "",
        completed: false,
      },
      {
        title: "Delivered",
        description: "Order arrives at your address.",
        date: "",
        completed: false,
      },
    ],
  },
  {
    id: "3",
    orderNumber: "NST-202500186",
    status: "Shipped",
    paymentMethod: "Bank transfer",
    createdAt: "20 Nov 2025",
    estimatedDelivery: "25 Nov 2025",
    subtotal: 875000,
    deliveryFee: 0,
    tax: 65625,
    total: 940625,
    items: [
      {
        product: nearbyProducts[2] ?? nearbyProducts[0],
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: "Daniel Sanmi",
      phone: "+234 803 123 4567",
      address: "8 Marina Street",
      city: "Lagos",
      state: "Lagos",
    },
    payment: {
      method: "Bank transfer",
      reference: "PSK-8823910236",
      paidAt: "20 Nov 2025, 9:05 AM",
    },
    timeline: [
      {
        title: "Order placed",
        description: "Your order has been received.",
        date: "20 Nov 2025, 9:04 AM",
        completed: true,
      },
      {
        title: "Payment confirmed",
        description: "Payment was successfully processed.",
        date: "20 Nov 2025, 9:05 AM",
        completed: true,
      },
      {
        title: "Processing",
        description: "Seller is preparing your order.",
        date: "20 Nov 2025, 11:30 AM",
        completed: true,
      },
      {
        title: "Shipped",
        description: "Order has been handed to the courier.",
        date: "21 Nov 2025, 8:00 AM",
        completed: true,
      },
      {
        title: "Delivered",
        description: "Order arrives at your address.",
        date: "",
        completed: false,
      },
    ],
  },
  {
    id: "4",
    orderNumber: "NST-202500187",
    status: "Delivered",
    paymentMethod: "Visa **** 2839",
    createdAt: "10 Nov 2025",
    estimatedDelivery: "14 Nov 2025",
    subtotal: 3200000,
    deliveryFee: 5000,
    tax: 240000,
    total: 3445000,
    items: [
      {
        product: nearbyProducts[3] ?? nearbyProducts[0],
        quantity: 1,
      },
      {
        product: nearbyProducts[0],
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: "Daniel Sanmi",
      phone: "+234 803 123 4567",
      address: "12 Admiralty Way, Lekki Phase 1",
      city: "Lagos",
      state: "Lagos",
    },
    payment: {
      method: "Visa **** 2839",
      reference: "PSK-8823910237",
      paidAt: "10 Nov 2025, 5:20 PM",
    },
    timeline: [
      {
        title: "Order placed",
        description: "Your order has been received.",
        date: "10 Nov 2025, 5:19 PM",
        completed: true,
      },
      {
        title: "Payment confirmed",
        description: "Payment was successfully processed.",
        date: "10 Nov 2025, 5:20 PM",
        completed: true,
      },
      {
        title: "Processing",
        description: "Seller is preparing your order.",
        date: "10 Nov 2025, 7:00 PM",
        completed: true,
      },
      {
        title: "Shipped",
        description: "Order has been handed to the courier.",
        date: "11 Nov 2025, 9:00 AM",
        completed: true,
      },
      {
        title: "Delivered",
        description: "Order arrives at your address.",
        date: "14 Nov 2025, 1:45 PM",
        completed: true,
      },
    ],
  },
  {
    id: "5",
    orderNumber: "NST-202500188",
    status: "Cancelled",
    paymentMethod: "Wallet",
    createdAt: "5 Nov 2025",
    estimatedDelivery: "9 Nov 2025",
    subtotal: 540000,
    deliveryFee: 5000,
    tax: 40500,
    total: 585500,
    items: [
      {
        product: nearbyProducts[1] ?? nearbyProducts[0],
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: "Daniel Sanmi",
      phone: "+234 803 123 4567",
      address: "45 Awolowo Road, Ikoyi",
      city: "Lagos",
      state: "Lagos",
    },
    payment: {
      method: "Wallet",
      reference: "PSK-8823910238",
      paidAt: "5 Nov 2025, 3:10 PM",
    },
    timeline: [
      {
        title: "Order placed",
        description: "Your order has been received.",
        date: "5 Nov 2025, 3:09 PM",
        completed: true,
      },
      {
        title: "Payment confirmed",
        description: "Payment was successfully processed.",
        date: "5 Nov 2025, 3:10 PM",
        completed: true,
      },
      {
        title: "Order cancelled",
        description: "This order was cancelled before shipping.",
        date: "6 Nov 2025, 10:00 AM",
        completed: true,
      },
    ],
  },
];

export function getOrderById(id: string) {
  return orders.find((order) => order.id === id);
}