"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Phone, Plus, X } from "lucide-react";

import { useAddresses } from "@/src/hooks/use-addresses";
import { useCreateAddress } from "@/src/hooks/use-create-address";
import { useDeleteAddress } from "@/src/hooks/use-delete-address";
import { useCheckoutStore } from "@/src/store/checkout-store";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import Skeleton from "@/src/components/ui/skeleton";
import AddressCard from "./address-card";
import { PHONE_PATTERN } from "@/src/lib/phone";
import { PickedAddress, mapsConfigured } from "@/src/lib/google-maps";

// Loaded only when the form opens - keeps Google Maps out of the page bundle.
const AddressMapPicker = dynamic(() => import("@/src/components/address/address-map-picker"), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse rounded-2xl bg-surface-2 sm:h-[360px]" />,
});

const emptyForm = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  latitude: null as number | null,
  longitude: null as number | null,
};

// "select" picks the delivery address at checkout / on a payment link;
// "manage" just lists, adds and removes saved addresses (profile settings).
export default function ShippingAddress({ mode = "select" }: { mode?: "select" | "manage" }) {
  const manage = mode === "manage";
  const { data: addresses, isLoading } = useAddresses();
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

  const addressId = useCheckoutStore((state) => state.addressId);
  const setAddressId = useCheckoutStore((state) => state.setAddressId);

  // null = not chosen yet: at checkout the form opens by itself when there's
  // no saved address.
  const [showForm, setShowForm] = useState<boolean | null>(null);
  const [form, setForm] = useState(emptyForm);
  // The map is the default way in; typing stays available.
  const [entry, setEntry] = useState<"map" | "manual">(mapsConfigured ? "map" : "manual");
  const formOpen = showForm ?? (!manage && !isLoading && addresses?.length === 0);
  const pinned = form.latitude !== null && form.longitude !== null;

  const openForm = (open: boolean) => {
    setShowForm(open);
    if (open) setEntry(mapsConfigured ? "map" : "manual");
  };

  const usePickedAddress = (picked: PickedAddress) => {
    setForm((prev) => ({
      ...prev,
      address: picked.address,
      city: picked.city,
      state: picked.state,
      country: picked.country,
      postalCode: picked.postalCode || prev.postalCode,
      latitude: picked.latitude,
      longitude: picked.longitude,
    }));
    setEntry("manual");
  };

  useEffect(() => {
    if (!manage && !addressId && addresses && addresses.length > 0) {
      const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
      setAddressId(defaultAddress.id);
    }
  }, [manage, addresses, addressId, setAddressId]);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canSubmit =
    form.fullName.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.country.trim();

  const handleAdd = () => {
    if (!canSubmit) return;

    createAddress(
      {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        postalCode: form.postalCode.trim() || undefined,
        isDefault: !addresses || addresses.length === 0,
        ...(pinned ? { latitude: form.latitude, longitude: form.longitude } : {}),
      },
      {
        onSuccess: () => {
          setForm(emptyForm);
          setShowForm(false);
        },
      }
    );
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
            {manage ? "Delivery addresses" : "Shipping address"}
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            {manage
              ? "Saved for quick checkout. Only sellers delivering your orders see them."
              : "Select where your order should be delivered."}
          </p>
        </div>

        <button
          onClick={() => openForm(!formOpen)}
          className="flex h-10 items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-violet-700"
        >
          {formOpen ? <X size={15} /> : <Plus size={15} />}
          {formOpen ? "Cancel" : "Add address"}
        </button>
      </div>

      {formOpen && entry === "map" && (
        <div className="mb-5 rounded-2xl border border-dashed border-violet-200 dark:border-violet-500/30 bg-surface-sunken p-4 sm:p-5">
          <p className="mb-3 text-[13.5px] font-semibold text-ink">Where should we deliver?</p>
          <AddressMapPicker
            initial={pinned ? { lat: form.latitude!, lng: form.longitude! } : null}
            onConfirm={usePickedAddress}
            onManual={() => setEntry("manual")}
          />
        </div>
      )}

      {formOpen && entry === "manual" && (
        <div className="mb-5 space-y-4 rounded-2xl border border-dashed border-violet-200 dark:border-violet-500/30 bg-surface-sunken p-5">
          {pinned ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-[12.5px] text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin size={14} /> Pinned on the map - add your house number or a landmark if it&apos;s missing.
              </span>
              <span className="flex gap-3">
                <button type="button" onClick={() => setEntry("map")} className="font-semibold underline underline-offset-2">
                  Move pin
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, latitude: null, longitude: null }))}
                  className="font-semibold underline underline-offset-2"
                >
                  Remove pin
                </button>
              </span>
            </div>
          ) : (
            mapsConfigured && (
              <button
                type="button"
                onClick={() => setEntry("map")}
                className="flex items-center gap-1.5 text-[13px] font-medium text-violet-700 hover:underline dark:text-violet-300"
              >
                <MapPin size={14} /> Use the map instead
              </button>
            )
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" value={form.fullName} onChange={update("fullName")} />
            <Input label="Phone" value={form.phone} onChange={update("phone")} />
          </div>

          <Input label="Address" value={form.address} onChange={update("address")} />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="City" value={form.city} onChange={update("city")} />
            <Input label="State" value={form.state} onChange={update("state")} />
            <Input label="Country" value={form.country} onChange={update("country")} />
          </div>

          <Input
            label="Postal code (optional)"
            value={form.postalCode}
            onChange={update("postalCode")}
          />

          <Button
            variant="tribely"
            className="w-full"
            disabled={!canSubmit}
            loading={isCreating}
            onClick={handleAdd}
          >
            Save address
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      )}

      {!isLoading && addresses?.length === 0 && !formOpen && (
        <p className="text-[13px] text-subtle">
          {manage ? "No saved addresses yet." : "No saved addresses yet. Add one to continue."}
        </p>
      )}

      <div className="space-y-3.5">
        {addresses?.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            selected={!manage && addressId === address.id}
            onSelect={() => !manage && setAddressId(address.id)}
            onDelete={() => deleteAddress(address.id)}
          />
        ))}
      </div>

      {!manage && <DeliveryPhone key={addressId} phone={addresses?.find((a) => a.id === addressId)?.phone} />}
    </section>
  );
}

