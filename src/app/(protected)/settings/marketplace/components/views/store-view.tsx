"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ImagePlus,
  Wallet,
} from "lucide-react";

import { useMyStore } from "@/src/hooks/use-my-store";
import { useUpdateStore } from "@/src/hooks/use-update-store";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { useBanks } from "@/src/hooks/use-banks";
import { useSetupPayoutAccount } from "@/src/hooks/use-setup-payout-account";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import { FormCardSkeleton } from "@/src/components/skeletons/form-card-skeleton";
import { useNigerianStates } from "@/src/hooks/use-locations";
import DeliveryZonesManager from "./delivery-zones-manager";
import BusinessVerification from "./business-verification";
import SocialLinksForm from "./social-links-form";

export default function StoreView() {
  const { data: store, isLoading } = useMyStore();

  // Reminders link to a section (#payout-account, #delivery-zones...) -
  // scroll there once the forms have rendered.
  const loaded = !isLoading && !!store;
  useEffect(() => {
    if (!loaded || !window.location.hash) return;
    const timer = setTimeout(() => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => clearTimeout(timer);
  }, [loaded]);

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
      <SocialLinksForm store={store} />
      <PayoutDetailsForm slug={store.slug} />
      <BusinessVerification />
      <StorePoliciesForm storeId={store.id} />
      <DeliveryZonesManager slug={store.slug} />
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

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFile = (
    file: File | undefined,
    onDone: (url: string) => void,
  ) => {
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
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
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
          <label className="mb-2 block text-[13.5px] font-medium text-ink-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={update("description")}
            rows={3}
            className="w-full rounded-2xl border border-line-strong bg-surface-sunken px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-violet-400 focus:bg-surface"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
          />
          <Input label="Phone" value={form.phone} onChange={update("phone")} />
        </div>
        <p className="-mt-2 text-[12px] leading-relaxed text-muted">
          Buyers can see your email and phone. Every sale must still be paid through Nestly checkout - asking buyers to pay you directly can get
          your store suspended (<Link href="/seller-terms#conduct" className="font-medium text-violet-600 underline-offset-2 hover:underline dark:text-violet-400">seller rules</Link>).
        </p>

        <Input
          label="Address"
          value={form.address}
          onChange={update("address")}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="City" value={form.city} onChange={update("city")} />
          <StateSelect value={form.state} onChange={(state) => setForm((prev) => ({ ...prev, state }))} />
          <Input
            label="Country"
            value={form.country}
            onChange={update("country")}
          />
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
      { onSuccess: () => setEditing(false) },
    );
  };

  return (
    <section id="payout-account" className="scroll-mt-24 rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
          <Wallet size={17} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
            Payout details
          </h2>
          <p className="mt-1 text-[13px] text-muted">
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
                ? "border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10"
                : "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {store?.isOnHold ? (
                <Clock size={17} className="shrink-0 text-amber-600 dark:text-amber-400" />
              ) : (
                <CheckCircle2 size={17} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              <div>
                <p className="text-[13.5px] font-medium text-ink">
                  {store?.payoutBankName} · {store?.payoutAccountNumber}
                </p>
                <p className="text-[12px] text-muted">
                  {store?.payoutAccountName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="shrink-0 text-[12.5px] font-medium text-violet-600 dark:text-violet-400 hover:underline"
            >
              Change
            </button>
          </div>

          {store?.isOnHold && (
            <p className="text-[12px] text-amber-700 dark:text-amber-300">
              This account was changed recently, so automatic payouts are paused
              for up to {store.holdHours ?? 48} hours as a security measure.
              Your earnings are still accruing and will be paid out manually in
              the meantime.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[13.5px] font-medium text-ink-2">
                Bank
              </label>
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="h-14 w-full rounded-3xl border border-line bg-surface px-5 text-[14px] text-ink outline-none transition-colors focus:border-violet-400"
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

          <p className="text-[12px] text-subtle">
            We&apos;ll verify this account with your bank before activating
            automatic payouts. For your security, a changed account is paused
            from automatic payouts for up to 48 hours, and we&apos;ll email you
            to confirm every change.
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

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

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
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <h2 className="font-[family-name:var(--font-fraunces)] text-[20px] italic text-ink">
        Store policies
      </h2>
      <p className="mt-1 text-[13px] text-muted">
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
            <label className="mb-2 block text-[13.5px] font-medium text-ink-2">
              {label}
            </label>
            <textarea
              value={form[field]}
              onChange={update(field)}
              rows={2}
              placeholder={`Describe your ${label.toLowerCase()}...`}
              className="w-full resize-none rounded-2xl border border-line-strong bg-surface-sunken px-4 py-3 text-[14px] text-ink outline-none transition-colors focus:border-violet-400 focus:bg-surface"
            />
          </div>
        ))}

        <Button
          variant="tribely"
          className="w-full sm:w-fit"
          loading={isPending}
          onClick={handleSubmit}
        >
          Save policies
        </Button>
      </div>
    </section>
  );
}

// Store's state from the official list - delivery-zone suggestions are based
// on it. A value saved before this was a dropdown stays selectable.
function StateSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { data: states } = useNigerianStates();
  const known = states?.some((state) => state.name === value);

  return (
    <div className="w-full">
      <label htmlFor="store-state" className="mb-2 block text-sm font-medium text-ink-2">
        State
      </label>
      <select
        id="store-state"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 w-full rounded-3xl border border-line bg-surface px-5 text-base text-ink outline-none transition-colors focus:border-violet-500"
      >
        <option value="">Select state</option>
        {value && !known && <option value={value}>{value}</option>}
        {states?.map((state) => (
          <option key={state.name} value={state.name}>
            {state.name}
          </option>
        ))}
      </select>
    </div>
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
      <label className="mb-2 block text-[13.5px] font-medium text-ink-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line-strong bg-surface-2 transition-colors hover:border-violet-400"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-subtle">
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
