"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, ImagePlus, XCircle } from "lucide-react";

import { useMySeller } from "@/src/hooks/use-my-seller";
import { useBecomeSeller } from "@/src/hooks/use-become-seller";
import { useCreateStore } from "@/src/hooks/use-create-store";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { useCountdown } from "@/src/hooks/use-countdown";
import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";
import { FormCardSkeleton } from "@/src/components/skeletons/form-card-skeleton";
import BackButton from "@/src/components/ui/back-button";
import { SellerProfile } from "@/src/types/seller";
import QuickStart from "./quick-start";

// Sellers arrive here from the seller dashboard, the marketplace, or a
// "Set up store" prompt - always offer a way back to where they were.
export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <BackButton fallbackHref="/settings/marketplace" />
      <SellPageContent />
    </div>
  );
}

function SellPageContent() {
  const router = useRouter();
  const { data: seller, isLoading, isError } = useMySeller();
  // Once quick start begins it stays on screen through its last step, even
  // though the seller (with a store) has already been created.
  const [quickStarting, setQuickStarting] = useState(false);

  const finish = () => router.replace("/settings/marketplace");

  if (quickStarting) {
    return <QuickStart seller={seller} onBegin={() => {}} onFinish={finish} />;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl">
        <FormCardSkeleton fields={2} />
      </div>
    );
  }

  const isSeller = !isError && !!seller;

  if (isSeller && seller.status === "REJECTED") {
    return <RejectedApplication seller={seller} />;
  }

  // New sellers - and applications still waiting - start selling straight
  // away with quick start (Nestly reviews them afterwards).
  if (!isSeller || seller.status === "PENDING") {
    return <QuickStart seller={isSeller ? seller : null} onBegin={() => setQuickStarting(true)} onFinish={finish} />;
  }

  if (isSeller && seller.store) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface px-6 py-16 text-center sm:px-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
          <CheckCircle2 size={26} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] text-ink">
          You&apos;re all set up
        </h1>
        <p className="mt-2.5 text-[13.5px] text-muted">
          {seller.store.name} is live on Nestly.
        </p>
        <Button
          className="mx-auto mt-7 w-fit"
          variant="tribely"
          onClick={() => router.push("/settings/marketplace")}
        >
          Go to seller dashboard
        </Button>
      </section>
    );
  }

  // Approved the old way (by an admin) but no store yet.
  return <CreateStoreForm />;
}

function RejectedApplication({ seller }: { seller: SellerProfile }) {
  const { mutate: becomeSeller, isPending } = useBecomeSeller();
  const { label: countdownLabel, isDone } = useCountdown(seller.reapplyEligibleAt);

  const canReapply = seller.canReapply || isDone;

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface px-6 py-16 text-center sm:px-10">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
        <XCircle size={26} className="text-red-600 dark:text-red-400" />
      </div>
      <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] text-ink">
        Application rejected
      </h1>
      <p className="mt-2.5 text-[13.5px] text-muted">
        {seller.statusReason
          ? `Reason: ${seller.statusReason}`
          : "Your seller application was not approved."}
      </p>
      {seller.store && (
        <p className="mt-2.5 text-[13px] text-subtle">
          {seller.store.name} is no longer manageable while your application is
          rejected.
        </p>
      )}

      {!canReapply && countdownLabel && (
        <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-surface-sunken px-4 py-2 text-[13px] font-medium text-ink-2">
          <Clock size={14} className="text-subtle" />
          You can reapply in {countdownLabel}
        </div>
      )}

      {canReapply && (
        <Button
          className="mx-auto mt-7 w-fit"
          variant="tribely"
          loading={isPending}
          onClick={() => becomeSeller({})}
        >
          Apply again
        </Button>
      )}
    </section>
  );
}

function CreateStoreForm() {
  const router = useRouter();
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
    instagram: "",
    whatsapp: "",
    facebook: "",
    tiktok: "",
  });
  const [logo, setLogo] = useState<string>();
  const [banner, setBanner] = useState<string>();

  const { mutate: uploadImage, isPending: isUploading } = useImageUpload();
  const { mutate: createStore, isPending: isCreating } = useCreateStore();

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFile = (
    file: File | undefined,
    onDone: (url: string) => void
  ) => {
    if (!file) return;
    uploadImage(file, { onSuccess: onDone });
  };

  const canSubmit = form.name.trim().length > 0 && !isCreating && !isUploading;

  const handleSubmit = () => {
    if (!canSubmit) return;

    createStore(
      {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
        city: form.city.trim() || undefined,
        state: form.state.trim() || undefined,
        country: form.country.trim() || undefined,
        instagram: form.instagram.trim() || undefined,
        whatsapp: form.whatsapp.trim() || undefined,
        facebook: form.facebook.trim() || undefined,
        tiktok: form.tiktok.trim() || undefined,
        logo,
        banner,
      },
      // replace, not push: Back from the dashboard shouldn't reopen a
      // completed setup form.
      { onSuccess: () => router.replace("/settings/marketplace") }
    );
  };

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-6 sm:p-10">
      <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] text-ink">
        Set up your store
      </h1>
      <p className="mt-2.5 text-[13.5px] text-muted">
        Tell buyers who you are. You can update this later.
      </p>

      <div className="mt-8 grid gap-4">
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

        <Input
          label="Store name"
          value={form.name}
          onChange={update("name")}
          placeholder="e.g. Daniel's Electronics"
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-ink-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={update("description")}
            rows={3}
            placeholder="What does your store sell?"
            className="w-full rounded-2xl border border-line bg-surface px-5 py-3.5 text-[14px] text-ink outline-none transition-colors focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-500/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="store@example.com"
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+234..."
          />
        </div>

        <Input
          label="Address"
          value={form.address}
          onChange={update("address")}
          placeholder="Street address"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="City" value={form.city} onChange={update("city")} />
          <Input label="State" value={form.state} onChange={update("state")} />
          <Input
            label="Country"
            value={form.country}
            onChange={update("country")}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-ink-2">Social links <span className="font-normal text-subtle">(optional)</span></p>
          <p className="mt-0.5 text-[12.5px] text-muted">Shown on your store page so buyers can see you&apos;re active. Paste a username or link.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Input label="Instagram" value={form.instagram} onChange={update("instagram")} placeholder="@yourshop" autoCapitalize="none" />
            <Input label="WhatsApp number" value={form.whatsapp} onChange={update("whatsapp")} placeholder="0815 967 1809" inputMode="tel" />
            <Input label="Facebook page" value={form.facebook} onChange={update("facebook")} placeholder="facebook.com/yourshop" autoCapitalize="none" />
            <Input label="TikTok" value={form.tiktok} onChange={update("tiktok")} placeholder="@yourshop" autoCapitalize="none" />
          </div>
        </div>

        <div className="rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-3.5 text-[13px] leading-relaxed text-ink-2 dark:border-violet-500/30 dark:bg-violet-500/10">
          <p className="font-semibold text-ink">Next, in Seller Hub &rarr; Store settings:</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4">
            <li>
              <span className="font-medium text-ink">Delivery zones or pickup</span> - buyers can only order if they have a way to get it.
            </li>
            <li>
              <span className="font-medium text-ink">Payout bank account</span> - so each sale is paid straight to your bank.
            </li>
            <li>
              <span className="font-medium text-ink">Your first product</span> - publish it and you&apos;re open for orders.
            </li>
          </ul>
        </div>

        <Button
          variant="tribely"
          className="mt-2 w-full"
          loading={isCreating || isUploading}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Create store
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
      <label className="mb-2 block text-sm font-medium text-ink-2">
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