// The number the seller (who delivers) will call - the address's phone
// unless the buyer changes it, e.g. when it's a gift for someone else.
// Sellers get it for delivery orders only, never their email.
function DeliveryPhone({ phone }: { phone?: string }) {
  const deliveryPhone = useCheckoutStore((state) => state.deliveryPhone);
  const setDeliveryPhone = useCheckoutStore((state) => state.setDeliveryPhone);
  if (phone === undefined) return null;

  const value = deliveryPhone ?? phone;
  const invalid = value.trim().length > 0 && !PHONE_PATTERN.test(value.trim());

  return (
    <div className="mt-5 border-t border-line-soft pt-5">
      <label htmlFor="delivery-phone" className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
        <Phone size={14} className="text-violet-600 dark:text-violet-400" /> Phone number for delivery
      </label>
      <p className="mt-0.5 text-[12.5px] text-muted">
        The seller calls this number to deliver your order. Change it if someone else is receiving it.
      </p>
      <input
        id="delivery-phone"
        type="tel"
        inputMode="tel"
        value={value}
        onChange={(e) => setDeliveryPhone(e.target.value)}
        placeholder="0803 123 4567"
        className={`mt-2.5 h-12 w-full rounded-xl border bg-surface px-4 text-[16px] text-ink outline-none transition-colors placeholder:text-subtle focus:ring-4 focus:ring-violet-500/10 sm:max-w-xs sm:text-[14px] ${
          invalid ? "border-red-300 focus:border-red-400" : "border-line focus:border-violet-400"
        }`}
      />
      {invalid && <p className="mt-1.5 text-[12px] text-red-600">Enter a valid phone number, e.g. 0803 123 4567.</p>}
    </div>
  );
}
