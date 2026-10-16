"use client";

import { Check, Clock, Truck, PackageCheck, X } from "lucide-react";

interface Props {
  status: string;
}

const statusConfig: Record<string, { tone: string; icon: typeof Check }> = {
  paid: { tone: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", icon: Check },
  processing: { tone: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300", icon: Clock },
  pending: { tone: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300", icon: Clock },
  shipped: { tone: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300", icon: Truck },
  delivered: { tone: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300", icon: PackageCheck },
  cancelled: { tone: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300", icon: X },
};

export default function OrderStatusBadge({ status }: Props) {
  const config = statusConfig[status.toLowerCase()] ?? {
    tone: "bg-surface-muted text-muted",
    icon: Clock,
  };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize ${config.tone}`}>
      <Icon size={11} />
      {status.toLowerCase()}
    </span>
  );
}