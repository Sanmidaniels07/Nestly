"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, ImagePlus, Plus, Trash2, Wallet } from "lucide-react";

import { useMyStore } from "@/src/hooks/use-my-store";
import { useUpdateStore } from "@/src/hooks/use-update-store";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { useCreateShippingOption } from "@/src/hooks/use-create-shipping-option";
import { useDeleteShippingOption } from "@/src/hooks/use-delete-shipping-option";
import { useBanks } from "@/src/hooks/use-banks";
import { useSetupPayoutAccount } from "@/src/hooks/use-setup-payout-account";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import { FormCardSkeleton } from "@/src/components/skeletons/form-card-skeleton";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function StoreView() {
  const { data: store, isLoading } = useMyStore();

  if (isLoading || !store) {
    return (
      <div className="space-y-6">
        <FormCardSkeleton fields={4} />
        <FormCardSkeleton fields={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StoreDetailsForm storeId={store.id} />
      <PayoutDetailsForm slug={store.slug} />
      <StorePoliciesForm storeId={store.id} />
      <ShippingOptionsManager slug={store.slug} />
    </div>
  );
}

function StoreDetailsForm({ storeId }: { storeId: string }) {
  const { data: store } = useMyStore();
  const { mutate: updateStore, isPending: isSaving } = useUpdateStore();
  const { mutate: uploadImage, isPending: isUploading } = useImageUpload();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });
  const [logo, setLogo] = useState<string>();
  const [banner, setBanner] = useState<string>();

  useEffect(() => {
    if (!store) return;
    setForm({
      name: store.name,
      description: store.description ?? "",
      email: store.email ?? "",
      phone: store.phone ?? "",
      address: store.address ?? "",
      city: store.city ?? "",
      state: store.state ?? "",
      country: store.country ?? "",
    });
    setLogo(store.logo ?? undefined);
    setBanner(store.banner ?? undefined);
  }, [store]);

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFile = (file: File | undefined, onDone: (url: string) => void) => {
    if (!file) return;
    uploadImage(file, { onSuccess: onDone });
  };

  const handleSubmit = () => {
    updateStore({
      id: storeId,
      data: {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
        city: form.city.trim() || undefined,
        state: form.state.trim() || undefined,
        country: form.country.trim() || undefined,
        logo,
        banner,
      },
    });
  };

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Store details
      </h2>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <ImagePicker
            label="Logo"
            previewUrl={logo}
            inputRef={logoInputRef}
            onFile={(file) => handleFile(file, setLogo)}
          />
          <ImagePicker
            label="Banner"
            previewUrl={banner}
            inputRef={bannerInputRef}
            onFile={(file) => handleFile(file, setBanner)}
          />
        </div>

        <Input label="Store name" value={form.name} onChange={update("name")} />

        <div>
          <label className="mb-2 block text-[13.5px] font-medium text-[#334155]">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={update("description")}
            rows={3}
            className="w-full rounded-2xl border border-[#E4E6EB] bg-[#FAFBFC] px-4 py-3 text-[14px] text-[#13131A] outline-none transition-colors focus:border-violet-400 focus:bg-white"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" value={form.email} onChange={update("email")} />
          <Input label="Phone" value={form.phone} onChange={update("phone")} />
        </div>

        <Input label="Address" value={form.address} onChange={update("address")} />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="City" value={form.city} onChange={update("city")} />
          <Input label="State" value={form.state} onChange={update("state")} />
          <Input label="Country" value={form.country} onChange={update("country")} />
        </div>

        <Button
          variant="tribely"
          className="mt-2 w-full sm:w-fit"
          loading={isSaving || isUploading}
          onClick={handleSubmit}
        >
          Save store details
        </Button>
      </div>
    </section>
  );
}

