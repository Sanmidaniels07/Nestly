"use client";

import { useEffect, useState } from "react";
import { Phone, Plus, X } from "lucide-react";

import { useAddresses } from "@/src/hooks/use-addresses";
import { useCreateAddress } from "@/src/hooks/use-create-address";
import { useDeleteAddress } from "@/src/hooks/use-delete-address";
import { useCheckoutStore } from "@/src/store/checkout-store";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import Skeleton from "@/src/components/ui/skeleton";
import AddressCard from "./address-card";
import { PHONE_PATTERN } from "@/src/lib/phone";

const emptyForm = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

export default function ShippingAddress() {
  const { data: addresses, isLoading } = useAddresses();
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

  const addressId = useCheckoutStore((state) => state.addressId);
  const setAddressId = useCheckoutStore((state) => state.setAddressId);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!addressId && addresses && addresses.length > 0) {
      const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
      setAddressId(defaultAddress.id);
    }
  }, [addresses, addressId, setAddressId]);

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
            Shipping address
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Select where your order should be delivered.
          </p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex h-10 items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-violet-700"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "Add address"}
        </button>
      </div>

      {showForm && (
        <div className="mb-5 space-y-4 rounded-2xl border border-dashed border-violet-200 dark:border-violet-500/30 bg-surface-sunken p-5">
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

      {!isLoading && addresses?.length === 0 && !showForm && (
        <p className="text-[13px] text-subtle">
          No saved addresses yet. Add one to continue.
        </p>
      )}

      <div className="space-y-3.5">
        {addresses?.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            selected={addressId === address.id}
            onSelect={() => setAddressId(address.id)}
            onDelete={() => deleteAddress(address.id)}
          />
        ))}
      </div>

      <DeliveryPhone key={addressId} phone={addresses?.find((a) => a.id === addressId)?.phone} />
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
