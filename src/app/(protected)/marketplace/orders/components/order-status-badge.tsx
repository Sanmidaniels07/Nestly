"use client";

import { Check, Clock, Truck, PackageCheck, X } from "lucide-react";

interface Props {
  status: string;
}

const statusConfig: Record<string, { tone: string; icon: typeof Check }> = {
  Paid: { tone: "bg-emerald-50 text-emerald-700", icon: Check },
  Processing: { tone: "bg-amber-50 text-amber-700", icon: Clock },
  Shipped: { tone: "bg-blue-50 text-blue-700", icon: Truck },
  Delivered: { tone: "bg-violet-50 text-violet-700", icon: PackageCheck },
  Cancelled: { tone: "bg-red-50 text-red-700", icon: X },
};

export default function OrderStatusBadge({ status }: Props) {
  const config = statusConfig[status] ?? { tone: "bg-[#F1F0F5] text-[#64748B]", icon: Clock };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${config.tone}`}>
      <Icon size={11} />
      {status}
    </span>
  );
}