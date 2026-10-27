"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ExternalLink, Link2, Pause, Pencil, Play, Plus, ShieldCheck, Trash2 } from "lucide-react";

import { useDeletePaymentLink, useMyPaymentLinks, useUpdatePaymentLink } from "@/src/hooks/use-payment-links";
import { naira } from "@/src/lib/payment-link";
import Skeleton from "@/src/components/ui/skeleton";
import { PaymentLink } from "@/src/types/payment-link";

// How the buyer gets it, in a few words.
const deliveryText = (link: PaymentLink) =>
  link.deliveryType === "STORE_OPTIONS"
    ? "Buyer chooses delivery zone"
    : link.deliveryType === "PICKUP"
      ? "Pickup"
      : link.deliveryFee > 0
        ? `${naira(link.deliveryFee)} delivery`
        : "Free delivery";
import LinkForm from "../payment-links/link-form";
import ShareLink from "../payment-links/share-link";

type Panel = { mode: "new" } | { mode: "edit"; link: PaymentLink } | { mode: "created"; link: PaymentLink } | null;

// Protected payment links: turn a deal from DMs/WhatsApp into a link the
// buyer pays through Nestly, with the same protection as any order.
export default function PaymentLinksView() {
  const { data: links, isLoading } = useMyPaymentLinks();
  const [panel, setPanel] = useState<Panel>(null);

  return (
    <div className="min-w-0 space-y-6">
      <Intro onCreate={() => setPanel({ mode: "new" })} showButton={panel?.mode !== "new"} />

      {panel?.mode === "new" && (
        <LinkForm onCancel={() => setPanel(null)} onDone={(link) => setPanel({ mode: "created", link })} />
      )}

      {panel?.mode === "created" && <Created link={panel.link} onClose={() => setPanel(null)} />}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ) : links?.length ? (
        <section className="space-y-3">
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-subtle">Your links</h3>
          {links.map((link) =>
            panel?.mode === "edit" && panel.link.id === link.id ? (
              <LinkForm key={link.id} link={link} onCancel={() => setPanel(null)} onDone={() => setPanel(null)} />
            ) : (
              <LinkRow key={link.id} link={link} onEdit={() => setPanel({ mode: "edit", link })} />
            )
          )}
        </section>
      ) : (
        panel?.mode !== "new" && (
          <div className="rounded-2xl border border-dashed border-line bg-surface-sunken px-6 py-12 text-center">
            <Link2 size={26} className="mx-auto text-violet-500" />
            <p className="mt-3 text-[14px] font-semibold text-ink">No payment links yet</p>
            <p className="mx-auto mt-1 max-w-sm text-[12.5px] text-muted">
              Next time a customer asks &quot;how do I pay?&quot; in your DMs, send them a Nestly link instead of your account number.
            </p>
          </div>
        )
      )}
    </div>
  );
}

function Intro({ onCreate, showButton }: { onCreate: () => void; showButton: boolean }) {
  const steps = [
    "Create a link for the item and price you agreed",
    "Send it in DMs, WhatsApp or put it in your bio",
    "Buyer pays - Nestly holds the money safely",
    "You deliver, they confirm with their code - you get paid",
  ];
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
            <ShieldCheck size={19} />
          </div>
          <div className="min-w-0">
            <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] italic leading-tight text-ink">Protected payment links</h2>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
              Close more sales from Instagram, WhatsApp and TikTok. Buyers who are scared to send money to a stranger will pay through Nestly, because
              their money is held until they get what they ordered.
            </p>
          </div>
        </div>
        {showButton && (
          <button
            type="button"
            onClick={onCreate}
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[13.5px] font-semibold text-white transition-all hover:brightness-110"
          >
            <Plus size={16} /> New payment link
          </button>
        )}
      </div>
      <ol className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-2.5 rounded-xl bg-surface-sunken px-3.5 py-3 text-[12.5px] leading-snug text-ink-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-bold text-white">{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Created({ link, onClose }: { link: PaymentLink; onClose: () => void }) {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/5 sm:p-6">
      <div className="flex items-start gap-2.5">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-semibold text-ink">Your link is ready - send it to your buyer</p>
          <p className="mt-0.5 text-[12.5px] text-muted">
            {link.title} · {naira(link.price)} · {deliveryText(link).toLowerCase()}
          </p>
          <div className="mt-3.5">
            <ShareLink link={link} />
          </div>
          <button type="button" onClick={onClose} className="mt-3 text-[12.5px] font-semibold text-violet-700 hover:underline dark:text-violet-300">
            Done
          </button>
        </div>
      </div>
    </section>
  );
}

function statusOf(link: PaymentLink) {
  if (!link.isActive) return { label: "Paused", className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" };
  if (link.quantity <= 0) return { label: "Sold out", className: "bg-surface-2 text-muted" };
  return { label: "Active", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" };
}

function LinkRow({ link, onEdit }: { link: PaymentLink; onEdit: () => void }) {
  const { mutate: updateLink, isPending: isToggling } = useUpdatePaymentLink();
  const { mutate: deleteLink, isPending: isDeleting } = useDeletePaymentLink();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cover = link.images.find((image) => image.isPrimary)?.url ?? link.images[0]?.url;
  const status = statusOf(link);

  const iconButton =
    "flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line px-3 text-[12.5px] font-semibold text-ink-2 transition-colors hover:border-violet-300 disabled:opacity-60 dark:hover:border-violet-500/40";

  return (
    <article className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex gap-3.5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-sunken sm:h-20 sm:w-20">
          {cover ? (
            <Image src={cover} alt={link.title} fill sizes="80px" className="object-cover" />
          ) : (
            <Link2 size={20} className="absolute inset-0 m-auto text-subtle" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="min-w-0 truncate text-[14.5px] font-semibold text-ink">{link.title}</h4>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.className}`}>{status.label}</span>
          </div>
          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[14px] font-semibold text-violet-700 dark:text-violet-300">{naira(link.price)}</p>
          <p className="mt-1 text-[12px] text-muted">
            {link.quantity} left · {deliveryText(link)}
            {link.sales.orders > 0 && (
              <>
                {" "}· <span className="font-semibold text-ink-2">{link.sales.orders} paid order{link.sales.orders === 1 ? "" : "s"} ({naira(link.sales.revenue)})</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3.5">
        <ShareLink link={link} compact />
        <Link href={`/pay/${link.code}`} target="_blank" className={iconButton}>
          <ExternalLink size={14} /> Preview
        </Link>
        <button type="button" onClick={onEdit} className={iconButton}>
          <Pencil size={14} /> Edit
        </button>
        <button
          type="button"
          disabled={isToggling}
          onClick={() => updateLink({ id: link.id, data: { isActive: !link.isActive } })}
          className={iconButton}
        >
          {link.isActive ? <Pause size={14} /> : <Play size={14} />} {link.isActive ? "Pause" : "Resume"}
        </button>
        {confirmDelete ? (
          <span className="flex items-center gap-2 text-[12.5px] text-muted">
            Delete this link?
            <button type="button" disabled={isDeleting} onClick={() => deleteLink(link.id)} className="font-semibold text-red-600 hover:underline">
              Delete
            </button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="font-semibold text-ink-2 hover:underline">
              Keep
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className={`${iconButton} text-red-600 hover:border-red-300`}>
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>
    </article>
  );
}
