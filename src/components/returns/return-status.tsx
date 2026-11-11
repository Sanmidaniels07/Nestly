import { Clock, Gavel, MessageSquareText, Wallet } from "lucide-react";

import { RETURN_STATUS_LABEL, RETURN_STATUS_TONE, ReturnRequest } from "@/src/types/return-request";

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

export const formatDeadline = (date: string) =>
  new Date(date).toLocaleString("en-NG", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function ReturnStatusPill({ status }: { status: ReturnRequest["status"] }) {
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${RETURN_STATUS_TONE[status]}`}>
      {RETURN_STATUS_LABEL[status]}
    </span>
  );
}

/**
 * What has happened on a report so far: the seller's answer, Nestly's
 * decision and the refund. `viewer` words it for the person reading.
 */
export function ReturnTrail({ request, viewer }: { request: ReturnRequest; viewer: "buyer" | "seller" | "admin" }) {
  const lines: { icon: typeof Clock; text: string; tone?: string }[] = [];

  if (request.status === "REQUESTED" && request.sellerRespondBy) {
    lines.push({
      icon: Clock,
      text:
        viewer === "seller"
          ? `Answer by ${formatDeadline(request.sellerRespondBy)} - after that Nestly decides. Your payout for this order is on hold until it's sorted.`
          : `The seller has until ${formatDeadline(request.sellerRespondBy)} to answer.`,
      tone: "text-amber-700 dark:text-amber-300",
    });
  }

  if (request.sellerResponse) {
    lines.push({ icon: MessageSquareText, text: `${viewer === "seller" ? "You" : "Seller"}: "${request.sellerResponse}"` });
  }

  if (request.status === "DISPUTED") {
    lines.push({
      icon: Gavel,
      text:
        viewer === "admin"
          ? "Waiting for your decision."
          : "Nestly is looking at both sides and will decide within 2 business days.",
      tone: "text-violet-700 dark:text-violet-300",
    });
  }

  if (request.resolutionNote) {
    lines.push({ icon: Gavel, text: `Nestly: "${request.resolutionNote}"` });
  }

  if (request.status === "REFUNDED" && request.refundAmount) {
    const amount = naira(request.refundAmount);
    lines.push({
      icon: Wallet,
      text:
        request.refundStatus === "FAILED"
          ? viewer === "admin"
            ? `${amount} must be refunded by hand.`
            : `${amount} refund approved - Nestly is sending it.`
          : viewer === "buyer"
            ? `${amount} is on its way back to the card or account you paid with (usually 5-10 business days).`
            : `${amount} refunded to the buyer.`,
      tone: request.refundStatus === "FAILED" && viewer === "admin" ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-300",
    });
  }

  if (lines.length === 0) return null;

  return (
    <ul className="mt-3 space-y-1.5">
      {lines.map(({ icon: Icon, text, tone }, index) => (
        <li key={index} className={`flex items-start gap-2 text-[12.5px] leading-snug ${tone ?? "text-muted"}`}>
          <Icon size={14} className="mt-[1px] shrink-0" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
