"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, Loader2, Pencil, Plus, Store, Trash2 } from "lucide-react";

import { useCreateShippingOption } from "@/src/hooks/use-create-shipping-option";
import { useUpdateShippingOption } from "@/src/hooks/use-update-shipping-option";
import { useDeleteShippingOption } from "@/src/hooks/use-delete-shipping-option";
import { ShippingOption } from "@/src/types/store";

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[13.5px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-violet-400";

// Let buyers collect from the seller - always free, so no delivery fee is
// added at checkout. Usually one pickup point, but more are allowed.
export default function PickupSection({
  slug,
  pickups,
  storeAddress,
}: {
  slug: string;
  pickups: ShippingOption[];
  storeAddress: string;
}) {
  const [adding, setAdding] = useState(false);
  const active = pickups.filter((pickup) => !pickup.isArchived);
  const archived = pickups.filter((pickup) => pickup.isArchived);

  return (
    <div className="mt-6 border-t border-line-soft pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
            <Store size={15} className="text-violet-600 dark:text-violet-400" />
            Pickup
          </p>
          <p className="mt-0.5 text-[12.5px] text-muted">
            Let buyers collect their order from you. It&apos;s free for them: no delivery fee is added.
          </p>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[12.5px] font-medium text-ink-2 hover:border-violet-300"
          >
            <Plus size={13} />
            {active.length ? "Add another pickup point" : "Offer pickup"}
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2.5">
        {[...active, ...archived].map((pickup) => (
          <PickupRow key={pickup.id} slug={slug} pickup={pickup} storeAddress={storeAddress} />
        ))}
        {adding && <PickupForm slug={slug} storeAddress={storeAddress} onDone={() => setAdding(false)} />}
        {!adding && pickups.length === 0 && (
          <p className="text-[12.5px] text-subtle">Pickup is off. Buyers can only choose delivery.</p>
        )}
      </div>
    </div>
  );
}

function PickupForm({
  slug,
  storeAddress,
  pickup,
  onDone,
}: {
  slug: string;
  storeAddress: string;
  pickup?: ShippingOption;
  onDone: () => void;
}) {
  const [address, setAddress] = useState(pickup?.pickupAddress ?? storeAddress);
  const [eta, setEta] = useState(pickup?.eta ?? "");
  const { mutate: create, isPending: isCreating } = useCreateShippingOption(slug);
  const { mutate: update, isPending: isUpdating } = useUpdateShippingOption(slug);
  const isPending = isCreating || isUpdating;
  const canSave = address.trim().length >= 3;

  const handleSave = () => {
    if (!canSave) return;
    if (pickup) {
      update(
        {
          optionId: pickup.id,
          data: { pickupAddress: address.trim(), eta: eta.trim() || null },
          successMessage: "Pickup updated",
        },
        { onSuccess: onDone }
      );
    } else {
      create(
        { type: "PICKUP", fee: 0, pickupAddress: address.trim(), eta: eta.trim() || undefined },
        { onSuccess: onDone }
      );
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-line p-3.5 sm:p-4">
      <div>
        <label htmlFor="pickup-address" className="mb-1.5 block text-[12.5px] font-medium text-ink-2">
          Pickup address
        </label>
        <input
          id="pickup-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={300}
          placeholder="Where buyers collect, e.g. 14 Herbert Macaulay Way, Yaba"
          className={inputClass}
        />
        {!pickup && storeAddress && address === storeAddress && (
          <p className="mt-1 text-[11.5px] text-subtle">
            Filled in from your store address. Change it if buyers collect elsewhere.
          </p>
        )}
      </div>
      <input
        value={eta}
        onChange={(e) => setEta(e.target.value)}
        maxLength={50}
        placeholder="When it's ready (optional), e.g. Ready in 2 hours"
        aria-label="When pickup orders are ready"
        className={inputClass}
      />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onDone}
          className="h-10 rounded-xl px-4 text-[13px] font-medium text-muted hover:bg-surface-2"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || isPending}
          className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[13px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {pickup ? "Save changes" : "Offer pickup"}
        </button>
      </div>
    </div>
  );
}

function PickupRow({ slug, pickup, storeAddress }: { slug: string; pickup: ShippingOption; storeAddress: string }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { mutate: update, isPending: isUpdating } = useUpdateShippingOption(slug);
  const { mutate: remove, isPending: isDeleting } = useDeleteShippingOption(slug);

  if (editing) {
    return <PickupForm slug={slug} storeAddress={storeAddress} pickup={pickup} onDone={() => setEditing(false)} />;
  }

  const toggleArchive = () =>
    update({
      optionId: pickup.id,
      data: { isArchived: !pickup.isArchived },
      successMessage: pickup.isArchived ? "Pickup restored" : "Pickup paused",
    });

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-line-soft px-4 py-3 sm:flex-row sm:items-center ${
        pickup.isArchived ? "opacity-70" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium text-ink">
          {pickup.pickupAddress || storeAddress || "Your store address"}
          {pickup.isArchived && (
            <span className="ml-2 text-[11.5px] font-normal text-subtle">(paused, hidden from buyers)</span>
          )}
        </p>
        <p className="mt-1 text-[12.5px] text-emerald-700 dark:text-emerald-400">
          Free for buyers{pickup.eta && <span className="text-subtle"> · {pickup.eta}</span>}
        </p>
      </div>
      {confirmingDelete ? (
        <div className="flex items-center gap-2 text-[12.5px]">
          <span className="text-muted">Stop offering pickup here?</span>
          <button
            type="button"
            onClick={() => remove(pickup.id)}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className="rounded-lg px-2.5 py-1.5 text-muted hover:bg-surface-2"
          >
            Keep
          </button>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium text-ink-2 hover:bg-surface-2"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={toggleArchive}
            disabled={isUpdating}
            className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium text-ink-2 hover:bg-surface-2 disabled:opacity-60"
          >
            {pickup.isArchived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
            {pickup.isArchived ? "Restore" : "Pause"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            aria-label="Delete pickup point"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-subtle hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
