"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

import { useAddresses } from "@/src/hooks/use-addresses";
import { useCreateAddress } from "@/src/hooks/use-create-address";
import { useDeleteAddress } from "@/src/hooks/use-delete-address";
import { useCheckoutStore } from "@/src/store/checkout-store";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import AddressCard from "./address-card";

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
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
            Shipping address
          </h2>
          <p className="mt-1 text-[13px] text-[#64748B]">
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
        <div className="mb-5 space-y-4 rounded-2xl border border-dashed border-violet-200 bg-[#FAFAFD] p-5">
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
        <p className="text-[13px] text-[#94A3B8]">Loading addresses...</p>
      )}

      {!isLoading && addresses?.length === 0 && !showForm && (
        <p className="text-[13px] text-[#94A3B8]">
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
    </section>
  );
}