function PayoutDetailsForm({ slug }: { slug: string }) {
  const { data: store } = useMyStore();
  const { data: banks } = useBanks();
  const { mutate: setupPayoutAccount, isPending } = useSetupPayoutAccount();

  const [editing, setEditing] = useState(false);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const isActive = !!store?.paystackSubaccountCode;

  useEffect(() => {
    setBankCode(store?.payoutBankCode ?? "");
  }, [store?.payoutBankCode]);

  const canSubmit = !!bankCode && accountNumber.trim().length === 10;

  const handleSubmit = () => {
    if (!canSubmit) return;

    setupPayoutAccount(
      { slug, data: { bankCode, accountNumber: accountNumber.trim() } },
      { onSuccess: () => setEditing(false) }
    );
  };

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50">
          <Wallet size={17} className="text-violet-600" />
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
            Payout details
          </h2>
          <p className="mt-1 text-[13px] text-[#64748B]">
            {isActive
              ? "Your share of every sale is paid straight to this account automatically."
              : "Add your bank account to get paid automatically after every sale."}
          </p>
        </div>
      </div>

      {isActive && !editing ? (
        <div className="mt-5 space-y-2.5">
          <div
            className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 ${
              store?.isOnHold
                ? "border-amber-200 bg-amber-50"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {store?.isOnHold ? (
                <Clock size={17} className="shrink-0 text-amber-600" />
              ) : (
                <CheckCircle2 size={17} className="shrink-0 text-emerald-600" />
              )}
              <div>
                <p className="text-[13.5px] font-medium text-[#13131A]">
                  {store?.payoutBankName} · {store?.payoutAccountNumber}
                </p>
                <p className="text-[12px] text-[#64748B]">{store?.payoutAccountName}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="shrink-0 text-[12.5px] font-medium text-violet-600 hover:underline"
            >
              Change
            </button>
          </div>

          {store?.isOnHold && (
            <p className="text-[12px] text-amber-700">
              This account was changed recently, so automatic payouts are paused for
              up to {store.holdHours ?? 48} hours as a security measure. Your
              earnings are still accruing and will be paid out manually in the
              meantime.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[13.5px] font-medium text-[#334155]">
                Bank
              </label>
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="h-14 w-full rounded-3xl border border-gray-200 bg-white px-5 text-[14px] text-[#13131A] outline-none transition-colors focus:border-violet-400"
              >
                <option value="">Select your bank</option>
                {banks?.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Account number"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              inputMode="numeric"
              placeholder="0123456789"
            />
          </div>

          <p className="text-[12px] text-[#94A3B8]">
            We&apos;ll verify this account with your bank before activating automatic
            payouts. For your security, a changed account is paused from automatic
            payouts for up to 48 hours, and we&apos;ll email you to confirm every
            change.
          </p>

          <div className="flex gap-3">
            {isActive && (
              <Button
                variant="outline"
                className="h-11 rounded-xl px-6"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="tribely"
              className="h-11 rounded-xl px-6"
              loading={isPending}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Verify &amp; activate
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function StorePoliciesForm({ storeId }: { storeId: string }) {
  const { data: store } = useMyStore();
  const { mutate: updateStore, isPending } = useUpdateStore();

  const [form, setForm] = useState({
    returnPolicy: "",
    shippingPolicy: "",
    warrantyPolicy: "",
  });

  useEffect(() => {
    if (!store) return;
    setForm({
      returnPolicy: store.returnPolicy ?? "",
      shippingPolicy: store.shippingPolicy ?? "",
      warrantyPolicy: store.warrantyPolicy ?? "",
    });
  }, [store]);

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    updateStore({
      id: storeId,
      data: {
        returnPolicy: form.returnPolicy.trim() || undefined,
        shippingPolicy: form.shippingPolicy.trim() || undefined,
        warrantyPolicy: form.warrantyPolicy.trim() || undefined,
      },
    });
  };

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Store policies
      </h2>
      <p className="mt-1 text-[13px] text-[#64748B]">
        Shown on your public store page to help buyers shop with confidence.
      </p>

      <div className="mt-6 space-y-4">
        {(
          [
            ["returnPolicy", "Return policy"],
            ["shippingPolicy", "Shipping policy"],
            ["warrantyPolicy", "Warranty policy"],
          ] as const
        ).map(([field, label]) => (
          <div key={field}>
            <label className="mb-2 block text-[13.5px] font-medium text-[#334155]">
              {label}
            </label>
            <textarea
              value={form[field]}
              onChange={update(field)}
              rows={2}
              placeholder={`Describe your ${label.toLowerCase()}...`}
              className="w-full resize-none rounded-2xl border border-[#E4E6EB] bg-[#FAFBFC] px-4 py-3 text-[14px] text-[#13131A] outline-none transition-colors focus:border-violet-400 focus:bg-white"
            />
          </div>
        ))}

        <Button variant="tribely" className="w-full sm:w-fit" loading={isPending} onClick={handleSubmit}>
          Save policies
        </Button>
      </div>
    </section>
  );
}

function ShippingOptionsManager({ slug }: { slug: string }) {
  const { data: store } = useMyStore();
  const options = store?.shippingOptions ?? [];

  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [etaDays, setEtaDays] = useState("");

  const { mutate: createOption, isPending: isCreating } = useCreateShippingOption(slug);
  const { mutate: deleteOption } = useDeleteShippingOption(slug);

  const canSubmit = name.trim().length > 0 && fee.trim().length > 0;

  const handleAdd = () => {
    if (!canSubmit) return;

    createOption(
      {
        name: name.trim(),
        fee: Number(fee),
        etaDays: etaDays ? Number(etaDays) : undefined,
      },
      {
        onSuccess: () => {
          setName("");
          setFee("");
          setEtaDays("");
        },
      }
    );
  };

  return (
    <section className="rounded-2xl border border-[#ECE9F6] bg-white p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-[#13131A]">
        Shipping options
      </h2>
      <p className="mt-1 text-[13px] text-[#64748B]">
        Buyers choose one of these at checkout.
      </p>

      <div className="mt-5 space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between rounded-xl border border-[#F2F1F8] px-4 py-3"
          >
            <div>
              <p className="text-[13.5px] font-medium text-[#13131A]">{option.name}</p>
              <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[12px] text-[#94A3B8]">
                {money(option.fee)}
                {option.etaDays ? ` · ${option.etaDays} day${option.etaDays === 1 ? "" : "s"}` : ""}
              </p>
            </div>
            <button
              onClick={() => deleteOption(option.id)}
              aria-label="Remove shipping option"
              className="rounded-full p-2 text-[#94A3B8] transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {options.length === 0 && (
          <p className="text-[13px] text-[#94A3B8]">No shipping options yet.</p>
        )}
      </div>

      <div className="mt-5 grid gap-3 border-t border-[#F2F1F8] pt-5 sm:grid-cols-[1.5fr_1fr_1fr_auto]">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Standard Shipping"
        />
        <Input
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          type="number"
          placeholder="Fee (₦)"
        />
        <Input
          value={etaDays}
          onChange={(e) => setEtaDays(e.target.value)}
          type="number"
          placeholder="ETA (days)"
        />
        <Button
          variant="tribely"
          loading={isCreating}
          disabled={!canSubmit}
          onClick={handleAdd}
          className="h-12"
        >
          <Plus size={16} />
        </Button>
      </div>
    </section>
  );
}

function ImagePicker({
  label,
  previewUrl,
  inputRef,
  onFile,
}: {
  label: string;
  previewUrl?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (file: File | undefined) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13.5px] font-medium text-[#334155]">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-[#F7F7FB] transition-colors hover:border-violet-400"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-[#94A3B8]">
            <ImagePlus size={20} />
            <span className="text-[12px]">Upload</span>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}
