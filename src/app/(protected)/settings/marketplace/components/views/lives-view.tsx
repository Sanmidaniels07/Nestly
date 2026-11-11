"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  Copy,
  ImagePlus,
  Loader2,
  Pencil,
  Radio,
  Search,
  Share2,
  Video,
  X,
} from "lucide-react";

import { useCancelLive, useCreateLive, useMyLives, useUpdateLive } from "@/src/hooks/use-lives";
import { useMyProducts } from "@/src/hooks/use-my-products";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { naira } from "@/src/lib/payment-link";
import Skeleton from "@/src/components/ui/skeleton";
import { LiveBadge, liveShareUrl, liveWhen } from "@/src/components/live/live-ui";
import { LivePayload, SellerLive } from "@/src/types/live";

// Seller Hub -> Lives: schedule a live (or go live now), share its link,
// open the studio, and see how past lives went.

const MAX_PRODUCTS = 20;

const copyLink = async (live: SellerLive) => {
  const url = liveShareUrl(live.code, live.referralCode);
  try {
    if (navigator.share) return await navigator.share({ title: live.title, text: `I'm going live on Nestly: ${live.title}`, url });
    await navigator.clipboard.writeText(url);
    toast.success("Link copied - share it on WhatsApp, your status and bio");
  } catch {
    // closed
  }
};

export default function LivesView() {
  const { data, isLoading } = useMyLives();
  const { mutate: cancel } = useCancelLive();
  const [form, setForm] = useState<{ mode: "now" | "schedule"; live?: SellerLive } | null>(null);

  const groups = useMemo(() => {
    const lives = data?.lives ?? [];
    return {
      live: lives.filter((l) => l.status === "LIVE"),
      upcoming: lives.filter((l) => l.status === "SCHEDULED").sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt)),
      past: lives.filter((l) => l.status === "ENDED" || l.status === "CANCELLED"),
    };
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-violet-600 to-indigo-600 p-5 text-white sm:p-6">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-white/70">Live selling</p>
        <h2 className="mt-1 font-[family-name:var(--font-fraunces)] text-[24px] leading-tight">Sell live, like a pop-up shop on your phone</h2>
        <p className="mt-2 max-w-xl text-[13.5px] text-white/85">
          Show your products on camera, answer questions in the chat and let people buy without leaving. Share the link anywhere - people who aren&apos;t on
          Nestly can join too. Lives run for up to {data.maxMinutes} minutes.
        </p>
        {data.canGoLive ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setForm({ mode: "schedule" })} className="flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-[13.5px] font-semibold text-violet-700">
              <CalendarClock size={16} /> Schedule a live
            </button>
            <button type="button" onClick={() => setForm({ mode: "now" })} className="flex h-11 items-center gap-2 rounded-xl bg-rose-500 px-4 text-[13.5px] font-semibold">
              <Radio size={16} /> Go live now
            </button>
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-white/15 p-3.5 text-[13px]">
            <p className="flex items-center gap-2 font-semibold">
              <AlertTriangle size={15} /> Finish setting up your store to go live
            </p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-white/85">
              {data.blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
            <Link href="/settings/marketplace" className="mt-2 inline-block font-semibold underline">
              Open your setup checklist
            </Link>
          </div>
        )}
        {data.canGoLive && !data.videoReady && (
          <p className="mt-3 text-[12px] text-white/75">Live video is being switched on - you can schedule lives now and go live once it&apos;s ready.</p>
        )}
      </section>

      {groups.live.length > 0 && (
        <LiveGroup title="Live now">
          {groups.live.map((live) => (
            <LiveRow key={live.id} live={live} />
          ))}
        </LiveGroup>
      )}

      <LiveGroup title="Coming up" empty="No lives scheduled. Announce one a few days ahead so people can tap “Remind me”.">
        {groups.upcoming.map((live) => (
          <LiveRow
            key={live.id}
            live={live}
            onEdit={() => setForm({ mode: "schedule", live })}
            onCancel={() => window.confirm(`Cancel "${live.title}"? Everyone waiting will be told.`) && cancel(live.id)}
          />
        ))}
      </LiveGroup>

      {groups.past.length > 0 && (
        <LiveGroup title="Past lives">
          {groups.past.map((live) => (
            <LiveRow key={live.id} live={live} />
          ))}
        </LiveGroup>
      )}

      {form && <LiveForm mode={form.mode} existing={form.live} onClose={() => setForm(null)} />}
    </div>
  );
}

function LiveGroup({ title, empty, children }: { title: string; empty?: string; children: React.ReactNode }) {
  const list = Array.isArray(children) ? children : [children];
  return (
    <section>
      <h3 className="mb-3 text-[15px] font-semibold text-ink">{title}</h3>
      {list.length === 0 && empty ? <p className="rounded-2xl border border-dashed border-line p-5 text-center text-[13px] text-muted">{empty}</p> : <div className="space-y-3">{children}</div>}
    </section>
  );
}

function LiveRow({ live, onEdit, onCancel }: { live: SellerLive; onEdit?: () => void; onCancel?: () => void }) {
  const status =
    live.status === "LIVE" ? (
      <LiveBadge />
    ) : live.status === "SCHEDULED" ? (
      <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">Upcoming</span>
    ) : (
      <span className="rounded-md bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold text-muted">{live.status === "ENDED" ? "Ended" : "Cancelled"}</span>
    );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center">
      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500">
        {live.coverImage ? <Image src={live.coverImage} alt="" fill sizes="64px" className="object-cover" /> : <Video size={22} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {status}
          <p className="truncate text-[14px] font-semibold text-ink">{live.title}</p>
        </div>
        <p className="mt-0.5 text-[12.5px] text-muted">
          {liveWhen(live.startedAt ?? live.scheduledAt)} · {live.products.length} product{live.products.length === 1 ? "" : "s"}
          {live.status === "SCHEDULED" && ` · ${live.interestedCount} waiting`}
          {live.status === "ENDED" && ` · ${live.orders} order${live.orders === 1 ? "" : "s"} · ${naira(live.revenue)}`}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(live.status === "SCHEDULED" || live.status === "LIVE") && (
          <>
            <Link href={`/marketplace/live/${live.id}`} className="flex h-9 items-center gap-1.5 rounded-xl bg-violet-600 px-3 text-[12.5px] font-semibold text-white">
              <Video size={14} /> {live.status === "LIVE" ? "Back to studio" : "Studio"}
            </Link>
            <button type="button" onClick={() => copyLink(live)} className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[12.5px] font-semibold text-ink-2">
              <Share2 size={14} /> Share link
            </button>
          </>
        )}
        {onEdit && (
          <button type="button" onClick={onEdit} aria-label="Edit" className="flex h-9 items-center rounded-xl border border-line px-2.5 text-ink-2">
            <Pencil size={14} />
          </button>
        )}
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex h-9 items-center rounded-xl border border-line px-3 text-[12.5px] font-semibold text-red-600">
            Cancel
          </button>
        )}
        {live.status === "ENDED" && (
          <Link href={`/marketplace/live/${live.id}`} className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[12.5px] font-semibold text-ink-2">
            <BarChart3 size={14} /> Summary
          </Link>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Schedule / edit
// ---------------------------------------------------------------------------

/** "2026-11-14T19:00" in the browser's time, for <input type="datetime-local">. */
const localInput = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

function LiveForm({ mode, existing, onClose }: { mode: "now" | "schedule"; existing?: SellerLive; onClose: () => void }) {
  const router = useRouter();
  const { data: productsPage, isLoading: loadingProducts } = useMyProducts({ status: "PUBLISHED", limit: 100 });
  const { mutateAsync: upload, isPending: uploading } = useImageUpload();
  const { mutate: create, isPending: creating } = useCreateLive();
  const { mutate: update, isPending: updating } = useUpdateLive();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [cover, setCover] = useState<string | null>(existing?.coverImage ?? null);
  const [when, setWhen] = useState(() => localInput(existing ? new Date(existing.scheduledAt) : new Date(Date.now() + 24 * 60 * 60 * 1000)));
  const [selected, setSelected] = useState<Record<string, number | null>>(() =>
    Object.fromEntries((existing?.products ?? []).map((product) => [product.id, product.discountPercent]))
  );
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState<SellerLive | null>(null);

  const products = productsPage?.products ?? [];
  const shown = products.filter((product) => product.title.toLowerCase().includes(query.trim().toLowerCase()));
  const count = Object.keys(selected).length;

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = { ...current };
      if (id in next) delete next[id];
      else if (Object.keys(next).length < MAX_PRODUCTS) next[id] = null;
      else toast.error(`Feature up to ${MAX_PRODUCTS} products`);
      return next;
    });

  const onCover = async (file?: File) => {
    if (!file) return;
    try {
      setCover(await upload(file));
    } catch {
      // toast shown by the hook
    }
  };

  const submit = () => {
    setError("");
    if (title.trim().length < 3) return setError("Give your live a title.");
    if (count === 0) return setError("Pick at least one product to feature.");
    const bad = Object.values(selected).find((value) => value !== null && (value < 5 || value > 80));
    if (bad !== undefined) return setError("Live discounts must be between 5% and 80%.");
    const scheduledAt = mode === "now" ? new Date().toISOString() : new Date(when).toISOString();
    if (mode === "schedule" && new Date(when).getTime() < Date.now()) return setError("Pick a time in the future.");

    const payload: LivePayload = {
      title: title.trim(),
      description: description.trim() || null,
      coverImage: cover,
      scheduledAt,
      // Keep the seller's order: as they appear in the product list.
      products: products.filter((product) => product.id in selected).map((product) => ({ productId: product.id, discountPercent: selected[product.id] })),
    };

    if (existing) {
      return update(
        { id: existing.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Live updated");
            onClose();
          },
        }
      );
    }
    create(payload, {
      onSuccess: (response) => {
        if (mode === "now") return router.push(`/marketplace/live/${response.data.id}`);
        setCreated(response.data);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl bg-canvas p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-xl sm:rounded-3xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[16px] font-semibold text-ink">{created ? "Your live is scheduled" : existing ? "Edit live" : mode === "now" ? "Go live now" : "Schedule a live"}</p>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-muted hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        {created ? (
          <div className="space-y-4">
            <p className="text-[13.5px] text-ink-2">
              Share this link now - on your WhatsApp status, Instagram bio and with your customers. People tap &ldquo;Remind me&rdquo; and we remind them a day before, 15
              minutes before and when you go live. Your followers on Nestly are told automatically.
            </p>
            <div className="flex items-center gap-2 rounded-xl bg-surface-sunken p-3">
              <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono)] text-[12.5px] text-violet-700 dark:text-violet-300">
                {liveShareUrl(created.code, created.referralCode)}
              </span>
              <button type="button" onClick={() => copyLink(created)} className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[12.5px] font-semibold text-white">
                <Copy size={14} /> Share
              </button>
            </div>
            <button type="button" onClick={onClose} className="h-11 w-full rounded-xl border border-line text-[13.5px] font-semibold text-ink-2">
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <label className="block">
              <span className="text-[13px] font-semibold text-ink-2">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                placeholder="e.g. Friday small chops sale - 20% off live"
                className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[16px] text-ink outline-none focus:border-violet-400 sm:text-[14px]"
              />
            </label>

            <label className="block">
              <span className="text-[13px] font-semibold text-ink-2">What&apos;s happening (optional)</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                rows={2}
                placeholder="New arrivals, live-only prices, giveaways…"
                className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[16px] text-ink outline-none focus:border-violet-400 sm:text-[14px]"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-surface-sunken text-muted"
              >
                {cover ? <Image src={cover} alt="" fill sizes="128px" className="object-cover" /> : uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={20} />}
              </button>
              <div className="text-[12.5px] text-muted">
                <p className="font-semibold text-ink-2">Cover photo (optional)</p>
                Shown when your link is shared. Landscape works best.
                {cover && (
                  <button type="button" onClick={() => setCover(null)} className="ml-2 font-semibold text-red-600">
                    Remove
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onCover(e.target.files?.[0])} />
            </div>

            {mode === "schedule" && (
              <label className="block">
                <span className="text-[13px] font-semibold text-ink-2">Date and time</span>
                <input
                  type="datetime-local"
                  value={when}
                  min={localInput(new Date())}
                  onChange={(e) => setWhen(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[16px] text-ink outline-none focus:border-violet-400 sm:text-[14px]"
                />
                <span className="mt-1 block text-[12px] text-muted">Tip: evenings (7-9pm) and weekends get the most viewers.</span>
              </label>
            )}

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink-2">Products to feature</span>
                <span className="text-[12px] text-muted">
                  {count}/{MAX_PRODUCTS} chosen
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-muted">Add a live-only discount to create urgency - it applies during the live and 30 minutes after.</p>
              {products.length > 6 && (
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-surface px-3">
                  <Search size={15} className="text-muted" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your products" className="h-10 min-w-0 flex-1 bg-transparent text-[16px] outline-none sm:text-[14px]" />
                </div>
              )}
              <ul className="mt-2 max-h-72 space-y-1.5 overflow-y-auto">
                {loadingProducts && <Skeleton className="h-14 w-full rounded-xl" />}
                {!loadingProducts && products.length === 0 && <p className="py-4 text-center text-[13px] text-muted">Publish a product first.</p>}
                {shown.map((product) => {
                  const on = product.id in selected;
                  return (
                    <li key={product.id} className={`flex items-center gap-3 rounded-xl border p-2 ${on ? "border-violet-400 bg-violet-50/60 dark:bg-violet-500/10" : "border-line bg-surface"}`}>
                      <button type="button" onClick={() => toggle(product.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[12px] ${on ? "border-violet-600 bg-violet-600 text-white" : "border-line"}`}>{on && "✓"}</span>
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
                          {product.images[0] && <Image src={product.images[0].url} alt="" fill sizes="40px" className="object-cover" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold text-ink">{product.title}</span>
                          <span className="text-[12px] text-muted">{naira(product.price)}</span>
                        </span>
                      </button>
                      {on && (
                        <label className="flex shrink-0 items-center gap-1 text-[12px] text-muted">
                          <input
                            type="number"
                            inputMode="numeric"
                            min={5}
                            max={80}
                            placeholder="0"
                            value={selected[product.id] ?? ""}
                            onChange={(e) =>
                              setSelected((current) => ({ ...current, [product.id]: e.target.value === "" ? null : Math.round(Number(e.target.value)) }))
                            }
                            className="h-9 w-14 rounded-lg border border-line bg-surface px-2 text-center text-[16px] text-ink outline-none focus:border-violet-400 sm:text-[13px]"
                            aria-label={`Live discount for ${product.title}`}
                          />
                          % off
                        </label>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {error && <p className="rounded-xl bg-red-50 p-3 text-[12.5px] text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

            <button
              type="button"
              onClick={submit}
              disabled={creating || updating || uploading}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[14.5px] font-semibold text-white ${mode === "now" && !existing ? "bg-rose-600" : "bg-gradient-to-r from-violet-600 to-indigo-600"}`}
            >
              {(creating || updating) && <Loader2 size={17} className="animate-spin" />}
              {existing ? "Save changes" : mode === "now" ? "Continue to camera" : "Schedule live"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
